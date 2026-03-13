from datetime import date
from uuid import UUID

from sqlalchemy import and_, func
from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import DuplicateAttendanceError, EmployeeNotFoundError
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
    query = db.query(Attendance).join(Employee).filter(Employee.is_active == True).options(joinedload(Attendance.employee))

    filters = []
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
        attendance = Attendance(employee_id=data.employee_id, date=data.date, status=data.status)
        db.add(attendance)
        
    db.commit()
    db.refresh(attendance)
    return (
        db.query(Attendance)
        .options(joinedload(Attendance.employee))
        .filter(Attendance.id == attendance.id)
        .first()
    )


def get_dashboard_stats(db: Session) -> DashboardStats:
    today = date.today()
    total_employees = db.query(func.count(Employee.id)).filter(Employee.is_active == True).scalar() or 0

    present_today = (
        db.query(func.count(Attendance.id))
        .join(Employee)
        .filter(Attendance.date == today, Attendance.status == "present", Employee.is_active == True)
        .scalar()
        or 0
    )
    absent_today = (
        db.query(func.count(Attendance.id))
        .join(Employee)
        .filter(Attendance.date == today, Attendance.status == "absent", Employee.is_active == True)
        .scalar()
        or 0
    )
    on_holiday_today = (
        db.query(func.count(Attendance.id))
        .join(Employee)
        .filter(Attendance.date == today, Attendance.status == "holiday", Employee.is_active == True)
        .scalar()
        or 0
    )

    attendance_rate = (present_today / total_employees * 100) if total_employees > 0 else 0.0

    return DashboardStats(
        total_employees=int(total_employees),
        present_today=int(present_today),
        absent_today=int(absent_today),
        on_holiday_today=int(on_holiday_today),
        attendance_rate=round(float(attendance_rate), 2),
    )


def get_present_days_per_employee(db: Session) -> dict[UUID, int]:
    rows = (
        db.query(Attendance.employee_id, func.count(Attendance.id))
        .filter(Attendance.status == "present")
        .group_by(Attendance.employee_id)
        .all()
    )
    return {employee_id: int(count) for employee_id, count in rows}
