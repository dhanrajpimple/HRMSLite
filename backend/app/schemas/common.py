from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class ErrorDetail(BaseSchema):
    field: str | None = None
    message: str


class ErrorResponse(BaseSchema):
    error: str
    details: list[ErrorDetail] | None = None


class DashboardStats(BaseSchema):
    total_employees: int
    present_today: int
    absent_today: int
    on_holiday_today: int
    attendance_rate: float
