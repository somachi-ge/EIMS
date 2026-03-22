import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
  name: string
  email: string
  phone: string
  departmentId: number
  roleIds: number[]
  status: boolean
}

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false
  }),
  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find(user => user.id === id)
    }
  },
  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.users = [
            { id: 1, username: 'admin', name: '管理员', email: 'admin@example.com', phone: '13800138000', departmentId: 1, roleIds: [1], status: true },
            { id: 2, username: 'user1', name: '用户1', email: 'user1@example.com', phone: '13800138001', departmentId: 2, roleIds: [2], status: true }
          ]
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取用户列表失败:', error)
        this.loading = false
      }
    },
    async fetchCurrentUser() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.currentUser = { id: 1, username: 'admin', name: '管理员', email: 'admin@example.com', phone: '13800138000', departmentId: 1, roleIds: [1], status: true }
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取当前用户失败:', error)
        this.loading = false
      }
    }
  }
})