<template>
  <view class="quick-actions-container">
    <view class="actions-header">
      <text class="title">快捷操作</text>
    </view>
    
    <view class="actions-grid">
      <navigator url="/pages/application/application" class="action-item">
        <view class="action-icon app">
          <text>应用</text>
        </view>
        <text class="action-label">应用管理</text>
      </navigator>
      
      <navigator url="/pages/platform/platform" class="action-item">
        <view class="action-icon platform">
          <text>平台</text>
        </view>
        <text class="action-label">平台管理</text>
      </navigator>
      
      <navigator url="/pages/system/message/index" class="action-item">
        <view class="action-icon message">
          <text>消息</text>
        </view>
        <text class="action-label">消息中心</text>
      </navigator>
      
      <navigator url="/pages/system/user/index" class="action-item">
        <view class="action-icon user">
          <text>用户</text>
        </view>
        <text class="action-label">个人中心</text>
      </navigator>
      
      <navigator url="/pages/system/system" class="action-item">
        <view class="action-icon system">
          <text>设置</text>
        </view>
        <text class="action-label">系统设置</text>
      </navigator>
      
      <navigator url="/pages/system/sysinfo/help" class="action-item">
        <view class="action-icon help">
          <text>帮助</text>
        </view>
        <text class="action-label">帮助中心</text>
      </navigator>
    </view>
  </view>
</template>

<script setup lang="ts">
// 快捷操作页面
</script>

<style scoped>
.quick-actions-container {
  padding: 20rpx;
  height: 100vh;
}

.actions-header {
  margin-bottom: 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.action-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
  font-size: 24rpx;
  font-weight: bold;
  color: white;
}

.action-icon.app {
  background-color: #409EFF;
}

.action-icon.platform {
  background-color: #67C23A;
}

.action-icon.message {
  background-color: #E6A23C;
}

.action-icon.user {
  background-color: #909399;
}

.action-icon.system {
  background-color: #F56C6C;
}

.action-icon.help {
  background-color: #C0C4CC;
}

.action-label {
  font-size: 24rpx;
  color: #333;
  margin-top: 10rpx;
}
</style>