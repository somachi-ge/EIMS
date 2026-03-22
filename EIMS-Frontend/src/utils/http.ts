// HTTP工具
export const http = {
  // 生成请求ID
  generateRequestId: () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },
  
  // 构建查询参数
  buildQueryString: (params: any) => {
    if (!params) return '';
    const query = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return query ? `?${query}` : '';
  },
  
  // 解析响应数据
  parseResponse: (response: any) => {
    if (response?.data) {
      return response.data;
    }
    return response;
  }
};