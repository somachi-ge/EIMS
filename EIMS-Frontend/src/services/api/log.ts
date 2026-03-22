import request from '../request';

export const logApi = {
  // 获取操作日志列表
  getOperationLogList: (params: any) => {
    return request({
      url: '/api/logs/operation',
      method: 'get',
      params
    });
  },
  
  // 获取系统日志列表
  getSystemLogList: (params: any) => {
    return request({
      url: '/api/logs/system',
      method: 'get',
      params
    });
  },
  
  // 获取日志分析数据
  getLogAnalysis: (params: any) => {
    return request({
      url: '/api/logs/analysis',
      method: 'get',
      params
    });
  }
};