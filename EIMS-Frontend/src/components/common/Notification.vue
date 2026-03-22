<template>
  <div class="notification">
    <!-- 通知组件将通过Ant Design Vue的notification API使用 -->
  </div>
</template>

<script setup lang="ts">
import { notification } from 'ant-design-vue'

// 通知类型
type NotificationType = 'success' | 'info' | 'warning' | 'error'

// 显示通知
const showNotification = (type: NotificationType, title: string, message: string) => {
  notification[type]({
    message: title,
    description: message,
    duration: 3
  })
}

// 导出通知方法
defineExpose({
  showNotification
})
</script>

<style scoped>
/* 样式将通过Ant Design Vue组件库自动应用 */
</style>