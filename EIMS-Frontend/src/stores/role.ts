import { defineStore } from 'pinia'

interface Role {
  id: number
  name: string
  description: string
  status: boolean
}

interface RoleState {
  roles: Role[]
  loading: boolean
}

export const useRoleStore = defineStore('role', {
  state: (): RoleState => ({
    roles: [],
    loading: false
  }),
  getters: {
    getRoleById: (state) => (id: number) => {
      return state.roles.find(role => role.id === id)
    }
  },
  actions: {
    async fetchRoles() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.roles = [
            { id: 1, name: '管理员', description: '系统管理员', status: true },
            { id: 2, name: '普通用户', description: '普通用户', status: true },
            { id: 3, name: '访客', description: '访客权限', status: false }
          ]
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取角色列表失败:', error)
        this.loading = false
      }
    }
  }
})