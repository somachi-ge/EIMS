<template>
  <view class="home-container">
    <!-- 顶部容器 -->
    <view class="home-header">
      <!-- 顶部Logo容器 -->
      <view class="logo">
        <image src="/static/icon/logo_color.svg" mode="aspectFit" class="logo-image" />
      </view>
      <!-- 顶部用户信息容器 -->
      <view class="user-info">
        <image @click="goToUserCenter" src="/static/image/chongzhi.zu.png" mode="aspectFit" class="avatar" />
        <text @click="goToUserCenter" class="username">祖冲之</text>
      </view>
    </view>
    
    <view class="home-content">
      <!-- Banner容器 -->
      <view class="banner-container">
        <swiper class="banner-swiper" indicator-dots circular autoplay>
          <swiper-item v-for="(banner, index) in banners" :key="index">
            <image :src="banner" class="banner-image" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>
      
       <!-- 快捷功能标题容器 -->
      <view class="section-title" style="padding-left: 30rpx; margin-top: 25rpx;">快捷功能</view>
      
      <!-- 快捷功能第一排容器 -->
      <view class="quick-functions-container" style="display: flex; padding: 0 20rpx; margin-bottom: 20rpx; gap: 20rpx;">
        <!-- 消息中心容器 -->
        <view @click="goToMessageCenter" class="message-card" style="flex: 1; padding: 20rpx 20rpx; background-color: #ffffff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120rpx;">
          <text class="message-icon" style="font-size: 48rpx; margin-bottom: 10rpx;">🔔</text>
          <text class="message-text" style="font-size: 26rpx; color: #333; font-weight: 400;">消息中心</text>
        </view>
        
        <!-- 考勤管理容器 -->
        <view class="attendance-card" style="flex: 1; padding: 20rpx 20rpx; background-color: #ffffff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120rpx;">
          <text class="attendance-icon" style="font-size: 48rpx; margin-bottom: 10rpx;">📅</text>
          <text class="attendance-text" style="font-size: 26rpx; color: #333; font-weight: 400;">考勤管理</text>
        </view>
        
        <!-- 请假申请容器 -->
        <view class="leave-card" style="flex: 1; padding: 20rpx 20rpx; background-color: #ffffff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120rpx;">
          <text class="leave-icon" style="font-size: 48rpx; margin-bottom: 10rpx;">🏖️</text>
          <text class="leave-text" style="font-size: 26rpx; color: #333; font-weight: 400;">请假申请</text>
        </view>
        
        <!-- 报销管理容器 -->
        <view class="reimbursement-card" style="flex: 1; padding: 20rpx 20rpx; background-color: #ffffff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120rpx;">
          <text class="reimbursement-icon" style="font-size: 48rpx; margin-bottom: 10rpx;">💰</text>
          <text class="reimbursement-text" style="font-size: 26rpx; color: #333; font-weight: 400;">报销管理</text>
        </view>
      </view>
      
      <!-- 快捷功能第二排容器 -->
      <view class="quick-functions-container" style="display: flex; padding: 0 20rpx; margin-bottom: 20rpx; gap: 20rpx;">
        <!-- 审批流程容器 -->
        <view class="approval-card" style="flex: 1; padding: 20rpx 20rpx; background-color: #ffffff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120rpx;">
          <text class="approval-icon" style="font-size: 48rpx; margin-bottom: 10rpx;">📋</text>
          <text class="approval-text" style="font-size: 26rpx; color: #333; font-weight: 400;">审批流程</text>
        </view>
        
        <!-- 规章制度容器 -->
        <view class="document-card" style="flex: 1; padding: 20rpx 20rpx; background-color: #ffffff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120rpx;">
          <text class="document-icon" style="font-size: 48rpx; margin-bottom: 10rpx;">📄</text>
          <text class="document-text" style="font-size: 26rpx; color: #333; font-weight: 400;">规章制度</text>
        </view>
        
        <!-- 会议管理容器 -->
        <view class="meeting-card" style="flex: 1; padding: 20rpx 20rpx; background-color: #ffffff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120rpx;">
          <text class="meeting-icon" style="font-size: 48rpx; margin-bottom: 10rpx;">🤝</text>
          <text class="meeting-text" style="font-size: 26rpx; color: #333; font-weight: 400;">会议管理</text>
        </view>
        
        <!-- 报表分析容器 -->
        <view class="report-card" style="flex: 1; padding: 20rpx 20rpx; background-color: #ffffff; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120rpx;">
          <text class="report-icon" style="font-size: 48rpx; margin-bottom: 10rpx;">📊</text>
          <text class="report-text" style="font-size: 26rpx; color: #333; font-weight: 400;">报表分析</text>
        </view>
      </view>

      <!-- 新闻公告标题容器 -->
      <view style="display: flex; justify-content: space-between; align-items: center; padding: 0 30rpx; margin-bottom: 25rpx;">
        <text class="section-title" style="display: inline-block; font-size: 32rpx; font-weight: bold; color: #333; margin-bottom: 0;">新闻公告</text>
        <text class="more-link" style="font-size: 24rpx; color: #409EFF;">更多 ></text>
      </view>
      
      <!-- 新闻公告容器 -->
      <view class="news-card" style="padding: 20rpx; background-color: #ffffff; margin: 0 20rpx 20rpx; border-radius: 12rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);">
        <view class="news-list">
          <view class="news-item" v-for="(news, index) in newsList" :key="index" style="padding: 20rpx 0; border-bottom: 1rpx solid #bfbfbf; display: flex; justify-content: space-between; align-items: center;">
            <view class="news-content" style="flex: 1; padding-right: 20rpx;">
              <text class="news-title" style="font-size: 26rpx; color: #333; margin-bottom: 10rpx; display: block; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical;">{{ news.title }}</text>
              <text class="news-date" style="font-size: 22rpx; color: #999;">{{ news.date }}</text>
            </view>
            <text class="news-arrow" style="font-size: 28rpx; color: #999;">></text>
          </view>
        </view>
      </view>
      
      <!-- 版权声明 -->
      <view class="copyright-section">
        <text class="copyright-text">© 2026 企业综合管理系统</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Banner图片
const banners = ref([
  '/static/image/img_001.png',
  '/static/image/img_002.png',
  '/static/image/img_003.png'
])



// 新闻公告
const newsList = ref([
  { title: '公司2026年度工作计划会议圆满召开', date: '2026-02-20' },
  { title: '新员工入职培训安排通知', date: '2026-02-18' },
  { title: '2026年春节放假安排', date: '2026-02-15' },
  { title: '公司获得行业创新奖', date: '2026-02-10' },
  { title: '公司组织2026年度团建活动', date: '2026-02-05' }
])

// 跳转到用户个人中心
const goToUserCenter = () => {
  uni.navigateTo({
    url: '/pages/system/user/index'
  })
}

// 跳转到消息中心
const goToMessageCenter = () => {
  uni.navigateTo({
    url: '/pages/system/message/index'
  })
}
</script>

<style scoped>
.home-container {
  padding: 0;
  min-height: 100vh;
  background-color: #d9d9d9;
  display: flex;
  flex-direction: column;
}

/* 顶部 */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 内容区域 */
.home-content {
  flex: 1;
  width: 100%;
}

.logo-image {
  width: 80rpx;
  height: 80rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.username {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}

/* Banner区域 */
.banner-container {
  width: 100%;
  height: 300rpx;
  margin-top: 10rpx;
  margin-bottom: 20rpx;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 25rpx;
  display: block;
}

/* 新闻公告区 */
.news-section {
  padding: 30rpx 30rpx 0rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
}

.more-link {
  font-size: 24rpx;
  color: #409EFF;
}

.news-list {
  width: 100%;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #bfbfbf;
}

.news-item:last-child {
  border-bottom: none;
}

.news-content {
  flex: 1;
  padding-right: 20rpx;
}

.news-title {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.news-date {
  font-size: 22rpx;
  color: #999;
}

.news-arrow {
  font-size: 28rpx;
  color: #999;
}

/* 版权声明 */
.copyright-section {
  padding: 30rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx; /* 与上方间距保持一致 */
  text-align: center;
}

.copyright-text {
  font-size: 22rpx;
  color: #999;
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
  .action-icon {
    font-size: 40rpx;
  }
  
  .action-text {
    font-size: 22rpx;
  }
  
  .banner-container {
    height: 250rpx;
  }
}

@media screen and (min-width: 414px) {
  .banner-container {
    height: 350rpx;
  }
  
  .action-icon {
    font-size: 56rpx;
  }
}
</style>