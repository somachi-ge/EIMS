<template>
  <view class="message-container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <view class="refresh-indicator" v-if="isRefreshing">
      <view class="loading-spinner">
        <view class="spinner-circle"></view>
      </view>
      <text class="refresh-text">刷新中...</text>
    </view>
    <view class="white-container" :style="{ transform: `translateY(${pullDistance}rpx)` }">
      <view class="message-tabs">
        <text 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab-item', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.value === 'unread' && unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </text>
      </view>
      
      <view class="message-list">
        <view 
          v-for="message in filteredMessages" 
          :key="message.id"
          class="message-item"
          @click="viewMessage(message.id)"
        >
          <view class="message-info">
            <text class="message-title">{{ message.title }}</text>
            <text class="message-time">{{ message.time }}</text>
          </view>
          <text class="message-content">{{ message.content }}</text>
          <text v-if="!message.read" class="unread-dot"></text>
        </view>
        <!-- 上拉加载更多区域（动态显示状态） -->
        <view class="load-more">
          <view v-if="isLoadingMore" class="loading-spinner small-spinner">
            <view class="spinner-circle"></view>
          </view>
          <text class="load-more-text">{{ loadMoreText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Message {
  id: number;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

const activeTab = ref('all')

const messages = ref<Message[]>([
  { id: 1, title: '消息通知', content: '您有一条新的消息通知，请及时查看', time: '2026-03-07 10:00', read: false },
  { id: 2, title: '系统公告', content: '系统将于本周日进行维护升级，届时服务可能暂时不可用', time: '2026-03-07 09:30', read: false },
  { id: 3, title: '安全提醒', content: '您的账户密码已超过90天未更换，建议及时更新密码', time: '2026-03-07 09:00', read: true },
  { id: 4, title: '消息通知', content: '您的申请已通过审核，请登录系统查看详情', time: '2026-03-06 18:00', read: true },
  { id: 5, title: '系统公告', content: '新增功能已上线，包括数据导出和报表生成', time: '2026-03-06 15:00', read: false },
  { id: 6, title: '安全提醒', content: '检测到异常登录尝试，请确认是否为您本人操作', time: '2026-03-06 10:00', read: true },
  { id: 7, title: '消息通知', content: '您的会议将于15分钟后开始，请做好准备', time: '2026-03-07 14:45', read: false },
  { id: 8, title: '系统公告', content: '系统性能已优化，响应速度提升30%', time: '2026-03-07 14:00', read: true },
  { id: 9, title: '消息通知', content: '您的请假申请已批准，请查看详情', time: '2026-03-07 15:30', read: false },
  { id: 10, title: '安全提醒', content: '您的账户在新设备上登录，如非本人操作请及时修改密码', time: '2026-03-07 16:00', read: false }
])

const tabs = [
  { label: '全部', value: 'all' },
  { label: '未读', value: 'unread' },
  { label: '通知', value: 'notification' },
  { label: '系统', value: 'system' },
  { label: '安全', value: 'security' }
]

const unreadCount = computed(() => {
  return messages.value.filter(msg => !msg.read).length
})

const filteredMessages = computed(() => {
  switch (activeTab.value) {
    case 'unread':
      return messages.value.filter(msg => !msg.read)
    case 'notification':
      return messages.value.filter(msg => msg.title.includes('通知'))
    case 'system':
      return messages.value.filter(msg => msg.title.includes('系统'))
    case 'security':
      return messages.value.filter(msg => msg.title.includes('安全'))
    default:
      return messages.value
  }
})

// 下拉刷新相关变量
const startY = ref(0)
const refreshDistance = ref(0)      // 下拉偏移 (正数)
const loadMoreDistance = ref(0)     // 上拉偏移 (负数)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)    // 是否正在加载更多
const refreshThreshold = 80          // 触发阈值
const hasMore = ref(true)            // 是否还有更多数据（模拟）

// 组合后的总偏移量（下拉正数，上拉负数）
const pullDistance = computed(() => {
  return refreshDistance.value + loadMoreDistance.value
})

// 根据状态显示底部提示文字
const loadMoreText = computed(() => {
  if (isLoadingMore.value) return '加载中...'
  if (!hasMore.value) return '没有更多消息了'
  return '上滑加载更多消息'
})

// 触摸开始
const touchStart = (e: any) => {
  if (isRefreshing.value || isLoadingMore.value) return
  // 强制滚动到顶部，确保下拉刷新从顶部开始 (可根据需要调整)
  uni.pageScrollTo({ scrollTop: 0, duration: 0 })
  startY.value = e.touches[0].clientY
  // 重置距离 (不重置的话可能会保留上一次的偏移)
  // 但要注意如果正在加载中，不应重置，前面已拦截
  refreshDistance.value = 0
  loadMoreDistance.value = 0
}

// 触摸移动
const touchMove = (e: any) => {
  if (isRefreshing.value || isLoadingMore.value) return
  
  const currentY = e.touches[0].clientY
  const deltaY = currentY - startY.value
  
  // 如果当前有下拉偏移，则不处理上拉 (互斥)
  if (refreshDistance.value > 0) {
    // 已经在下拉状态，只处理继续下拉
    if (deltaY > 0) {
      refreshDistance.value = Math.min(deltaY * 0.5, refreshThreshold * 2)
    } else {
      // 轻微上滑时回弹下拉距离
      refreshDistance.value = Math.max(0, refreshDistance.value + deltaY * 0.5)
    }
    return
  }
  
  // 如果当前有上拉偏移，则不处理下拉 (互斥)
  if (loadMoreDistance.value < 0) {
    // 已经在上拉状态，只处理继续上拉
    if (deltaY < 0) {
      loadMoreDistance.value = -Math.min(Math.abs(deltaY) * 0.5, refreshThreshold * 2)
    } else {
      // 轻微下滑时回弹上拉距离
      loadMoreDistance.value = Math.min(0, loadMoreDistance.value + deltaY * 0.5)
    }
    return
  }
  
  // 初始无偏移，根据方向设置对应的距离
  if (deltaY > 0) { // 下拉
    refreshDistance.value = Math.min(deltaY * 0.5, refreshThreshold * 2)
    loadMoreDistance.value = 0
  } else if (deltaY < 0) { // 上拉
    loadMoreDistance.value = -Math.min(Math.abs(deltaY) * 0.5, refreshThreshold * 2)
    refreshDistance.value = 0
  }
}

// 触摸结束
const touchEnd = () => {
  if (isRefreshing.value || isLoadingMore.value) return

  // 判断是否触发下拉刷新
  if (refreshDistance.value >= refreshThreshold) {
    refreshData()
  }
  // 判断是否触上拉加载更多 (且有更多数据)
  else if (loadMoreDistance.value <= -refreshThreshold && hasMore.value) {
    loadMoreData()
  }
  else {
    // 未达到阈值，回弹复位
    refreshDistance.value = 0
    loadMoreDistance.value = 0
  }
}

// 模拟下拉刷新
const refreshData = () => {
  isRefreshing.value = true
  // 保持偏移量，让白色容器停留在下拉位置，直到刷新完成

  setTimeout(() => {
    // 生成1到5条随机数量的最新消息
    const messageCount = Math.floor(Math.random() * 5) + 1
    const newMessages: Message[] = []
    
    for (let i = 0; i < messageCount; i++) {
      const newMessage: Message = {
        id: Date.now() + i,
        title: '刷新通知',
        content: `下拉刷新成功，获取了最新消息 ${i + 1}`,
        time: new Date().toLocaleString('zh-CN'),
        read: false
      }
      newMessages.push(newMessage)
    }
    
    // 将新消息添加到列表开头
    messages.value.unshift(...newMessages)
    
    // 先隐藏刷新指示器，再让白色容器回弹
    isRefreshing.value = false
    
    // 延迟一点时间再回弹，确保刷新指示器完全消失
    setTimeout(() => {
      refreshDistance.value = 0
      loadMoreDistance.value = 0
    }, 100)
  }, 1500)
}

// 模拟上拉加载更多
const loadMoreData = () => {
  if (isLoadingMore.value || !hasMore.value) return
  
  isLoadingMore.value = true
  // 立即复位偏移，显示底部加载状态
  refreshDistance.value = 0
  loadMoreDistance.value = 0

  setTimeout(() => {
    // 模拟加载5条旧消息
    const newMessages: Message[] = []
    const currentLength = messages.value.length
    
    for (let i = 0; i < 5; i++) {
      // 检查是否达到30条上限
      if (currentLength + i >= 30) {
        break
      }
      
      const oldMessage: Message = {
        id: Date.now() + i + 1,
        title: '历史消息',
        content: `这是通过上滑加载的更早的消息 ${currentLength + i + 1}`,
        time: `2026-03-0${5 - Math.floor((currentLength + i) / 10)} ${8 - (currentLength + i) % 10}:00`,
        read: true
      }
      newMessages.push(oldMessage)
    }
    
    // 添加新消息
    messages.value.push(...newMessages)
    
    // 检查是否达到30条上限
    hasMore.value = messages.value.length < 30
    
    isLoadingMore.value = false
    // 确保偏移归零
    refreshDistance.value = 0
    loadMoreDistance.value = 0
    

  }, 1500)
}

const viewMessage = (id: number) => {
  // 标记为已读
  const message = messages.value.find(msg => msg.id === id)
  if (message && !message.read) {
    message.read = true
  }
  
  uni.navigateTo({
    url: `/pages/system/message/detail?id=${id}`
  })
}


</script>

<style scoped>
.message-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #D9D9D9;
  position: relative;
  overflow: hidden;
}

.refresh-indicator {
  position: absolute;
  top: 30rpx;
  left: 0;
  right: 0;
  height: 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 8rpx;
}

/* 底部小尺寸加载圈 */
.small-spinner {
  width: 30rpx;
  height: 30rpx;
  margin-right: 8rpx;
  margin-bottom: 0;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 4rpx solid #E4E7ED;
  border-top: 4rpx solid #409EFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.refresh-text {
  font-size: 24rpx;
  color: #666;
}

.white-container {
  background-color: white;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40rpx);
}

.message-tabs {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
  overflow-x: auto;
}

.tab-item {
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
  position: relative;
  white-space: nowrap;
}

.tab-item.active {
  background-color: #409EFF;
  color: white;
}

.badge {
  position: absolute;
  top: -5rpx;
  right: -5rpx;
  background-color: #F56C6C;
  color: white;
  font-size: 16rpx;
  padding: 2rpx 8rpx;
  border-radius: 10rpx;
  min-width: 20rpx;
  text-align: center;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20rpx;
}

.message-item {
  background-color: #f5f7fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.message-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.message-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.message-time {
  font-size: 20rpx;
  color: #999;
}

.message-content {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.unread-dot {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 10rpx;
  height: 10rpx;
  background-color: #F56C6C;
  border-radius: 50%;
}

.load-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rpx;
  gap: 10rpx;
}

.load-more-text {
  font-size: 24rpx;
  color: #999;
}
</style>