<template>
  <view class="message-detail-container">
    <view class="message-detail-content">
      <text class="message-title">{{ message.title }}</text>
      <text class="message-time">{{ message.time }}</text>
      <text class="message-body">{{ message.content }}</text>
    </view>
    
    <view class="button-container">
      <button class="back-button" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const message = ref({
  title: '',
  time: '',
  content: ''
})

onMounted(() => {
  // 使用 uni-app 推荐的方式获取页面参数
  const pages = getCurrentPages() as any
  const currentPage = pages[pages.length - 1]
  const id = currentPage.options?.id || uni.getStorageSync('messageId')
  if (id) {
    // 使用与 index.vue 相同的消息数据
    const mockMessages = [
      { id: 1, title: '消息通知', content: '您有一条新的消息通知，请及时查看', time: '2026-03-07 10:00' },
      { id: 2, title: '系统公告', content: '系统将于本周日进行维护升级，届时服务可能暂时不可用', time: '2026-03-07 09:30' },
      { id: 3, title: '安全提醒', content: '您的账户密码已超过90天未更换，建议及时更新密码', time: '2026-03-07 09:00' },
      { id: 4, title: '消息通知', content: '您的申请已通过审核，请登录系统查看详情', time: '2026-03-06 18:00' },
      { id: 5, title: '系统公告', content: '新增功能已上线，包括数据导出和报表生成', time: '2026-03-06 15:00' },
      { id: 6, title: '安全提醒', content: '检测到异常登录尝试，请确认是否为您本人操作', time: '2026-03-06 10:00' },
      { id: 7, title: '消息通知', content: '您的会议将于15分钟后开始，请做好准备', time: '2026-03-07 14:45' },
      { id: 8, title: '系统公告', content: '系统性能已优化，响应速度提升30%', time: '2026-03-07 14:00' }
    ]
    const foundMessage = mockMessages.find(msg => msg.id === parseInt(id as string))
    if (foundMessage) {
      message.value = foundMessage
    }
  }
})

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.message-detail-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #D9D9D9;
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

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.message-detail-content {
  flex: 1;
  background-color: white;
  border-radius: 12rpx;
  padding: 30rpx;
}

.message-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.message-time {
  font-size: 22rpx;
  color: #999;
  margin-bottom: 30rpx;
  display: block;
}

.message-body {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
</style>