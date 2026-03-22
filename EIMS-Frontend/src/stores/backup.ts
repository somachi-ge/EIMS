import { defineStore } from 'pinia'

interface Backup {
  id: number
  filename: string
  size: string
  createTime: string
  status: string
}

interface BackupConfig {
  backupPath: string
  backupFrequency: string
  backupTime: string
  backupRetention: number
  enableAutoBackup: boolean
}

interface BackupState {
  backups: Backup[]
  config: BackupConfig
  loading: boolean
}

export const useBackupStore = defineStore('backup', {
  state: (): BackupState => ({
    backups: [],
    config: {
      backupPath: '/backup',
      backupFrequency: 'daily',
      backupTime: '00:00',
      backupRetention: 7,
      enableAutoBackup: true
    },
    loading: false
  }),
  actions: {
    async fetchBackups() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.backups = [
            { id: 1, filename: 'backup_20240101.sql', size: '10.5 MB', createTime: '2024-01-01 00:00:00', status: '成功' },
            { id: 2, filename: 'backup_20240102.sql', size: '10.8 MB', createTime: '2024-01-02 00:00:00', status: '成功' }
          ]
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取备份列表失败:', error)
        this.loading = false
      }
    },
    async fetchBackupConfig() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          // 保持默认配置
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取备份配置失败:', error)
        this.loading = false
      }
    },
    async updateBackupConfig(newConfig: Partial<BackupConfig>) {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.config = { ...this.config, ...newConfig }
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('更新备份配置失败:', error)
        this.loading = false
      }
    }
  }
})