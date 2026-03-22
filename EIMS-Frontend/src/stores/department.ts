import { defineStore } from 'pinia'

interface Department {
  id: number
  name: string
  parentId: number
  description: string
  status: boolean
}

interface DepartmentState {
  departments: Department[]
  loading: boolean
}

export const useDepartmentStore = defineStore('department', {
  state: (): DepartmentState => ({
    departments: [],
    loading: false
  }),
  getters: {
    getDepartmentById: (state) => (id: number) => {
      return state.departments.find(dept => dept.id === id)
    }
  },
  actions: {
    async fetchDepartments() {
      this.loading = true
      try {
        // 模拟API请求
        setTimeout(() => {
          this.departments = [
            { id: 1, name: '技术部', parentId: 0, description: '技术开发部门', status: true },
            { id: 2, name: '市场部', parentId: 0, description: '市场营销部门', status: true },
            { id: 3, name: '销售部', parentId: 0, description: '销售部门', status: true }
          ]
          this.loading = false
        }, 1000)
      } catch (error) {
        console.error('获取部门列表失败:', error)
        this.loading = false
      }
    }
  }
})