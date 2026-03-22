"""通知服务"""
from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationService:
    """通知服务类"""
    
    def get_notifications(self, db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[Notification]:
        """获取通知列表"""
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_notification(self, db: Session, notification_id: int, user_id: int) -> Notification:
        """获取通知详情"""
        return db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
    
    def mark_notification_read(self, db: Session, notification_id: int, user_id: int) -> Notification:
        """标记通知为已读"""
        notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
        if not notification:
            raise ValueError("通知不存在")
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return notification
    
    def delete_notification(self, db: Session, notification_id: int, user_id: int) -> None:
        """删除通知"""
        notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
        if not notification:
            raise ValueError("通知不存在")
        db.delete(notification)
        db.commit()
