<template>
  <view class="about-container">
    <view class="white-container">
      <view class="app-info">
        <image src="../../../static/icon/logo_color.svg" class="logo" />
        <text class="app-name">企业综合管理系统</text>
        <text class="app-version">版本 1.0.0</text>
      </view>
      
      <view class="section">
        <text class="section-title">功能介绍</text>
        <text class="empty-line"></text>
        <view class="feature-grid">
          <view class="feature-item">
            <view class="feature-icon">📊</view>
            <text class="feature-text">企业信息管理</text>
          </view>
          <view class="feature-item">
            <view class="feature-icon">👥</view>
            <text class="feature-text">用户管理系统</text>
          </view>
          <view class="feature-item">
            <view class="feature-icon">🔒</view>
            <text class="feature-text">安全权限控制</text>
          </view>
          <view class="feature-item">
            <view class="feature-icon">📱</view>
            <text class="feature-text">移动办公支持</text>
          </view>
        </view>
      </view>
      
      <view class="divider"></view>
      
      <view class="section">
        <text class="section-title">公司信息</text>
        <text class="empty-line"></text>
        <view class="company-info">
          <text class="info-item">公司名称：翼航智能（吉林）科技有限公司</text>
          <text class="info-item">联系电话：400-123-4567</text>
          <text class="info-item">邮箱地址：contact@yhzn.ai</text>
          <text class="info-item">公司地址：吉林省长春市高新区锦湖大路1357H号</text>
        </view>
      </view>
      
      <view class="divider"></view>
      
      <view class="copyright">
        <text>© 2026 翼航智能（吉林）科技有限公司</text>
        <text>All rights reserved</text>
      </view>
    </view>
    
    <view class="button-container">
      <button class="back-button" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script setup lang="ts">
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.about-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #D9D9D9;
}

.white-container {
  background-color: white;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 20rpx;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.app-version {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 40rpx;
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 0rpx;
  padding-left: 0rpx;
}

.empty-line {
  display: block;
  height: 20rpx;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.feature-item {
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 25rpx;
  display: flex;
  align-items: center;
}

.feature-icon {
  font-size: 36rpx;
  margin-right: 15rpx;
}

.feature-text {
  font-size: 24rpx;
  color: #333;
}

.divider {
  height: 1rpx;
  background-color: #bfbfbf;
  margin: 30rpx 0;
}

.company-info {
  margin-bottom: 20rpx;
}

.info-item {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: block;
}

.copyright {
  text-align: center;
  padding-top: 20rpx;
}

.copyright text {
  display: block;
  font-size: 20rpx;
  color: #999;
  margin-bottom: 5rpx;
}

.button-container {
  margin-top: 20rpx;
  width: 100%;
}

.back-button {
  width: 100%;
  height: 80rpx;
  background-color: #f0f0f0;
  color: #333;
  font-size: 28rpx;
  font-weight: bold;
  border-radius: 8rpx;
  border: none;
}

.back-button::after {
  border: none;
}
</style>