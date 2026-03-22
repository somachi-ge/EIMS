"""认证服务"""
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.models.user import User


class AuthService:
    """认证服务类"""
    
    def authenticate_user(self, db: Session, username: str, password: str) -> User:
        """验证用户身份"""
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user
