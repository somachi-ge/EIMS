<template>
  <view class="login-container">
    <view class="card">
      <view class="login-header">
        <image src="../../static/icon/logo_color.svg" class="logo" />
        <text class="title">欢迎回来</text>
        <text class="subtitle">请登录访问企业综合管理系统</text>
      </view>
      
      <view class="login-form">
        <view class="form-item">
          <text class="label">请输入账号</text>
          <view class="input-container">
            <image src="../../static/icon/all/account-59.svg" class="input-icon" />
            <input v-model="form.username" type="text" placeholder="支持工号/邮箱/手机号登录" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">请输入密码</text>
          <view class="input-container">
            <image src="../../static/icon/all/pass-59.svg" class="input-icon" />
            <input v-model="form.password" type="password" placeholder="区分大小写，长度8-20位" />
          </view>
        </view>
        
        <button @click="handleLogin" class="login-btn">登录</button>
        
        <view class="auth-links">
          <navigator url="/pages/auth/forget-password">忘记密码</navigator>
          <navigator url="/pages/auth/register">自助注册</navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../../store/modules/user'
import { userApi } from '../../services/api/user'

const userStore = useUserStore()
const form = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.value.username) {
    uni.showToast({
      title: '请输入账号',
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
  
  if (form.value.password.length < 8 || form.value.password.length > 20) {
    uni.showToast({
      title: '密码长度必须在8-20位之间',
      icon: 'none'
    })
    return
  }
  
  // 模拟登录逻辑，用于测试
  if ((form.value.username === 'admin' || form.value.username === '10001') && form.value.password === 'admin888') {
    // 模拟用户信息
    const mockUserInfo = {
      id: form.value.username === 'admin' ? 1 : 2,
      username: form.value.username === 'admin' ? 'admin' : '10001',
      email: form.value.username === 'admin' ? 'admin@example.com' : 'user10001@example.com',
      name: form.value.username === 'admin' ? '管理员' : '用户10001',
      phone: form.value.username === 'admin' ? '13800138000' : '13800138001'
    }
    userStore.setUserInfo(mockUserInfo)
    userStore.setLoggedIn(true)
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/home/index'
      })
    }, 1000)
    return
  }
  
  try {
    const res = await userApi.login(form.value)
    userStore.setUserInfo(res.data.user)
    userStore.setLoggedIn(true)
    uni.switchTab({
      url: '/pages/home/index'
    })
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: '登录失败，请检查账号和密码',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.login-container {
  padding: 40rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #d9d9d9;
}

.login-header {
  text-align: center;
  margin-bottom: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card {
  background-color: white;
  padding: 60rpx 40rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  width: 86%;
  margin-top: -180rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 0;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}

.login-form {
  width: 100%;
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

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx 0 70rpx;
  font-size: 28rpx;
}

.login-btn {
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

.auth-links {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.auth-links navigator {
  font-size: 26rpx;
  color: #409EFF;
}
</style>