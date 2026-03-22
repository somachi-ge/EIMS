import request from '../request';

export const monitorApi = {
  // 获取系统监控数据
  getSystemMonitor: () => {
    return request({
      url: '/api/monitor/system',
      method: 'get'
    });
  },
  
  // 获取服务监控数据
  getServiceMonitor: () => {
    return request({
      url: '/api/monitor/services',
      method: 'get'
    });
  },
  
  // 获取用户活动数据
  getUserActivity: (params: any) => {
    return request({
      url: '/api/monitor/user-activity',
      method: 'get',
      params
    });
  }
};