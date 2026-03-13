from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import field_validator
from app.schemas.common import BaseSchema
from app.schemas.employee import EmployeeResponse


class AttendanceCreate(BaseSchema):
    employee_id: UUID
    date: date
    status: Literal["present", "absent", "holiday"]

    @field_validator("date")
    @classmethod
    def validate_date(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Cannot mark attendance for a future date")
        return value


class AttendanceResponse(BaseSchema):
    id: UUID
    employee_id: UUID
    date: date
    status: str
    created_at: datetime
    employee: EmployeeResponse | None = None
