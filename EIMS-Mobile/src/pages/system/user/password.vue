<template>
  <view class="profile-container">
    <view class="white-container">
      <view class="form-group">
        <text class="field-label">旧密码</text>
        <view class="input-with-icon">
          <image src="../../../static/icon/all/pass-59.svg" class="input-icon" />
          <input type="password" v-model="form.oldPassword" placeholder="请输入旧密码" class="field-input" />
        </view>
      </view>
      
      <view class="form-group">
        <text class="field-label">新密码</text>
        <view class="input-with-icon">
          <image src="../../../static/icon/all/pass-59.svg" class="input-icon" />
          <input type="password" v-model="form.newPassword" placeholder="请输入新密码" class="field-input" />
        </view>
      </view>
      
      <view class="form-group">
        <text class="field-label">确认新密码</text>
        <view class="input-with-icon">
          <image src="../../../static/icon/all/pass-59.svg" class="input-icon" />
          <input type="password" v-model="form.confirmPassword" placeholder="请确认新密码" class="field-input" />
        </view>
      </view>
      
      <view class="password-actions">
        <button @click="cancel" class="action-btn cancel-btn">取消</button>
        <button @click="submit" class="action-btn confirm-btn">确认修改</button>
      </view>
    </view>
    
    <view class="password-tips">
      <text class="tips-title">密码设置建议：</text>
      <text class="tips-content">·长度8-20位</text>
      <text class="tips-content">·包含字母和数字</text>
      <text class="tips-content">·字母区分大小写</text>
      <text class="tips-content">·避免使用常见密码</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const cancel = () => {
  uni.navigateBack()
}

const submit = async () => {
  if (!form.value.oldPassword) {
    uni.showToast({
      title: '请输入旧密码',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.newPassword) {
    uni.showToast({
      title: '请输入新密码',
      icon: 'none'
    })
    return
  }
  
  if (form.value.newPassword.length < 8 || form.value.newPassword.length > 20) {
    uni.showToast({
      title: '新密码长度必须在8-20位之间',
      icon: 'none'
    })
    return
  }
  
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(form.value.newPassword)) {
    uni.showToast({
      title: '新密码必须包含字母和数字',
      icon: 'none'
    })
    return
  }
  
  if (form.value.newPassword !== form.value.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return
  }
  
  try {
    // 模拟修改密码
    // 实际项目中应调用后端API
    await new Promise(resolve => setTimeout(resolve, 1000))
    uni.showToast({
      title: '密码修改成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/system/user/index'
      })
    }, 1000)
  } catch (error) {
    console.error('修改密码失败:', error)
    uni.showToast({
      title: '修改密码失败，请稍后重试',
      icon: 'none'
    })
  }
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

.form-group {
  margin-bottom: 30rpx;
}

.field-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.input-with-icon {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 24rpx;
  height: 24rpx;
  z-index: 1;
}

.field-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #bfbfbf;
  border-radius: 8rpx;
  padding: 0 20rpx 0 60rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

.password-tips {
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 16rpx;
  margin: 30rpx 0 20rpx 0;
  width: 100%;
  box-sizing: border-box;
}

.tips-title {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.tips-content {
  font-size: 22rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.password-actions {
  width: 100%;
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
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
</style>