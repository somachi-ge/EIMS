// 格式化工具
import dayjs from 'dayjs';

export const formatter = {
  // 格式化日期
  date: (date: any, format: string = 'YYYY-MM-DD') => {
    return dayjs(date).format(format);
  },
  
  // 格式化日期时间
  datetime: (date: any, format: string = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(date).format(format);
  },
  
  // 格式化数字
  number: (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  },
  
  // 格式化货币
  currency: (amount: number, symbol: string = '¥') => {
    return `${symbol}${amount.toFixed(2)}`;
  },
  
  // 格式化文件大小
  fileSize: (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};