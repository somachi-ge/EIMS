"""认证相关接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import create_access_token
from app.services.auth.auth_service import AuthService

router = APIRouter()

auth_service = AuthService()

@router.post("/login", summary="用户登录")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """用户登录获取访问令牌"""
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout", summary="用户登出")
async def logout():
    """用户登出"""
    # 这里可以添加登出逻辑，例如将令牌加入黑名单
    return {"message": "登出成功"}
