"""部门服务"""
from sqlalchemy.orm import Session

from app.models.department import Department


class DepartmentService:
    """部门服务类"""
    
    def create_department(self, db: Session, department: dict) -> Department:
        """创建部门"""
        db_department = Department(
            name=department.name,
            description=department.description,
            parent_id=department.parent_id
        )
        db.add(db_department)
        db.commit()
        db.refresh(db_department)
        return db_department
    
    def get_departments(self, db: Session, skip: int = 0, limit: int = 100) -> list[Department]:
        """获取部门列表"""
        return db.query(Department).offset(skip).limit(limit).all()
    
    def get_department(self, db: Session, department_id: int) -> Department:
        """获取部门详情"""
        return db.query(Department).filter(Department.id == department_id).first()
    
    def update_department(self, db: Session, department_id: int, department: dict) -> Department:
        """更新部门"""
        db_department = db.query(Department).filter(Department.id == department_id).first()
        if not db_department:
            raise ValueError("部门不存在")
        
        update_data = department.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_department, field, value)
        
        db.commit()
        db.refresh(db_department)
        return db_department
    
    def delete_department(self, db: Session, department_id: int) -> None:
        """删除部门"""
        db_department = db.query(Department).filter(Department.id == department_id).first()
        if not db_department:
            raise ValueError("部门不存在")
        db.delete(db_department)
        db.commit()
