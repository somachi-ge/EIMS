"""系统监控接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.services.system.monitor_service import MonitorService

router = APIRouter()

monitor_service = MonitorService()

@router.get("/status", summary="获取系统状态")
async def get_system_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取系统状态"""
    return monitor_service.get_system_status(db)

@router.get("/metrics", summary="获取系统指标")
async def get_system_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取系统指标"""
    return monitor_service.get_system_metrics(db)
