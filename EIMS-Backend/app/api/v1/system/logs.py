"""日志管理接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.services.system.log_service import LogService

router = APIRouter()

log_service = LogService()

@router.get("/", summary="获取日志列表")
async def get_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取日志列表"""
    return log_service.get_logs(db, skip=skip, limit=limit)

@router.get("/{log_id}", summary="获取日志详情")
async def get_log(log_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取日志详情"""
    log = log_service.get_log(db, log_id)
    if log is None:
        raise HTTPException(status_code=404, detail="日志不存在")
    return log

@router.delete("/", summary="清理日志")
async def clear_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """清理日志"""
    log_service.clear_logs(db)
    return {"message": "日志清理成功"}
