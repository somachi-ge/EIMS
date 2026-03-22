"""监控服务"""
from sqlalchemy.orm import Session
import psutil


class MonitorService:
    """监控服务类"""
    
    def get_system_status(self, db: Session) -> dict:
        """获取系统状态"""
        # 这里可以获取系统状态信息
        return {
            "status": "running",
            "cpu_usage": psutil.cpu_percent(),
            "memory_usage": psutil.virtual_memory().percent,
            "disk_usage": psutil.disk_usage('/').percent
        }
    
    def get_system_metrics(self, db: Session) -> dict:
        """获取系统指标"""
        # 这里可以获取系统指标信息
        return {
            "cpu": {
                "count": psutil.cpu_count(),
                "percent": psutil.cpu_percent(percpu=True)
            },
            "memory": {
                "total": psutil.virtual_memory().total,
                "used": psutil.virtual_memory().used,
                "available": psutil.virtual_memory().available
            },
            "disk": {
                "total": psutil.disk_usage('/').total,
                "used": psutil.disk_usage('/').used,
                "free": psutil.disk_usage('/').free
            }
        }
