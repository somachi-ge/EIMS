"""通用DTO"""
from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

DataT = TypeVar("DataT")


class ResponseBase(BaseModel):
    """响应基础模型"""
    code: int = 0
    message: str = ""
    data: Any = None
    request_id: str = ""


class PaginatedResponse(BaseModel, Generic[DataT]):
    """分页响应模型"""
    items: list[DataT]
    total: int
    page: int
    size: int
    pages: int
