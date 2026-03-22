import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [
      {
        id: 1,
        title: '系统通知',
        content: '系统将于今晚23:00进行维护，请提前做好准备',
        type: 'info',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: '权限变更',
        content: '您的角色权限已更新，新增了用户管理权限',
        type: 'success',
        read: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    loading: false
  }),
  
  getters: {
    unreadCount: (state) => {
      return state.notifications.filter(notification => !notification.read).length;
    },
    recentNotifications: (state) => {
      return state.notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
    }
  },
  
  actions: {
    async fetchNotifications() {
      this.loading = true;
      try {
        // 这里应该调用实际的API接口
        // const response = await notificationApi.getNotifications();
        // this.notifications = response.data;
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('获取通知失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    markAsRead(notificationId: number) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    
    deleteNotification(notificationId: number) {
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
    }
  }
});