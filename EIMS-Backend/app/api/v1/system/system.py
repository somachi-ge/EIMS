"""系统配置接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.services.system.system_service import SystemService

router = APIRouter()

system_service = SystemService()

@router.get("/config", summary="获取系统配置")
async def get_system_config(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取系统配置"""
    return system_service.get_system_config(db)

@router.put("/config", summary="更新系统配置")
async def update_system_config(config: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新系统配置"""
    return system_service.update_system_config(db, config)
