import request from '../request';

export const backupApi = {
  // 获取备份配置
  getBackupConfig: () => {
    return request({
      url: '/api/backup/config',
      method: 'get'
    });
  },
  
  // 更新备份配置
  updateBackupConfig: (data: any) => {
    return request({
      url: '/api/backup/config',
      method: 'put',
      data
    });
  },
  
  // 获取备份列表
  getBackupList: (params: any) => {
    return request({
      url: '/api/backup/list',
      method: 'get',
      params
    });
  },
  
  // 创建备份
  createBackup: (data: any) => {
    return request({
      url: '/api/backup/create',
      method: 'post',
      data
    });
  },
  
  // 删除备份
  deleteBackup: (id: number) => {
    return request({
      url: `/api/backup/${id}`,
      method: 'delete'
    });
  },
  
  // 恢复数据
  restoreData: (id: number) => {
    return request({
      url: `/api/backup/${id}/restore`,
      method: 'post'
    });
  }
};