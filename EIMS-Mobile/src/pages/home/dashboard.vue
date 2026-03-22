<template>
  <view class="dashboard-container">
    <view class="dashboard-header">
      <text class="title">数据仪表盘</text>
    </view>
    
    <view class="dashboard-content">
      <view class="stats-card">
        <text class="stat-title">总应用数</text>
        <text class="stat-value">{{ appCount }}</text>
      </view>
      
      <view class="stats-card">
        <text class="stat-title">未读消息</text>
        <text class="stat-value">{{ unreadCount }}</text>
      </view>
      
      <view class="stats-card">
        <text class="stat-title">平台数量</text>
        <text class="stat-value">{{ platformCount }}</text>
      </view>
      
      <view class="recent-activities">
        <text class="section-title">最近活动</text>
        <view class="activity-item" v-for="activity in recentActivities" :key="activity.id">
          <text class="activity-time">{{ activity.time }}</text>
          <text class="activity-content">{{ activity.content }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const appCount = ref(0)
const unreadCount = ref(0)
const platformCount = ref(0)

const recentActivities = ref([
  { id: 1, time: '2026-03-04 10:00', content: '应用 A 状态更新' },
  { id: 2, time: '2026-03-04 09:30', content: '收到新消息' },
  { id: 3, time: '2026-03-04 09:00', content: '平台 B 连接成功' }
])

onMounted(() => {
  // 模拟数据
  appCount.value = 12
  unreadCount.value = 3
  platformCount.value = 5
})
</script>

<style scoped>
.dashboard-container {
  padding: 20rpx;
  height: 100vh;
}

.dashboard-header {
  margin-bottom: 30rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.dashboard-content {
  flex: 1;
}

.stats-card {
  background-color: #f5f7fa;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  text-align: center;
}

.stat-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #409EFF;
}

.recent-activities {
  margin-top: 40rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.activity-item {
  background-color: #f5f7fa;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 10rpx;
}

.activity-time {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 5rpx;
}

.activity-content {
  font-size: 26rpx;
  color: #333;
}
</style>