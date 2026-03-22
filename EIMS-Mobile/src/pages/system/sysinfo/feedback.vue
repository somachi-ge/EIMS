<template>
  <view class="feedback-container">
    <view class="white-container">
      <view class="feedback-form">
        <view class="form-item">
          <text class="label">反馈类型</text>
          <view class="type-tags">
            <view 
              v-for="(type, index) in feedbackTypes" 
              :key="index"
              :class="['type-tag', { active: form.type === index }]"
              @click="form.type = index"
            >
              {{ type }}
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">反馈内容</text>
          <view class="textarea-container">
            <textarea 
              v-model="form.content" 
              placeholder="请详细描述您的问题或建议..." 
              rows="5"
              maxlength="500"
            ></textarea>
            <text class="char-count">{{ form.content.length }}/500</text>
          </view>
        </view>
        
        <view class="form-item">
          <text class="label">联系方式</text>
          <input 
            v-model="form.contact" 
            type="text" 
            placeholder="请留下您的邮箱或移动电话，方便我们回复" 
          />
        </view>
        
        <view class="form-item">
          <text class="label">上传图片（选填）</text>
          <view class="upload-section">
            <view class="upload-btn" @click="chooseImage">
              <text class="upload-plus">+</text>
              <text class="upload-text">添加图片</text>
            </view>
            <text class="upload-tip">最多上传3张图片</text>
          </view>
        </view>
        
        <view class="feedback-actions">
          <button @click="goBack" class="action-btn cancel-btn">取消</button>
          <button @click="submitFeedback" class="action-btn confirm-btn">提交反馈</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { systemApi } from '../../../services/api/system'

const form = ref({
  type: 0,
  content: '',
  contact: ''
})

const feedbackTypes = [
  '功能建议',
  'bug报告',
  '界面优化',
  '其他问题'
]

const chooseImage = () => {
  uni.chooseImage({
    count: 3,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      console.log('选择图片成功:', res.tempFilePaths)
    },
    fail: (error) => {
      console.error('选择图片失败:', error)
    }
  })
}

const submitFeedback = async () => {
  if (!form.value.content) {
    uni.showToast({
      title: '请输入反馈内容',
      icon: 'none'
    })
    return
  }
  
  try {
    await systemApi.submitFeedback(form.value)
    uni.showToast({
      title: '反馈提交成功',
      icon: 'success'
    })
    form.value = {
      type: 0,
      content: '',
      contact: ''
    }
  } catch (error) {
    console.error('提交反馈失败:', error)
  }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.feedback-container {
  padding: 20rpx;
  height: 100vh;
  background-color: #D9D9D9;
}

.white-container {
  background-color: white;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.feedback-form {
  flex: 1;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  font-weight: bold;
}

.type-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.type-tag {
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  background-color: #f0f0f0;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.type-tag.active {
  background-color: #409EFF;
  color: white;
}

.textarea-container {
  position: relative;
}

textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1rpx solid #bfbfbf;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  min-height: 200rpx;
  background-color: #f5f5f5;
  resize: none;
}

.char-count {
  position: absolute;
  bottom: 10rpx;
  right: 20rpx;
  font-size: 24rpx;
  color: #999;
}

input {
  width: 100%;
  box-sizing: border-box;
  height: 80rpx;
  border: 1rpx solid #bfbfbf;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background-color: #f5f5f5;
}

.upload-section {
  margin-top: 10rpx;
}

.upload-btn {
  width: 120rpx;
  height: 120rpx;
  border: 1rpx dashed #bfbfbf;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  cursor: pointer;
}

.upload-plus {
  font-size: 40rpx;
  color: #999;
  margin-bottom: 5rpx;
}

.upload-text {
  font-size: 22rpx;
  color: #999;
}

.upload-tip {
  font-size: 22rpx;
  color: #999;
  margin-top: 10rpx;
}

.feedback-actions {
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

.action-btn::after {
  border: none;
}
</style>