<template>
  <a-tree
    v-model:checkedKeys="checkedKeys"
    :treeData="treeData"
    checkable
    @check="handleCheck"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  treeData: any[]
  checkedKeys?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  checkedKeys: () => []
})

const checkedKeys = ref<string[]>([...props.checkedKeys])

const emit = defineEmits<{
  (e: 'update:checkedKeys', keys: string[]): void
  (e: 'check', checkedKeys: string[], info: any): void
}>()

// 监听外部checkedKeys变化
watch(
  () => props.checkedKeys,
  (newKeys) => {
    checkedKeys.value = [...newKeys]
  },
  { deep: true }
)

// 监听内部checkedKeys变化
watch(
  checkedKeys,
  (newKeys) => {
    emit('update:checkedKeys', newKeys)
  },
  { deep: true }
)

const handleCheck = (checkedKeys: string[], info: any) => {
  emit('check', checkedKeys, info)
}

// 获取选中的权限
const getCheckedPermissions = () => {
  return checkedKeys.value
}

// 导出方法
defineExpose({
  getCheckedPermissions
})
</script>

<style scoped>
/* 样式将通过Ant Design Vue组件库自动应用 */
</style>