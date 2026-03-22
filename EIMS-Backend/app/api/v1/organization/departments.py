"""部门管理接口"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_db
from app.models.user import User
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.services.organization.department_service import DepartmentService

router = APIRouter()

department_service = DepartmentService()

@router.post("/", response_model=DepartmentResponse, summary="创建部门")
async def create_department(department: DepartmentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """创建新部门"""
    return department_service.create_department(db, department)

@router.get("/", response_model=list[DepartmentResponse], summary="获取部门列表")
async def get_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取部门列表"""
    return department_service.get_departments(db, skip=skip, limit=limit)

@router.get("/{department_id}", response_model=DepartmentResponse, summary="获取部门详情")
async def get_department(department_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """获取部门详情"""
    department = department_service.get_department(db, department_id)
    if department is None:
        raise HTTPException(status_code=404, detail="部门不存在")
    return department

@router.put("/{department_id}", response_model=DepartmentResponse, summary="更新部门")
async def update_department(department_id: int, department: DepartmentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """更新部门信息"""
    return department_service.update_department(db, department_id, department)

@router.delete("/{department_id}", summary="删除部门")
async def delete_department(department_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """删除部门"""
    department_service.delete_department(db, department_id)
    return {"message": "部门删除成功"}
