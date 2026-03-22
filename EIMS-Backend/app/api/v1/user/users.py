"""用户管理接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.user.user_service import UserService

router = APIRouter()

user_service = UserService()

@router.post("/", response_model=UserResponse, summary="创建用户")
async def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """创建新用户"""
    return user_service.create_user(db, user)

@router.get("/", response_model=list[UserResponse], summary="获取用户列表")
async def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取用户列表"""
    return user_service.get_users(db, skip=skip, limit=limit)

@router.get("/{user_id}", response_model=UserResponse, summary="获取用户详情")
async def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取用户详情"""
    user = user_service.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user

@router.put("/{user_id}", response_model=UserResponse, summary="更新用户")
async def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新用户信息"""
    return user_service.update_user(db, user_id, user)

@router.delete("/{user_id}", summary="删除用户")
async def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """删除用户"""
    user_service.delete_user(db, user_id)
    return {"message": "用户删除成功"}
