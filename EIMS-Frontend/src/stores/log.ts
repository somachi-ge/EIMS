import { defineStore } from 'pinia'

interface Log {
  id: number
  operator: string
  operation: string
  ip: string
  time: string
}

interface SystemLog {
  id: number
  level: string
  message: string
  time: string
}

interface LogState {
  operationLogs: Log[]
  systemLogs: SystemLog[]
  loading: boolean
}

export const useLogStore = defineStore('log', {
  state: (): LogState => ({
    operationLogs: [],
    systemLogs: [],
    loading: false
  }),
  actions: {
    async fetchOperationLogs() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.operationLogs = [
            { id: 1, operator: 'admin', operation: '登录系统', ip: '127.0.0.1', time: '2024-01-01 00:00:00' },
            { id: 2, operator: 'admin', operation: '添加用户', ip: '127.0.0.1', time: '2024-01-01 00:01:00' }
          ]
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取操作日志失败:', error)
        this.loading = false
      }
    },
    async fetchSystemLogs() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.systemLogs = [
            { id: 1, level: 'info', message: '系统启动成功', time: '2024-01-01 00:00:00' },
            { id: 2, level: 'warn', message: '数据库连接超时', time: '2024-01-01 00:01:00' }
          ]
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取系统日志失败:', error)
        this.loading = false
      }
    }
  }
})