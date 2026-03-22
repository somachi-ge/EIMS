<template>
  <view class="register-container">
    <view class="register-form">
      <view class="white-container">
        <view class="form-item">
          <text class="label">职工工号</text>
          <view class="input-container">
            <image src="../../static/icon/all/account-59.svg" class="input-icon" />
            <input v-model="form.username" type="text" placeholder="请输入职工工号" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">职工姓名</text>
          <view class="input-container">
            <image src="../../static/icon/all/name-59.svg" class="input-icon" />
            <input v-model="form.name" type="text" placeholder="请输入职工姓名" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">移动电话</text>
          <view class="input-container">
            <image src="../../static/icon/all/mobile-59.svg" class="input-icon" />
            <input v-model="form.phone" type="tel" placeholder="请输入移动电话" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">电子邮箱</text>
          <view class="input-container">
            <image src="../../static/icon/all/mail-59.svg" class="input-icon" />
            <input v-model="form.email" type="email" placeholder="请输入电子邮箱" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">验证码</text>
          <view class="input-container">
            <image src="../../static/icon/all/verification-59.svg" class="input-icon" />
            <input v-model="form.code" type="text" placeholder="请输入验证码" />
            <button @click="getCode" class="code-btn">{{ codeText }}</button>
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">密码</text>
          <view class="input-container">
            <image src="../../static/icon/all/pass-59.svg" class="input-icon" />
            <input v-model="form.password" type="password" placeholder="请输入密码" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">确认密码</text>
          <view class="input-container">
            <image src="../../static/icon/all/pass-59.svg" class="input-icon" />
            <input v-model="form.confirmPassword" type="password" placeholder="请确认密码" />
          </view>
        </view>
        
        <button @click="handleRegister" class="register-btn">注册</button>
        
        <view class="auth-link">
          <text>已有账号？</text>
          <navigator url="/pages/auth/login">立即登录</navigator>
        </view>
      </view>
      
      <view class="password-tips">
        <text class="tips-title">密码设置建议：</text>
        <text class="tips-content">·长度8-20位</text>
        <text class="tips-content">·包含字母和数字</text>
        <text class="tips-content">·字母区分大小写</text>
        <text class="tips-content">·避免使用常见密码</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  username: '',
  name: '',
  phone: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const codeText = ref('获取验证码')
const countdown = ref(0)

const getCode = () => {
  if (!form.value.phone) {
    uni.showToast({
      title: '请输入移动电话',
      icon: 'none'
    })
    return
  }
  
  // 验证移动电话格式
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(form.value.phone)) {
    uni.showToast({
      title: '请输入正确的移动电话',
      icon: 'none'
    })
    return
  }
  
  // 模拟发送验证码
  uni.showToast({
    title: '验证码已发送',
    icon: 'success'
  })
  
  // 开始倒计时
  countdown.value = 60
  codeText.value = `${countdown.value}s后重新获取`
  
  const timer = setInterval(() => {
    countdown.value--
    codeText.value = `${countdown.value}s后重新获取`
    
    if (countdown.value <= 0) {
      clearInterval(timer)
      codeText.value = '获取验证码'
    }
  }, 1000)
}

const handleRegister = async () => {
  if (!form.value.username) {
    uni.showToast({
      title: '请输入职工工号',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.name) {
    uni.showToast({
      title: '请输入职工姓名',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.phone) {
    uni.showToast({
      title: '请输入移动电话',
      icon: 'none'
    })
    return
  }
  
  // 验证移动电话格式
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(form.value.phone)) {
    uni.showToast({
      title: '请输入正确的移动电话',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.email) {
    uni.showToast({
      title: '请输入电子邮箱',
      icon: 'none'
    })
    return
  }
  
  // 验证电子邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    uni.showToast({
      title: '请输入正确的电子邮箱',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.code) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return
  }
  
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/
  if (!passwordRegex.test(form.value.password)) {
    uni.showToast({
      title: '请输入正确的密码',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.confirmPassword) {
    uni.showToast({
      title: '请确认密码',
      icon: 'none'
    })
    return
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return
  }
  
  // 模拟注册成功
  uni.showToast({
    title: '注册成功',
    icon: 'success'
  })
  uni.navigateTo({
    url: '/pages/auth/login'
  })
}
</script>

<style scoped>
.register-container {
  padding: 20rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #D9D9D9;
}

.white-container {
  background-color: white;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.register-header {
  margin-top: 60rpx;
  margin-bottom: 40rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.register-form {
  flex: 1;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #666;
  margin-bottom: 10rpx;
}

.input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 20rpx;
  width: 28rpx;
  height: 28rpx;
  z-index: 1;
}

.code-btn {
  width: 35%;
  height: 80rpx;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: bold;
  margin-left: 15rpx;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

input {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx 0 70rpx;
  font-size: 28rpx;
}

.register-btn {
  width: 100%;
  height: 80rpx;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 30rpx;
  font-weight: bold;
  margin-top: 40rpx;
}

.auth-link {
  text-align: center;
  margin-top: 30rpx;
  font-size: 26rpx;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-link text {
  margin-right: 10rpx;
}

.auth-link navigator {
  color: #409EFF;
  display: inline;
}

.password-tips {
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 16rpx;
  margin: 30rpx 0 20rpx 0;
  width: 100%;
  box-sizing: border-box;
}

.tips-title {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.tips-content {
  font-size: 22rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}
</style>