from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.attendance import AttendanceCreate, AttendanceResponse
from app.services.attendance_service import get_attendance, mark_attendance

router = APIRouter(prefix="/attendance")


@router.get("", response_model=list[AttendanceResponse])
def list_attendance(
    employee_id: UUID | None = Query(default=None, alias="employeeId"),
    date_filter: date | None = Query(default=None, alias="date"),
    db: Session = Depends(get_db),
):
    return get_attendance(db, employee_id=employee_id, date_filter=date_filter)


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance_route(data: AttendanceCreate, db: Session = Depends(get_db)):
    return mark_attendance(db, data)
