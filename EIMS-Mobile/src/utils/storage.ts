// 存储工具
export const storage = {
  // 设置存储
  set: (key: string, value: any) => {
    uni.setStorageSync(key, value)
  },
  
  // 获取存储
  get: <T>(key: string, defaultValue: T = null as unknown as T): T => {
    const value = uni.getStorageSync(key)
    return value === undefined ? defaultValue : value as T
  },
  
  // 删除存储
  remove: (key: string) => {
    uni.removeStorageSync(key)
  },
  
  // 清空存储
  clear: () => {
    uni.clearStorageSync()
  }
}