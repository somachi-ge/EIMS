<template>
  <view class="forget-container">
    <view class="forget-form">
      <view class="white-container">
        <view class="form-item">
          <text class="label">职工工号</text>
          <view class="input-container">
            <image src="../../static/icon/all/account-59.svg" class="input-icon" />
            <input v-model="form.account" type="text" placeholder="请输入职工工号" />
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
          <text class="label">新密码</text>
          <view class="input-container">
            <image src="../../static/icon/all/pass-59.svg" class="input-icon" />
            <input v-model="form.password" type="password" placeholder="请输入新密码" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">确认新密码</text>
          <view class="input-container">
            <image src="../../static/icon/all/pass-59.svg" class="input-icon" />
            <input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" />
          </view>
        </view>
        
        <button @click="handleReset" class="reset-btn">重置密码</button>
        
        <view class="auth-link">
          <text>没有忘记</text>
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
  account: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const codeText = ref('获取验证码')
const countdown = ref(0)

const getCode = () => {
  if (!form.value.account) {
    uni.showToast({
      title: '请输入职工工号',
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

const handleReset = async () => {
  if (!form.value.account) {
    uni.showToast({
      title: '请输入职工工号',
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
      title: '请输入新密码',
      icon: 'none'
    })
    return
  }
  
  if (form.value.password.length < 8 || form.value.password.length > 20) {
    uni.showToast({
      title: '密码长度必须在8-20位之间，区分大小写',
      icon: 'none'
    })
    return
  }
  
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(form.value.password)) {
    uni.showToast({
      title: '密码必须包含字母和数字，区分大小写',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.confirmPassword) {
    uni.showToast({
      title: '请确认新密码',
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
  
  // 模拟密码重置成功
  uni.showToast({
    title: '密码重置成功',
    icon: 'success'
  })
  uni.navigateTo({
    url: '/pages/auth/login'
  })
}
</script>

<style scoped>
.forget-container {
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

.forget-header {
  margin-top: 60rpx;
  margin-bottom: 40rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.forget-form {
  flex: 1;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
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

.reset-btn {
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