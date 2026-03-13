import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import HRMSException
from app.database import Base, engine
from app.routers import attendance_router, dashboard_router, employees_router
from app.schemas.common import ErrorDetail, ErrorResponse

logger = logging.getLogger(__name__)

app = FastAPI(
    title="HRMS Lite API",
    description="Human Resource Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HRMSException)
def hrms_exception_handler(_: Request, exc: HRMSException):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.message})


@app.exception_handler(RequestValidationError)
def validation_exception_handler(_: Request, exc: RequestValidationError):
    details: list[ErrorDetail] = []
    for err in exc.errors():
        loc = err.get("loc", [])
        field = loc[-1] if loc else None
        if isinstance(field, int):
            field = str(field)
        if field and "_" in field:
            parts = field.split("_")
            field = parts[0] + "".join(word.capitalize() for word in parts[1:])
        details.append(ErrorDetail(field=field, message=err.get("msg", "Invalid value")))

    payload = ErrorResponse(error="Validation failed", details=details)
    return JSONResponse(status_code=422, content=payload.model_dump())


@app.exception_handler(Exception)
def unhandled_exception_handler(_: Request, exc: Exception):
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(status_code=500, content={"error": "Internal server error"})


app.include_router(employees_router, prefix="/api", tags=["employees"])
app.include_router(attendance_router, prefix="/api", tags=["attendance"])
app.include_router(dashboard_router, prefix="/api", tags=["dashboard"])


@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
