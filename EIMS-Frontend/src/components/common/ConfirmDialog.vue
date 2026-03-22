<template>
  <a-popconfirm
    :title="title"
    :open="visible"
    :confirm-loading="loading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @visibleChange="handleVisibleChange"
  >
    <slot></slot>
  </a-popconfirm>
</template>

<script setup lang="ts">
interface Props {
  title: string
  visible: boolean
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'visibleChange', visible: boolean): void
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleVisibleChange = (visible: boolean) => {
  emit('visibleChange', visible)
}
</script>

<style scoped>
/* 样式将通过Ant Design Vue组件库自动应用 */
</style>