"""角色服务"""
from sqlalchemy.orm import Session

from app.models.role import Role, Permission


class RoleService:
    """角色服务类"""
    
    def create_role(self, db: Session, role: dict) -> Role:
        """创建角色"""
        db_role = Role(
            name=role.name,
            description=role.description
        )
        
        if hasattr(role, 'permission_ids') and role.permission_ids:
            permissions = db.query(Permission).filter(Permission.id.in_(role.permission_ids)).all()
            db_role.permissions.extend(permissions)
        
        db.add(db_role)
        db.commit()
        db.refresh(db_role)
        return db_role
    
    def get_roles(self, db: Session, skip: int = 0, limit: int = 100) -> list[Role]:
        """获取角色列表"""
        return db.query(Role).offset(skip).limit(limit).all()
    
    def get_role(self, db: Session, role_id: int) -> Role:
        """获取角色详情"""
        return db.query(Role).filter(Role.id == role_id).first()
    
    def update_role(self, db: Session, role_id: int, role: dict) -> Role:
        """更新角色"""
        db_role = db.query(Role).filter(Role.id == role_id).first()
        if not db_role:
            raise ValueError("角色不存在")
        
        update_data = role.dict(exclude_unset=True)
        
        if "name" in update_data:
            db_role.name = update_data["name"]
        if "description" in update_data:
            db_role.description = update_data["description"]
        if "permission_ids" in update_data:
            permissions = db.query(Permission).filter(Permission.id.in_(update_data["permission_ids"])).all()
            db_role.permissions = permissions
        
        db.commit()
        db.refresh(db_role)
        return db_role
    
    def delete_role(self, db: Session, role_id: int) -> None:
        """删除角色"""
        db_role = db.query(Role).filter(Role.id == role_id).first()
        if not db_role:
            raise ValueError("角色不存在")
        db.delete(db_role)
        db.commit()
