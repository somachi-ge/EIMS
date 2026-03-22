import { defineStore } from 'pinia'

interface Config {
  systemName: string
  systemVersion: string
  systemDescription: string
  systemLogo: string
  enableCaptcha: boolean
  enableMultiLanguage: boolean
  smtpServer: string
  smtpPort: number
  senderEmail: string
  senderName: string
  smtpUsername: string
  smtpPassword: string
  enableSsl: boolean
  enableSystemNotification: boolean
  enableEmailNotification: boolean
  enableSmsNotification: boolean
  notificationPrefix: string
  notificationTemplate: string
}

interface ConfigState {
  config: Config
  loading: boolean
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    config: {
      systemName: 'EIMS企业综合管理系统',
      systemVersion: '1.0.0',
      systemDescription: '企业综合管理系统',
      systemLogo: '',
      enableCaptcha: true,
      enableMultiLanguage: false,
      smtpServer: 'smtp.example.com',
      smtpPort: 465,
      senderEmail: 'noreply@example.com',
      senderName: 'EIMS系统',
      smtpUsername: 'username',
      smtpPassword: 'password',
      enableSsl: true,
      enableSystemNotification: true,
      enableEmailNotification: false,
      enableSmsNotification: false,
      notificationPrefix: '【EIMS系统】',
      notificationTemplate: '尊敬的用户，您有一条新的系统通知：{content}'
    },
    loading: false
  }),
  actions: {
    async fetchConfig() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          // 保持默认配置
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取配置失败:', error)
        this.loading = false
      }
    },
    async updateConfig(newConfig: Partial<Config>) {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.config = { ...this.config, ...newConfig }
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('更新配置失败:', error)
        this.loading = false
      }
    }
  }
})