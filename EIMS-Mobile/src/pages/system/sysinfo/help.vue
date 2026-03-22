<template>
  <view class="help-container">
    <view class="white-container">
      <view class="help-content">
        <view class="help-section">
          <text class="section-title">常见问题</text>
          <text class="empty-line"></text>
          
          <view class="help-item" v-for="item in faqItems" :key="item.id">
            <text class="help-question">{{ item.question }}</text>
            <text class="help-answer">{{ item.answer }}</text>
          </view>
        </view>
        
        <view class="help-section">
          <text class="section-title">使用指南</text>
          <text class="empty-line"></text>
          
          <view class="help-item" v-for="guide in guideItems" :key="guide.id">
            <text class="help-question">{{ guide.title }}</text>
            <text class="help-answer">{{ guide.content }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="button-container">
      <button class="back-button" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const faqItems = ref([
  {
    id: 1,
    question: '如何登录系统？',
    answer: '在登录页面输入用户名和密码，点击登录按钮即可。如果忘记密码，可以点击忘记密码链接进行密码重置。'
  },
  {
    id: 2,
    question: '如何添加新应用？',
    answer: '在应用管理页面点击“添加应用”按钮，填写应用信息并提交即可。'
  },
  {
    id: 3,
    question: '如何查看消息通知？',
    answer: '在消息中心页面查看所有消息通知，包括系统通知、应用通知和平台通知。'
  }
])

const guideItems = ref([
  {
    id: 1,
    title: '系统导航',
    content: '系统底部导航栏包含首页、应用、平台和系统四个模块，点击相应图标即可进入对应页面。'
  },
  {
    id: 2,
    title: '个人设置',
    content: '在系统页面点击“个人中心”，可以修改个人资料、头像、联系方式等信息。'
  },
  {
    id: 3,
    title: '通知设置',
    content: '在消息中心页面点击“设置”，可以配置通知类型和接收方式。'
  }
])

// 暂不与后端交互，使用本地模拟数据
// onMounted(async () => {
//   try {
//     const res = await systemApi.getHelpArticles({})
//     // 实际项目中可以从接口获取帮助文档
//   } catch (error) {
//     console.error('获取帮助文档失败:', error)
//   }
// })

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.help-container {
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

.help-content {
  flex: 1;
}

.help-section {
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

.help-item {
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 15rpx;
}

.help-question {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.help-answer {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
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