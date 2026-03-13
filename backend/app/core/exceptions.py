"""Custom exception hierarchy for the HRMS Lite application."""


class HRMSException(Exception):
    """Base exception for all application-level errors."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class EmployeeNotFoundError(HRMSException):
    """Raised when a requested employee does not exist."""

    def __init__(self) -> None:
        super().__init__("Employee not found", 404)


class DuplicateEmployeeIdError(HRMSException):
    """Raised when an employee ID already exists in the database."""

    def __init__(self, employee_id: str) -> None:
        super().__init__(f"Employee with ID '{employee_id}' already exists", 409)


class DuplicateEmailError(HRMSException):
    """Raised when an employee email already exists in the database."""

    def __init__(self, email: str) -> None:
        super().__init__(f"Employee with email '{email}' already exists", 409)


class DuplicateAttendanceError(HRMSException):
    """Raised when attendance has already been recorded for an employee on a date."""

    def __init__(self) -> None:
        super().__init__(
            "Attendance already marked for this employee on this date", 409
        )
