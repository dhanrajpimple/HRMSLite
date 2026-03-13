from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.services.employee_service import (
    create_employee,
    delete_employee,
    get_all_employees,
    update_employee,
)

router = APIRouter(prefix="/employees")


@router.get("", response_model=list[EmployeeResponse])
def list_employees(
    search: str | None = Query(default=None, min_length=1),
    db: Session = Depends(get_db),
):
    return get_all_employees(db, search=search)


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee_route(data: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, data)


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee_route(
    employee_id: UUID, data: EmployeeUpdate, db: Session = Depends(get_db)
):
    return update_employee(db, employee_id, data)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee_route(employee_id: UUID, db: Session = Depends(get_db)):
    delete_employee(db, employee_id)
    return None
