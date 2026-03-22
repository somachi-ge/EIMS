<template>
  <view class="notification-container">
    <view class="white-container">
      <view class="notification-form">
        <!-- 系统通知 -->
        <view class="section">
          <view class="section-title">系统通知</view>
          <view class="section-desc">接收系统相关的通知消息</view>
          
          <view class="form-item">
            <text class="label">消息通知</text>
            <switch :checked="settings.systemNotification.newMessage" @change="(e: any) => { settings.systemNotification.newMessage = e.detail.value; }" />
          </view>
          
          <view class="form-item">
            <text class="label">系统公告</text>
            <switch :checked="settings.systemNotification.systemAnnouncement" @change="(e: any) => { settings.systemNotification.systemAnnouncement = e.detail.value; }" />
          </view>
          
          <view class="form-item">
            <text class="label">安全提醒</text>
            <switch :checked="settings.systemNotification.securityAlert" @change="(e: any) => { settings.systemNotification.securityAlert = e.detail.value; }" />
          </view>
        </view>
        
        <view class="divider"></view>
        
        <!-- 消息提醒 -->
        <view class="section">
          <view class="section-title">消息提醒</view>
          <view class="section-desc">设置消息提醒的方式</view>
          
          <view class="form-item">
            <text class="label">声音提醒</text>
            <switch :checked="settings.notificationMethod.sound" @change="(e: any) => { settings.notificationMethod.sound = e.detail.value; }" />
          </view>
          
          <view class="form-item">
            <text class="label">震动提醒</text>
            <switch :checked="settings.notificationMethod.vibration" @change="(e: any) => { settings.notificationMethod.vibration = e.detail.value; }" />
          </view>
          
          <view class="form-item">
            <text class="label">桌面通知</text>
            <switch :checked="settings.notificationMethod.desktop" @change="(e: any) => { settings.notificationMethod.desktop = e.detail.value; }" />
          </view>
        </view>
        
        <view class="divider"></view>
        
        <!-- 免打扰模式 -->
        <view class="section">
          <view class="section-title">免打扰模式</view>
          <view class="section-desc">设置免打扰的时间段</view>
          
          <view class="form-item">
            <text class="label">启用免打扰</text>
            <switch :checked="settings.doNotDisturb.enabled" @change="(e: any) => { settings.doNotDisturb.enabled = e.detail.value; }" />
          </view>
          
          <view v-if="settings.doNotDisturb.enabled" class="time-section">
            <view class="time-item">
              <text class="label">开始时间</text>
              <picker 
                class="time-picker" 
                mode="time" 
                :value="settings.doNotDisturb.startTime" 
                @change="handleStartTimeChange"
              >
                <text class="picker-text">{{ settings.doNotDisturb.startTime }}</text>
              </picker>
            </view>
            
            <view class="time-item">
              <text class="label">结束时间</text>
              <picker 
                class="time-picker" 
                mode="time" 
                :value="settings.doNotDisturb.endTime" 
                @change="handleEndTimeChange"
              >
                <text class="picker-text">{{ settings.doNotDisturb.endTime }}</text>
              </picker>
            </view>
          </view>
        </view>
        
        <view class="notification-actions">
          <button @click="goBack" class="action-btn cancel-btn">取消</button>
          <button @click="saveSettings" class="action-btn confirm-btn">保存设置</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storage } from '../../../utils/storage'

const settings = ref({
  systemNotification: {
    newMessage: true,
    systemAnnouncement: true,
    securityAlert: true
  },
  notificationMethod: {
    sound: true,
    vibration: true,
    desktop: true
  },
  doNotDisturb: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  }
})

const originalSettings = ref({ ...settings.value })

onMounted(() => {
  // 从存储中加载设置
  const savedSettings = storage.get('notificationSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...savedSettings }
    originalSettings.value = { ...settings.value }
  }
})

const saveSettings = () => {
  storage.set('notificationSettings', settings.value)
  uni.showToast({
    title: '设置已保存',
    icon: 'success'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

const goBack = () => {
  uni.navigateBack()
}

const handleStartTimeChange = (e: any) => {
  settings.value.doNotDisturb.startTime = e.detail.value
}

const handleEndTimeChange = (e: any) => {
  settings.value.doNotDisturb.endTime = e.detail.value
}
</script>

<style scoped>
.notification-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #D9D9D9;
}

.white-container {
  background-color: white;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.notification-form {
  flex: 1;
}

.section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.section-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.form-item {
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

/* 调整滑动开关的大小 */
switch {
  transform: scale(0.8);
  transform-origin: center;
}

.divider {
  height: 1rpx;
  background-color: #bfbfbf;
  margin: 30rpx 0;
}

.time-section {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.time-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.time-item:last-child {
  margin-bottom: 0;
}

.time-picker {
  padding: 10rpx 20rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  border: 1rpx solid #e0e0e0;
}

.picker-text {
  font-size: 24rpx;
  color: #409EFF;
}

.notification-actions {
  width: 100%;
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
  border: 1rpx solid #e5e5e5;
}

.confirm-btn {
  background-color: #409EFF;
  color: white;
}

.action-btn::after {
  border: none;
}
</style>