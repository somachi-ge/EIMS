"""部门模型"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Department(Base):
    """部门表"""
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    
    # 关系
    users = relationship("User", back_populates="department")
    parent = relationship("Department", remote_side=[id], backref="children")
