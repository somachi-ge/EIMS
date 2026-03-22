"""通知管理接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.services.system.notification_service import NotificationService

router = APIRouter()

notification_service = NotificationService()

@router.get("/", summary="获取通知列表")
async def get_notifications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取通知列表"""
    return notification_service.get_notifications(db, current_user.id, skip=skip, limit=limit)

@router.get("/{notification_id}", summary="获取通知详情")
async def get_notification(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取通知详情"""
    notification = notification_service.get_notification(db, notification_id, current_user.id)
    if notification is None:
        raise HTTPException(status_code=404, detail="通知不存在")
    return notification

@router.put("/{notification_id}/read", summary="标记通知为已读")
async def mark_notification_read(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """标记通知为已读"""
    return notification_service.mark_notification_read(db, notification_id, current_user.id)

@router.delete("/{notification_id}", summary="删除通知")
async def delete_notification(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """删除通知"""
    notification_service.delete_notification(db, notification_id, current_user.id)
    return {"message": "通知删除成功"}
