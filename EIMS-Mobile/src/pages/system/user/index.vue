<template>

  <!-- 个人中心主容器 -->
  <view class="user-container">

    <!-- 基本信息容器 -->
    <view class="user-header">
      <view class="user-info">
        <image :src="userInfo.avatar || '/static/image/chongzhi.zu.png'" class="avatar" />
        <view class="user-details">
          <text class="username">{{ userInfo.username || '祖冲之' }}</text>
          <text class="email">{{ userInfo.email || 'chongzhi.zu@cncc.ai' }}</text>
        </view>
      </view>
    </view>
    
    <!-- 个人设置容器 -->
    <view class="settings-card">
      <view class="settings-title">个人设置</view>
      <view class="settings-menu">
        <navigator url="/pages/system/user/profile" class="settings-item">
          <view class="settings-label"><image src="../../../static/icon/all/name-59.svg" class="settings-icon" /> 个人信息</view>
          <text class="settings-arrow">→</text>
        </navigator>
        <navigator url="/pages/system/user/avatar" class="settings-item">
          <view class="settings-label"><image src="../../../static/icon/all/profile-59.svg" class="settings-icon" /> 头像设置</view>
          <text class="settings-arrow">→</text>
        </navigator>
        <navigator url="/pages/system/user/password" class="settings-item">
          <view class="settings-label"><image src="../../../static/icon/all/pass-59.svg" class="settings-icon" /> 修改密码</view>
          <text class="settings-arrow">→</text>
        </navigator>
      </view>
    </view>
    
    <!-- 系统设置容器 -->
    <view class="settings-card">
      <view class="settings-title">系统设置</view>
      <view class="settings-menu">
        <navigator url="/pages/system/sysinfo/notification-settings" class="settings-item">
          <view class="settings-label"><image src="../../../static/icon/all/message-59.svg" class="settings-icon" /> 消息设置</view>
          <text class="settings-arrow">→</text>
        </navigator>
        <navigator url="/pages/system/sysinfo/feedback" class="settings-item">
          <view class="settings-label"><image src="../../../static/icon/all/opinion-59.svg" class="settings-icon" /> 意见反馈</view>
          <text class="settings-arrow">→</text>
        </navigator>
        <navigator url="/pages/system/sysinfo/help" class="settings-item">
          <view class="settings-label"><image src="../../../static/icon/all/help-59.svg" class="settings-icon" /> 帮助中心</view>
          <text class="settings-arrow">→</text>
        </navigator>
        <navigator url="/pages/system/sysinfo/about" class="settings-item">
          <view class="settings-label"><image src="../../../static/icon/all/about-59.svg" class="settings-icon" /> 关于我们</view>
          <text class="settings-arrow">→</text>
        </navigator>
      </view>
    </view>
    
    <!-- 底部菜单容器 -->
    <view class="user-menu">
      
      <!-- 按钮容器 -->
      <view class="button-container">
        <!-- 返回按钮 -->
        <view @click="goBack" class="menu-item button-item">
          <text class="menu-label" style="font-weight: bold;">返回</text>
        </view>

        <!-- 退出登录按钮 -->
        <view @click="logout" class="menu-item button-item" style="background-color: #f5222d;">
          <text class="menu-label" style="color: #ffffff; font-weight: bold;">退出登录</text>
        </view>
      </view>
      
      <!-- 版本信息容器 -->
      <view class="version-info">
        <text class="version-text">版本：1.0.0</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../../store/modules/user'

const userStore = useUserStore()
const userInfo = ref({
  username: '',
  email: '',
  avatar: ''
})

onMounted(() => {
  // 使用模拟数据，暂不与后端交互
  const mockUserInfo = {
    id: 1,
    username: '祖冲之',
    name: '祖冲之',
    email: 'chongzhi.zu@cncc.ai',
    phone: '13800138000',
    avatar: '/static/image/chongzhi.zu.png'
  }
  userInfo.value = mockUserInfo
  userStore.setUserInfo(mockUserInfo)
})

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    confirmText: '退出',
    confirmColor: '#f5222d',
    cancelText: '取消',
    cancelColor: '#8c8c8c',
    success: function (res) {
      if (res.confirm) {
        // 清除用户信息
        userStore.logout()
        // 跳转到登录页面
        uni.redirectTo({
          url: '/pages/auth/login'
        })
      }
    }
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.user-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #d9d9d9;
}

.settings-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx 20rpx 5rpx;
}

.settings-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.settings-menu {
  display: flex;
  flex-direction: column;
}

.settings-item {
  position: relative;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #bfbfbf;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-label {
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
}

.settings-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 15rpx;
}

.settings-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #8c8c8c;
}

.user-header {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  color: #333;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.email {
  font-size: 24rpx;
  opacity: 0.8;
}

.user-menu {
  flex: 1;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 12rpx;
  padding: 25rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.menu-label {
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #8c8c8c;
}

.version-info {
  margin-top: 40rpx;
  text-align: center;
}

.version-text {
  font-size: 22rpx;
  color: #8c8c8c;
}

.button-container {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.button-item {
  flex: 1;
  justify-content: center;
}

.button-item:first-child {
  background-color: #f0f0f0;
}

.button-item:last-child {
  background-color: #f5222d;
}
</style>