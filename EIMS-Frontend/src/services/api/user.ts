import request from '../request';

export const userApi = {
  // 获取用户列表
  getUserList: (params: any) => {
    return request({
      url: '/api/users',
      method: 'get',
      params
    });
  },
  
  // 获取用户详情
  getUserDetail: (id: number) => {
    return request({
      url: `/api/users/${id}`,
      method: 'get'
    });
  },
  
  // 添加用户
  addUser: (data: any) => {
    return request({
      url: '/api/users',
      method: 'post',
      data
    });
  },
  
  // 编辑用户
  updateUser: (id: number, data: any) => {
    return request({
      url: `/api/users/${id}`,
      method: 'put',
      data
    });
  },
  
  // 删除用户
  deleteUser: (id: number) => {
    return request({
      url: `/api/users/${id}`,
      method: 'delete'
    });
  },
  
  // 批量删除用户
  batchDeleteUsers: (ids: number[]) => {
    return request({
      url: '/api/users/batch-delete',
      method: 'post',
      data: { ids }
    });
  }
};