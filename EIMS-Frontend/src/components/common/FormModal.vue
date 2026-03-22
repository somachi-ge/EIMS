<template>
  <a-modal
    :title="title"
    :open="visible"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="width"
  >
    <slot></slot>
  </a-modal>
</template>

<script setup lang="ts">
interface Props {
  title: string
  visible: boolean
  loading: boolean
  width?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  width: 600
})

const emit = defineEmits<{
  (e: 'ok'): void
  (e: 'cancel'): void
}>()

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
/* 样式将通过Ant Design Vue组件库自动应用 */
</style>