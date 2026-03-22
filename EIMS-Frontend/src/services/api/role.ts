import request from '../request';

export const roleApi = {
  // 获取角色列表
  getRoleList: (params: any) => {
    return request({
      url: '/api/roles',
      method: 'get',
      params
    });
  },
  
  // 获取角色详情
  getRoleDetail: (id: number) => {
    return request({
      url: `/api/roles/${id}`,
      method: 'get'
    });
  },
  
  // 添加角色
  addRole: (data: any) => {
    return request({
      url: '/api/roles',
      method: 'post',
      data
    });
  },
  
  // 编辑角色
  updateRole: (id: number, data: any) => {
    return request({
      url: `/api/roles/${id}`,
      method: 'put',
      data
    });
  },
  
  // 删除角色
  deleteRole: (id: number) => {
    return request({
      url: `/api/roles/${id}`,
      method: 'delete'
    });
  },
  
  // 分配权限
  assignPermissions: (roleId: number, permissions: number[]) => {
    return request({
      url: `/api/roles/${roleId}/permissions`,
      method: 'post',
      data: { permissions }
    });
  }
};