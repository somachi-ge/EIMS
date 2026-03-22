"""日志服务"""
from sqlalchemy.orm import Session

from app.models.log import Log


class LogService:
    """日志服务类"""
    
    def get_logs(self, db: Session, skip: int = 0, limit: int = 100) -> list[Log]:
        """获取日志列表"""
        return db.query(Log).order_by(Log.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_log(self, db: Session, log_id: int) -> Log:
        """获取日志详情"""
        return db.query(Log).filter(Log.id == log_id).first()
    
    def clear_logs(self, db: Session) -> None:
        """清理日志"""
        db.query(Log).delete()
        db.commit()
