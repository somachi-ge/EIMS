<template>
  <view class="system-container">
    
    <view class="system-menu">
      <view class="menu-item">
        <button class="menu-button button-user" @click="navigateTo('/pages/system/user/index')">
          <view class="menu-icon">
            <image src="../../static/icon/button/name-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">个人中心</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-message" @click="navigateTo('/pages/system/message/index')">
          <view class="menu-icon">
            <image src="../../static/icon/button/message-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">消息中心</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-message-settings" @click="navigateTo('/pages/system/sysinfo/notification-settings')">
          <view class="menu-icon">
            <image src="../../static/icon/button/notification-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">消息设置</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-feedback" @click="navigateTo('/pages/system/sysinfo/feedback')">
          <view class="menu-icon">
            <image src="../../static/icon/button/opinion-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">意见反馈</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-help" @click="navigateTo('/pages/system/sysinfo/help')">
          <view class="menu-icon">
            <image src="../../static/icon/button/help-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">帮助中心</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-about" @click="navigateTo('/pages/system/sysinfo/about')">
          <view class="menu-icon">
            <image src="../../static/icon/button/about-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">关于我们</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-logout" @click="handleLogout">
          <view class="menu-icon">
            <image src="../../static/icon/button/exit-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '../../store/modules/user'
import { storage } from '../../utils/storage'

const userStore = useUserStore()

const navigateTo = (url: string) => {
  uni.navigateTo({
    url
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        storage.clear()
        uni.reLaunch({
          url: '/pages/auth/login'
        })
      }
    }
  })
}
</script>

<style scoped>
.system-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #D9D9D9;
}

.system-header {
  margin-bottom: 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.system-menu {
  display: flex;
  flex-wrap: wrap;
  row-gap: 40rpx;
  column-gap: 20rpx;
  margin-top: 30rpx;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(25% - 15rpx);
}

.menu-button {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}

.button-user {
  background-color: #0958d9;
}

.button-message {
  background-color: #389e0d;
}

.button-feedback {
  background-color: #d4b106;
}

.button-help {
  background-color: #531dab;
}

.button-about {
  background-color: #08979c;
}

.button-message-settings {
  background-color: #13c2c2;
}

.button-logout {
  background-color: #d4380d;
}

.menu-button::after {
  border: none;
}

.menu-icon {
  font-size: 48rpx;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-svg-icon {
  width: 60rpx;
  height: 60rpx;
}

.menu-label {
  font-size: 24rpx;
  color: #333;
  text-align: center;
  width: 100%;
  font-weight: bold;
}
</style>