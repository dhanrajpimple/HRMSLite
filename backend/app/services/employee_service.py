"""Service layer for employee CRUD operations."""

from uuid import UUID

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.core.exceptions import (
    DuplicateEmailError,
    DuplicateEmployeeIdError,
    EmployeeNotFoundError,
)
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


def get_all_employees(db: Session, search: str | None = None) -> list[Employee]:
    """Return all employees, optionally filtered by a search term."""
    query = db.query(Employee)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Employee.full_name.ilike(pattern),
                Employee.email.ilike(pattern),
                Employee.department.ilike(pattern),
                Employee.employee_id.ilike(pattern),
            )
        )
    return query.order_by(Employee.created_at.desc()).all()


def get_employee_by_id(db: Session, employee_id: UUID) -> Employee | None:
    """Fetch a single employee by primary key UUID."""
    return db.query(Employee).filter(Employee.id == employee_id).first()


def get_employee_by_employee_id_string(db: Session, employee_id_str: str) -> Employee | None:
    """Fetch a single employee by their human-readable employee ID string."""
    return db.query(Employee).filter(Employee.employee_id == employee_id_str).first()


def get_employee_by_email(db: Session, email: str) -> Employee | None:
    """Fetch a single employee by email (case-insensitive)."""
    return db.query(Employee).filter(func.lower(Employee.email) == email.lower()).first()


def create_employee(db: Session, data: EmployeeCreate) -> Employee:
    """
    Create a new employee record.

    Raises:
        DuplicateEmployeeIdError: If the employee_id already exists.
        DuplicateEmailError: If the email already exists.
    """
    if get_employee_by_employee_id_string(db, data.employee_id):
        raise DuplicateEmployeeIdError(data.employee_id)

    if get_employee_by_email(db, str(data.email)):
        raise DuplicateEmailError(str(data.email))

    employee = Employee(
        employee_id=data.employee_id,
        full_name=data.full_name,
        email=str(data.email),
        department=data.department,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def update_employee(db: Session, employee_id: UUID, data: EmployeeUpdate) -> Employee:
    """
    Update fields on an existing employee.

    Raises:
        EmployeeNotFoundError: If no employee matches the UUID.
        DuplicateEmployeeIdError: If the new employee_id conflicts.
        DuplicateEmailError: If the new email conflicts.
    """
    employee = get_employee_by_id(db, employee_id)
    if not employee:
        raise EmployeeNotFoundError()

    update_data = data.model_dump(exclude_unset=True)

    if "employee_id" in update_data:
        existing = get_employee_by_employee_id_string(db, update_data["employee_id"])
        if existing and existing.id != employee_id:
            raise DuplicateEmployeeIdError(update_data["employee_id"])

    if "email" in update_data:
        existing = get_employee_by_email(db, str(update_data["email"]))
        if existing and existing.id != employee_id:
            raise DuplicateEmailError(str(update_data["email"]))

    for field, value in update_data.items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    return employee


def delete_employee(db: Session, employee_id: UUID) -> None:
    """
    Permanently delete an employee and cascade-remove their attendance records.

    Raises:
        EmployeeNotFoundError: If no employee matches the UUID.
    """
    employee = get_employee_by_id(db, employee_id)
    if not employee:
        raise EmployeeNotFoundError()

    db.delete(employee)
    db.commit()
