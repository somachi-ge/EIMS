// 认证相关工具函数

// 存储token
export const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

// 获取token
export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

// 移除token
export const removeToken = (): void => {
  localStorage.removeItem('token')
}

// 检查是否已登录
export const isLoggedIn = (): boolean => {
  return !!getToken()
}

// 存储用户信息
export const setUserInfo = (userInfo: any): void => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

// 获取用户信息
export const getUserInfo = (): any => {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}

// 移除用户信息
export const removeUserInfo = (): void => {
  localStorage.removeItem('userInfo')
}

// 退出登录
export const logout = (): void => {
  removeToken()
  removeUserInfo()
}