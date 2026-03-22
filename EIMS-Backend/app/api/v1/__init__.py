"""API v1 版本"""
from fastapi import APIRouter

from app.api.v1.auth import auth
from app.api.v1.user import users, roles
from app.api.v1.organization import departments
from app.api.v1.system import system, logs, backup, monitor, notifications

api_router = APIRouter()

# 注册认证路由
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])

# 注册用户路由
api_router.include_router(users.router, prefix="/users", tags=["用户管理"])
api_router.include_router(roles.router, prefix="/roles", tags=["角色权限"])

# 注册组织路由
api_router.include_router(departments.router, prefix="/departments", tags=["部门管理"])

# 注册系统路由
api_router.include_router(system.router, prefix="/system", tags=["系统配置"])
api_router.include_router(logs.router, prefix="/logs", tags=["日志管理"])
api_router.include_router(backup.router, prefix="/backup", tags=["备份恢复"])
api_router.include_router(monitor.router, prefix="/monitor", tags=["系统监控"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["通知管理"])
