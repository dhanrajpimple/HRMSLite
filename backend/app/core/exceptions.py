class HRMSException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class EmployeeNotFoundError(HRMSException):
    def __init__(self):
        super().__init__("Employee not found", 404)


class DuplicateEmployeeIdError(HRMSException):
    def __init__(self, employee_id: str):
        super().__init__(f"Employee with ID '{employee_id}' already exists", 409)


class DuplicateEmailError(HRMSException):
    def __init__(self, email: str):
        super().__init__(f"Employee with email '{email}' already exists", 409)


class DuplicateAttendanceError(HRMSException):
    def __init__(self):
        super().__init__("Attendance already marked for this employee on this date", 409)
