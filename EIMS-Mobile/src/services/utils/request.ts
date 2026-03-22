// 封装网络请求
interface RequestOptions {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  params?: any
  headers?: any
}

export function request<T>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url,
      method: options.method,
      data: options.data,
      params: options.params,
      header: options.headers || {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        resolve(res.data as T)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}