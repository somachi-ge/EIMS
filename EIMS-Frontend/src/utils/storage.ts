// 本地存储工具
export const storage = {
  // 设置存储
  set: (key: string, value: any) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('存储数据失败:', error);
    }
  },
  
  // 获取存储
  get: (key: string) => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('获取数据失败:', error);
      return null;
    }
  },
  
  // 删除存储
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('删除数据失败:', error);
    }
  },
  
  // 清空存储
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('清空数据失败:', error);
    }
  }
};