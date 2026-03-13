"""HRMS Lite – FastAPI application entry point."""

import logging
import sys
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import HRMSException
from app.database import Base, engine
from app.routers import attendance_router, dashboard_router, employees_router
from app.schemas.common import ErrorDetail, ErrorResponse

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
logging.basicConfig(
    level=logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO,
    format=LOG_FORMAT,
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan (replaces deprecated @app.on_event)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Application lifecycle hook – creates tables on startup."""
    logger.info("Starting HRMS Lite API v%s (%s)", _app.version, settings.ENVIRONMENT)
    Base.metadata.create_all(bind=engine)
    yield
    logger.info("Shutting down HRMS Lite API")


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="HRMS Lite API",
    description="Human Resource Management System – Employee & Attendance API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Exception Handlers
# ---------------------------------------------------------------------------
@app.exception_handler(HRMSException)
async def hrms_exception_handler(_request: Request, exc: HRMSException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"error": exc.message})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    details: list[ErrorDetail] = []
    for err in exc.errors():
        loc = err.get("loc", [])
        field = loc[-1] if loc else None
        if isinstance(field, int):
            field = str(field)
        if field and "_" in str(field):
            parts = str(field).split("_")
            field = parts[0] + "".join(word.capitalize() for word in parts[1:])
        details.append(ErrorDetail(field=field, message=err.get("msg", "Invalid value")))

    payload = ErrorResponse(error="Validation failed", details=details)
    return JSONResponse(status_code=422, content=payload.model_dump())


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    _request: Request, exc: Exception
) -> JSONResponse:
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(status_code=500, content={"error": "Internal server error"})


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(employees_router, prefix="/api", tags=["Employees"])
app.include_router(attendance_router, prefix="/api", tags=["Attendance"])
app.include_router(dashboard_router, prefix="/api", tags=["Dashboard"])


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["System"])
async def health() -> dict[str, str]:
    """Lightweight health probe for load balancers and uptime monitors."""
    return {"status": "ok", "version": app.version}
