<template>
  <view class="profile-container">
    <view class="white-container">

      <!-- 个人信息容器 -->
      <view class="profile-header">
        <image :src="userInfo.avatar || '/static/image/chongzhi.zu.png'" class="header-avatar" />
        <view class="header-divider"></view>
      </view>
      
      <view class="profile-form">
        <view class="section-title">基本信息</view>
        
        <view class="form-item tight-spacing">
          <span class="label">职工工号：</span>
          <span class="value left-align">{{ form.employeeId || '10001' }}</span>
        </view>
        
        <view class="form-item tight-spacing">
          <span class="label">职工姓名：</span>
          <span class="value left-align">{{ form.name || '祖冲之' }}</span>
        </view>
        
        <view class="form-item tight-spacing">
          <span class="label">职工职位：</span>
          <span class="value left-align">{{ form.position || '系统管理员' }}</span>
        </view>
        
        <view class="form-item tight-spacing">
          <span class="label">职工部门：</span>
          <span class="value left-align">{{ form.department || '信息中心' }}</span>
        </view>
        
        <view class="form-item tight-spacing">
          <span class="label">入职日期：</span>
          <span class="value left-align">{{ form.hireDate || '2026-01-01' }}</span>
        </view>
        
        <view class="section-title">联系信息</view>
        
        <view class="form-item tight-spacing">
          <span class="label">电子邮箱：</span>
          <span class="value left-align">{{ form.email || 'chongzhi.zu@cncc.ai' }}</span>
        </view>
        
        <view class="form-item tight-spacing">
          <span class="label">移动电话：</span>
          <view v-if="isEditing" class="input-with-icon">
            <input v-model="form.phone" placeholder="请输入移动电话" class="field-input" />
          </view>
          <span v-else class="value left-align">{{ form.phone || '13800138000' }}</span>
        </view>
      </view>
    </view>
    
    <view class="button-container">
      <button class="action-btn cancel-btn" @click="goBack">返回</button>
      <button class="action-btn confirm-btn" @click="handleEdit">{{ isEditing ? '确认修改' : '编辑资料' }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const form = ref<any>({})
const userInfo = ref<any>({
  avatar: ''
})
const isEditing = ref(false)

onMounted(() => {
  // 使用模拟数据，暂不与后端交互
  const mockUserInfo = {
    id: 1,
    username: '祖冲之',
    name: '祖冲之',
    email: 'chongzhi.zu@cncc.ai',
    phone: '13800138000',
    avatar: '/static/image/chongzhi.zu.png',
    employeeId: '10001',
    position: '系统管理员',
    department: '信息中心',
    hireDate: '2026-01-01'
  }
  form.value = mockUserInfo
  userInfo.value = mockUserInfo
})

const goBack = () => {
  uni.navigateBack()
}

const handleEdit = () => {
  if (isEditing.value) {
    // 校验移动电话号码
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(form.value.phone)) {
      uni.showToast({
        title: '请输入正确的移动电话号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 显示修改成功提示
    uni.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    })
    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 2000)
  }
  isEditing.value = !isEditing.value
}

</script>

<style scoped>
.profile-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #d9d9d9;
}

.white-container {
  background-color: white;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30rpx;
}

.header-avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
}

.header-divider {
  width: 100%;
  height: 1rpx;
  background-color: #bfbfbf;
}

.profile-form {
  flex: 1;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin: 30rpx 0 20rpx 0;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #bfbfbf;
}

.label {
  font-size: 28rpx;
  color: #666;
  flex: 1;
}

.value {
  font-size: 28rpx;
  color: #333;
  flex: 2;
  text-align: right;
}

.left-align {
  text-align: left;
}

.tight-spacing .label {
  flex: 0.5;
}

.tight-spacing .value {
  flex: 1.5;
}

.button-container {
  width: 100%;
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.confirm-btn {
  background-color: #409EFF;
  color: white;
}

.action-btn::after {
  border: none;
}

.input-with-icon {
  position: relative;
  flex: 1.5;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24rpx;
  color: #999;
  z-index: 1;
}

.field-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #bfbfbf;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

</style>