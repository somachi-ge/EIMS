import { request } from '../utils/request'

export const systemApi = {
  getSystemInfo: () => request({ url: '/api/system/info', method: 'GET' }),
  submitFeedback: (data: Record<string, any>) => request({ url: '/api/system/feedback', method: 'POST', data }),
  getHelpArticles: (params: Record<string, any>) => request({ url: '/api/system/help', method: 'GET', params })
}