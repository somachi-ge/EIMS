"""备份恢复接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.services.system.backup_service import BackupService

router = APIRouter()

backup_service = BackupService()

@router.post("/create", summary="创建备份")
async def create_backup(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """创建系统备份"""
    return backup_service.create_backup(db)

@router.get("/list", summary="获取备份列表")
async def get_backups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取备份列表"""
    return backup_service.get_backups(db, skip=skip, limit=limit)

@router.post("/restore/{backup_id}", summary="恢复备份")
async def restore_backup(backup_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """恢复系统备份"""
    return backup_service.restore_backup(db, backup_id)

@router.delete("/{backup_id}", summary="删除备份")
async def delete_backup(backup_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """删除备份"""
    backup_service.delete_backup(db, backup_id)
    return {"message": "备份删除成功"}
