// 用户相关接口
import { request } from '../utils/request'

interface LoginForm {
  username: string
  password: string
}

interface LoginResponse {
  code: number
  message: string
  data: {
    user: {
      id: number
      username: string
      email: string
      name: string
      phone: string
    }
  }
  request_id: string
}

export const userApi = {
  login: (data: LoginForm) => {
    return request<LoginResponse>({
      url: '/api/auth/login',
      method: 'POST',
      data
    })
  }
}