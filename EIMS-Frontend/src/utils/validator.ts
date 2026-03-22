// 验证工具
export const validator = {
  // 验证邮箱
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // 验证手机号
  phone: (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },
  
  // 验证密码强度
  password: (password: string) => {
    // 至少8位，包含字母和数字
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  },
  
  // 验证身份证号
  idCard: (idCard: string) => {
    const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    return idCardRegex.test(idCard);
  },
  
  // 验证URL
  url: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
};