from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.common import DashboardStats
from app.services.attendance_service import get_dashboard_stats

router = APIRouter(prefix="/dashboard")


@router.get("/stats", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db)):
    return get_dashboard_stats(db)
