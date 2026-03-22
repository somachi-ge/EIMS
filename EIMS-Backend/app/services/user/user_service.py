"""用户服务"""
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    """用户服务类"""
    
    def create_user(self, db: Session, user: UserCreate) -> User:
        """创建用户"""
        db_user = User(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            password_hash=get_password_hash(user.password),
            role_id=user.role_id,
            department_id=user.department_id
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def get_users(self, db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """获取用户列表"""
        return db.query(User).offset(skip).limit(limit).all()
    
    def get_user(self, db: Session, user_id: int) -> User:
        """获取用户详情"""
        return db.query(User).filter(User.id == user_id).first()
    
    def update_user(self, db: Session, user_id: int, user: UserUpdate) -> User:
        """更新用户"""
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise ValueError("用户不存在")
        
        update_data = user.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["password_hash"] = get_password_hash(update_data.pop("password"))
        
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def delete_user(self, db: Session, user_id: int) -> None:
        """删除用户"""
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise ValueError("用户不存在")
        db.delete(db_user)
        db.commit()
