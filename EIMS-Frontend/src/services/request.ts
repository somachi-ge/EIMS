import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从本地存储获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 检查响应状态码
    if (res.code !== 0) {
      // 处理错误
      console.error('请求错误:', res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  (error) => {
    // 处理网络错误
    console.error('网络错误:', error.message)
    return Promise.reject(error)
  }
)

export default service