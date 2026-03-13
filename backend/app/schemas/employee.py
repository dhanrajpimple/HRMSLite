from datetime import datetime
from uuid import UUID

from pydantic import EmailStr, field_validator
from app.schemas.common import BaseSchema

VALID_DEPARTMENTS = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Design",
    "Product",
]


class EmployeeCreate(BaseSchema):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Employee ID is required")
        if len(value) > 50:
            raise ValueError("Employee ID must be 50 characters or fewer")
        return value

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Full name must be at least 2 characters")
        if len(value) > 255:
            raise ValueError("Full name must be 255 characters or fewer")
        return value

    @field_validator("department")
    @classmethod
    def validate_department(cls, value: str) -> str:
        if value not in VALID_DEPARTMENTS:
            raise ValueError(f"Department must be one of: {', '.join(VALID_DEPARTMENTS)}")
        return value


class EmployeeUpdate(BaseSchema):
    employee_id: str | None = None
    full_name: str | None = None
    email: EmailStr | None = None
    department: str | None = None
    is_active: bool | None = None

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip()
        if not value:
            raise ValueError("Employee ID cannot be empty")
        if len(value) > 50:
            raise ValueError("Employee ID must be 50 characters or fewer")
        return value

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Full name must be at least 2 characters")
        if len(value) > 255:
            raise ValueError("Full name must be 255 characters or fewer")
        return value

    @field_validator("department")
    @classmethod
    def validate_department(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if value not in VALID_DEPARTMENTS:
            raise ValueError(f"Department must be one of: {', '.join(VALID_DEPARTMENTS)}")
        return value


class EmployeeResponse(BaseSchema):
    id: UUID
    employee_id: str
    full_name: str
    email: str
    department: str
    is_active: bool
    created_at: datetime
