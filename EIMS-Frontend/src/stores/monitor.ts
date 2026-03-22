import { defineStore } from 'pinia'

interface SystemStatus {
  cpuUsage: string
  memoryUsage: string
  diskUsage: string
  networkSpeed: string
}

interface Service {
  id: number
  name: string
  status: string
  version: string
  uptime: string
  cpu: string
  memory: string
}

interface Activity {
  id: number
  user: string
  activity: string
  ip: string
  time: string
}

interface MonitorState {
  systemStatus: SystemStatus
  services: Service[]
  activities: Activity[]
  loading: boolean
}

export const useMonitorStore = defineStore('monitor', {
  state: (): MonitorState => ({
    systemStatus: {
      cpuUsage: '45%',
      memoryUsage: '68%',
      diskUsage: '32%',
      networkSpeed: '1.2 MB/s'
    },
    services: [],
    activities: [],
    loading: false
  }),
  actions: {
    async fetchSystemStatus() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          // 保持默认状态
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取系统状态失败:', error)
        this.loading = false
      }
    },
    async fetchServices() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.services = [
            { id: 1, name: 'API服务', status: '运行中', version: '1.0.0', uptime: '7天 12小时', cpu: '15%', memory: '25%' },
            { id: 2, name: '数据库服务', status: '运行中', version: '14.0', uptime: '30天', cpu: '25%', memory: '45%' }
          ]
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取服务列表失败:', error)
        this.loading = false
      }
    },
    async fetchActivities() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.activities = [
            { id: 1, user: 'admin', activity: '登录系统', ip: '127.0.0.1', time: '2024-01-01 00:00:00' },
            { id: 2, user: 'user1', activity: '修改密码', ip: '127.0.0.1', time: '2024-01-01 00:01:00' }
          ]
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取用户活动失败:', error)
        this.loading = false
      }
    }
  }
})