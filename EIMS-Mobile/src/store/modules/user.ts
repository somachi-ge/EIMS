import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  email: string
  name: string
  phone: string
  avatar?: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    isLoggedIn: false
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
    getIsLoggedIn: (state) => state.isLoggedIn,
    currentUser: (state) => state.userInfo
  },
  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    setLoggedIn(loggedIn: boolean) {
      this.isLoggedIn = loggedIn
    },
    logout() {
      this.userInfo = null
      this.isLoggedIn = false
    }
  }
})