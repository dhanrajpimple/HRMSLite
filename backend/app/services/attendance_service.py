"""Service layer for attendance operations and dashboard statistics."""

from datetime import date
from uuid import UUID

from sqlalchemy import and_, func
from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import EmployeeNotFoundError
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate
from app.schemas.common import DashboardStats


def get_attendance(
    db: Session,
    employee_id: UUID | None = None,
    date_filter: date | None = None,
    month: int | None = None,
    year: int | None = None,
) -> list[Attendance]:
    """
    Retrieve attendance records with dynamic filtering.

    Only includes records for active employees. Supports filtering by
    employee, exact date, month, and/or year.
    """
    query = (
        db.query(Attendance)
        .join(Employee)
        .filter(Employee.is_active.is_(True))
        .options(joinedload(Attendance.employee))
    )

    filters: list = []
    if employee_id is not None:
        filters.append(Attendance.employee_id == employee_id)
    if date_filter is not None:
        filters.append(Attendance.date == date_filter)
    if month is not None:
        filters.append(func.extract("month", Attendance.date) == month)
    if year is not None:
        filters.append(func.extract("year", Attendance.date) == year)

    if filters:
        query = query.filter(and_(*filters))

    return query.order_by(Attendance.date.desc(), Attendance.created_at.desc()).all()


def mark_attendance(db: Session, data: AttendanceCreate) -> Attendance:
    """
    Create or update an attendance record for a given employee and date.

    If a record already exists for the employee on the specified date,
    the status is updated (upsert behaviour).

    Raises:
        EmployeeNotFoundError: If the employee UUID does not exist.
    """
    employee = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not employee:
        raise EmployeeNotFoundError()

    existing = (
        db.query(Attendance)
        .filter(Attendance.employee_id == data.employee_id, Attendance.date == data.date)
        .first()
    )

    if existing:
        existing.status = data.status
        attendance = existing
    else:
        attendance = Attendance(
            employee_id=data.employee_id, date=data.date, status=data.status
        )
        db.add(attendance)

    db.commit()
    db.refresh(attendance)

    # Re-query with eager-loaded employee relationship.
    return (
        db.query(Attendance)
        .options(joinedload(Attendance.employee))
        .filter(Attendance.id == attendance.id)
        .first()
    )


def get_dashboard_stats(db: Session) -> DashboardStats:
    """Compute aggregate attendance statistics for the current day."""
    today = date.today()
    total_employees = (
        db.query(func.count(Employee.id))
        .filter(Employee.is_active.is_(True))
        .scalar()
        or 0
    )

    present_today = (
        db.query(func.count(Attendance.id))
        .join(Employee)
        .filter(
            Attendance.date == today,
            Attendance.status == "present",
            Employee.is_active.is_(True),
        )
        .scalar()
        or 0
    )
    absent_today = (
        db.query(func.count(Attendance.id))
        .join(Employee)
        .filter(
            Attendance.date == today,
            Attendance.status == "absent",
            Employee.is_active.is_(True),
        )
        .scalar()
        or 0
    )
    on_holiday_today = (
        db.query(func.count(Attendance.id))
        .join(Employee)
        .filter(
            Attendance.date == today,
            Attendance.status == "holiday",
            Employee.is_active.is_(True),
        )
        .scalar()
        or 0
    )

    attendance_rate = (
        (present_today / total_employees * 100) if total_employees > 0 else 0.0
    )

    return DashboardStats(
        total_employees=int(total_employees),
        present_today=int(present_today),
        absent_today=int(absent_today),
        on_holiday_today=int(on_holiday_today),
        attendance_rate=round(float(attendance_rate), 2),
    )


def get_present_days_per_employee(db: Session) -> dict[UUID, int]:
    """Return a mapping of employee UUID → total days marked as present."""
    rows = (
        db.query(Attendance.employee_id, func.count(Attendance.id))
        .filter(Attendance.status == "present")
        .group_by(Attendance.employee_id)
        .all()
    )
    return {employee_id: int(count) for employee_id, count in rows}
