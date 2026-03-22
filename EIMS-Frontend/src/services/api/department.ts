import request from '../request';

export const departmentApi = {
  // 获取部门列表
  getDepartmentList: (params: any) => {
    return request({
      url: '/api/departments',
      method: 'get',
      params
    });
  },
  
  // 获取部门详情
  getDepartmentDetail: (id: number) => {
    return request({
      url: `/api/departments/${id}`,
      method: 'get'
    });
  },
  
  // 添加部门
  addDepartment: (data: any) => {
    return request({
      url: '/api/departments',
      method: 'post',
      data
    });
  },
  
  // 编辑部门
  updateDepartment: (id: number, data: any) => {
    return request({
      url: `/api/departments/${id}`,
      method: 'put',
      data
    });
  },
  
  // 删除部门
  deleteDepartment: (id: number) => {
    return request({
      url: `/api/departments/${id}`,
      method: 'delete'
    });
  }
};