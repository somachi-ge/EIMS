import request from '../request';

export const configApi = {
  // 获取基础配置
  getBasicConfig: () => {
    return request({
      url: '/api/config/basic',
      method: 'get'
    });
  },
  
  // 更新基础配置
  updateBasicConfig: (data: any) => {
    return request({
      url: '/api/config/basic',
      method: 'put',
      data
    });
  },
  
  // 获取邮件配置
  getEmailConfig: () => {
    return request({
      url: '/api/config/email',
      method: 'get'
    });
  },
  
  // 更新邮件配置
  updateEmailConfig: (data: any) => {
    return request({
      url: '/api/config/email',
      method: 'put',
      data
    });
  },
  
  // 获取通知配置
  getNotificationConfig: () => {
    return request({
      url: '/api/config/notification',
      method: 'get'
    });
  },
  
  // 更新通知配置
  updateNotificationConfig: (data: any) => {
    return request({
      url: '/api/config/notification',
      method: 'put',
      data
    });
  }
};