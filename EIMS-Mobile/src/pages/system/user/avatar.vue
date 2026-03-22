<template>
  <view class="avatar-container">

    <!-- 白色容器 -->
    <view class="white-container">
      <view class="avatar-header">
        <image :src="avatarUrl || '/static/image/chongzhi.zu.png'" class="header-avatar" @click="showAvatarMenu" />
      </view>
      
      <view class="avatar-preview">
        <text class="hint">点击选择新头像</text>
        <view class="divider"></view>
        <view class="upload-tips">
          <text class="tips-title">上传提示：</text>
          <text class="tips-content">·支持 JPG、PNG 格式</text>
          <text class="tips-content">·文件大小不超过2MB</text>
          <text class="tips-content">·建议尺寸：200x200像素</text>
        </view>
      </view>
      
      <view class="avatar-actions">
        <button @click="cancel" class="action-btn cancel-btn">取消</button>
        <button @click="confirmChange" class="action-btn confirm-btn">确认修改</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../../store/modules/user'

const userStore = useUserStore()
const avatarUrl = ref('')

onMounted(() => {
  // 使用模拟数据，暂不与后端交互
  avatarUrl.value = '/static/image/chongzhi.zu.png'
})

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album'],
    success: (res) => {
      uploadImage(res.tempFilePaths[0])
    },
    fail: (error) => {
      console.error('选择图片失败:', error)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['camera'],
    success: (res) => {
      uploadImage(res.tempFilePaths[0])
    },
    fail: (error) => {
      console.error('拍照失败:', error)
      uni.showToast({
        title: '拍照失败',
        icon: 'none'
      })
    }
  })
}

const showAvatarMenu = () => {
  uni.showActionSheet({
    itemList: ['从相册选择', '拍照'],
    success: (res) => {
      if (res.tapIndex === 0) {
        chooseImage()
      } else if (res.tapIndex === 1) {
        takePhoto()
      }
    }
  })
}

const cancel = () => {
  uni.navigateBack()
}

const confirmChange = () => {
  // 这里可以添加确认修改的逻辑
  // 例如：如果有新头像需要上传，可以在这里调用 uploadImage
  uni.showToast({
    title: '修改成功',
    icon: 'success'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

const uploadImage = async (filePath: string) => {
  uni.showLoading({
    title: '上传中...'
  })
  
  try {
    // 模拟上传
    // 实际项目中应使用 uni.uploadFile 上传到服务器
    console.log('上传文件路径:', filePath)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟返回的头像 URL
    const newAvatarUrl = 'https://example.com/avatar.jpg'
    avatarUrl.value = newAvatarUrl
    
    // 更新用户信息
    const userInfo = userStore.currentUser
    if (userInfo) {
      userInfo.avatar = newAvatarUrl
      userStore.setUserInfo(userInfo)
    }
    
    uni.showToast({
      title: '上传成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('上传失败:', error)
    uni.showToast({
      title: '上传失败',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style scoped>
.avatar-container {
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

.avatar-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30rpx;
  width: 100%;
}

.header-avatar {
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
}



.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10rpx;
}

.avatar {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
}

.hint {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.divider {
  width: 100%;
  height: 1rpx;
  background-color: #bfbfbf;
}

.upload-tips {
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

.avatar-actions {
  width: 100%;
  display: flex;
  gap: 20rpx;
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