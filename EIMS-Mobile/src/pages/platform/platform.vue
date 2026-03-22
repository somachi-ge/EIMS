<template>
  <view class="platform-container">
    
    <view class="platform-menu">
      <view class="menu-item">
        <button class="menu-button button-platform5" @click="navigateTo('/pages/platform/data-asset')">
          <view class="menu-icon">
            <image src="../../static/icon/button/dataasset-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">数据资产平台</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-platform7" @click="navigateTo('/pages/platform/digital-twin')">
          <view class="menu-icon">
            <image src="../../static/icon/button/digitaltwin-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">数字孪生平台</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-platform8" @click="navigateTo('/pages/platform/algorithm')">
          <view class="menu-icon">
            <image src="../../static/icon/button/algorithm-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">算法管理平台</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-platform9" @click="navigateTo('/pages/platform/model')">
          <view class="menu-icon">
            <image src="../../static/icon/button/model-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">模型管理平台</text>
      </view>
      
      <view class="menu-item">
        <button class="menu-button button-platform10" @click="navigateTo('/pages/platform/quantum')">
          <view class="menu-icon">
            <image src="../../static/icon/button/quantum-ff.svg" class="menu-svg-icon" />
          </view>
        </button>
        <text class="menu-label">量子技术平台</text>
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
  // 平台列表已清空
  console.log('平台列表已清空')
})
</script>

<style scoped>
.platform-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #D9D9D9;
}

.platform-menu {
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

.button-platform5 {
  background-color: #d46b08;
}

.button-platform7 {
  background-color: #7cb305;
}

.button-platform8 {
  background-color: #d4380d;
}

.button-platform9 {
  background-color: #d48806;
}

.button-platform10 {
  background-color: #c41d7f;
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