"""角色权限接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.schemas.role import RoleCreate, RoleUpdate, RoleResponse
from app.services.user.role_service import RoleService

router = APIRouter()

role_service = RoleService()

@router.post("/", response_model=RoleResponse, summary="创建角色")
async def create_role(role: RoleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """创建新角色"""
    return role_service.create_role(db, role)

@router.get("/", response_model=list[RoleResponse], summary="获取角色列表")
async def get_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取角色列表"""
    return role_service.get_roles(db, skip=skip, limit=limit)

@router.get("/{role_id}", response_model=RoleResponse, summary="获取角色详情")
async def get_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取角色详情"""
    role = role_service.get_role(db, role_id)
    if role is None:
        raise HTTPException(status_code=404, detail="角色不存在")
    return role

@router.put("/{role_id}", response_model=RoleResponse, summary="更新角色")
async def update_role(role_id: int, role: RoleUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新角色信息"""
    return role_service.update_role(db, role_id, role)

@router.delete("/{role_id}", summary="删除角色")
async def delete_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """删除角色"""
    role_service.delete_role(db, role_id)
    return {"message": "角色删除成功"}
