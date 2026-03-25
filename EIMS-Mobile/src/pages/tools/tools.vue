<template>
  <view class="tools-container">
    
    <view class="tools-menu">
      <!-- 编码规则工具 -->
      <view class="menu-item">
        <button class="menu-button button-tools11" @click="navigateTo('/pages/tools/code-rule')">
          <view class="menu-icon">
            <image src="../../static/icon/button/Coding-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">编码规则</text>
      </view>
      
      <!-- 组织管理工具 -->
      <view class="menu-item">
        <button class="menu-button button-tools12" @click="navigateTo('/pages/tools/organization')">
          <view class="menu-icon">
            <image src="../../static/icon/button/organize-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">组织管理</text>
      </view>
      
      <!-- 工作流工具 -->
      <view class="menu-item">
        <button class="menu-button button-tools13" @click="navigateTo('/pages/tools/workflow')">
          <view class="menu-icon">
            <image src="../../static/icon/button/approval-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">工作流</text>
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
  // 工具列表已清空
  console.log('工具列表已清空')
})
</script>

<style scoped>
.tools-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #D9D9D9;
}

.tools-menu {
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

.button-tools11 {
  background-color: #1890ff;
}

.button-tools12 {
  background-color: #52c41a;
}

.button-tools13 {
  background-color: #faad14;
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