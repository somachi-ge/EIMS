"""用户相关DTO"""
from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """用户基础模型"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    role_id: Optional[int] = None
    department_id: Optional[int] = None


class UserCreate(UserBase):
    """创建用户模型"""
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """更新用户模型"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    password: Optional[str] = Field(None, min_length=6)
    role_id: Optional[int] = None
    department_id: Optional[int] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """用户响应模型"""
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
