import request from '../request';

export const notificationApi = {
  // 获取通知列表
  getNotifications: (params: any) => {
    return request({
      url: '/api/notifications',
      method: 'get',
      params
    });
  },
  
  // 标记通知为已读
  markAsRead: (id: number) => {
    return request({
      url: `/api/notifications/${id}/read`,
      method: 'put'
    });
  },
  
  // 标记所有通知为已读
  markAllAsRead: () => {
    return request({
      url: '/api/notifications/read-all',
      method: 'put'
    });
  },
  
  // 删除通知
  deleteNotification: (id: number) => {
    return request({
      url: `/api/notifications/${id}`,
      method: 'delete'
    });
  }
};