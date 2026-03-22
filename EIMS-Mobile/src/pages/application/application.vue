<template>
  <view class="application-container">
    
    <view class="application-menu">
      <view class="menu-item">
        <button class="menu-button button-app1" @click="navigateTo('/pages/application/app1')">
          <view class="menu-icon">
            <image src="../../static/icon/button/Coding-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">编码规则</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-app2" @click="navigateTo('/pages/application/app2')">
          <view class="menu-icon">
            <image src="../../static/icon/button/organize-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">组织管理</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-app3" @click="navigateTo('/pages/application/app3')">
          <view class="menu-icon">
            <image src="../../static/icon/button/name-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">职工管理</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-app4" @click="navigateTo('/pages/application/app4')">
          <view class="menu-icon">
            <image src="../../static/icon/button/equipment-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">设备管理</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const navigateTo = (url: string) => {
  uni.navigateTo({
    url
  })
}

onMounted(() => {
  // 应用列表已清空
  console.log('应用列表已清空')
})
</script>

<style scoped>
.application-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #D9D9D9;
}

.application-menu {
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

.button-app1 {
  background-color: #0958d9;
}

.button-app2 {
  background-color: #389e0d;
}

.button-app3 {
  background-color: #d4b106;
}

.button-app4 {
  background-color: #531dab;
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