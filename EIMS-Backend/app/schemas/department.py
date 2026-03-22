"""部门相关DTO"""
from typing import Optional

from pydantic import BaseModel, Field


class DepartmentBase(BaseModel):
    """部门基础模型"""
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    parent_id: Optional[int] = None


class DepartmentCreate(DepartmentBase):
    """创建部门模型"""
    pass


class DepartmentUpdate(BaseModel):
    """更新部门模型"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    parent_id: Optional[int] = None


class DepartmentResponse(DepartmentBase):
    """部门响应模型"""
    id: int
    
    class Config:
        from_attributes = True
