// 请求拦截器
export const requestInterceptor = (config: any) => {
  // 从本地存储获取token
  const token = localStorage.getItem('token');
  
  // 如果有token，添加到请求头
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 添加请求时间戳
  config.headers['X-Request-Time'] = new Date().toISOString();
  
  return config;
};

// 响应拦截器
export const responseInterceptor = (response: any) => {
  // 直接返回响应数据
  return response;
};

// 响应错误拦截器
export const errorInterceptor = (error: any) => {
  // 处理错误
  if (error.response) {
    // 服务器返回错误状态码
    const status = error.response.status;
    
    switch (status) {
      case 401:
        // 未授权，跳转到登录页面
        // router.push('/login');
        console.error('未授权，请重新登录');
        break;
      case 403:
        // 禁止访问
        console.error('无权访问该资源');
        break;
      case 404:
        // 资源不存在
        console.error('请求的资源不存在');
        break;
      case 500:
        // 服务器内部错误
        console.error('服务器内部错误');
        break;
      default:
        console.error(`请求失败，状态码：${status}`);
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    console.error('网络错误，未收到响应');
  } else {
    // 请求配置出错
    console.error('请求配置错误:', error.message);
  }
  
  return Promise.reject(error);
};