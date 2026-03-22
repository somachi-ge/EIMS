"""异常处理"""
from fastapi import HTTPException, status


class CustomException(HTTPException):
    """自定义异常类"""
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


class UnauthorizedException(CustomException):
    """未授权异常"""
    def __init__(self, detail: str = "未授权访问"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


class ForbiddenException(CustomException):
    """禁止访问异常"""
    def __init__(self, detail: str = "禁止访问"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class NotFoundException(CustomException):
    """资源不存在异常"""
    def __init__(self, detail: str = "资源不存在"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class BadRequestException(CustomException):
    """请求参数错误异常"""
    def __init__(self, detail: str = "请求参数错误"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
