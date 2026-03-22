"""角色相关DTO"""
from typing import Optional, List

from pydantic import BaseModel, Field


class RoleBase(BaseModel):
    """角色基础模型"""
    name: str = Field(..., min_length=2, max_length=50)
    description: Optional[str] = None


class RoleCreate(RoleBase):
    """创建角色模型"""
    permission_ids: Optional[List[int]] = []


class RoleUpdate(BaseModel):
    """更新角色模型"""
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = None
    permission_ids: Optional[List[int]] = []


class RoleResponse(RoleBase):
    """角色响应模型"""
    id: int
    
    class Config:
        from_attributes = True
