<template>
  <a-form
    :model="form"
    :rules="rules"
    ref="formRef"
    layout="vertical"
  >
    <a-form-item label="部门名称" name="name">
      <a-input v-model:value="form.name" placeholder="请输入部门名称" />
    </a-form-item>
    <a-form-item label="上级部门" name="parentId">
      <a-select v-model:value="form.parentId" placeholder="请选择上级部门">
        <a-select-option value="0">无</a-select-option>
        <a-select-option v-for="dept in departments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="部门描述" name="description">
      <a-textarea v-model:value="form.description" placeholder="请输入部门描述" rows="4" />
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-switch v-model:checked="form.status" />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Props {
  departments: Array<{ id: number; name: string }>
  initialValues?: any
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({})
})

const formRef = ref()

const form = reactive({
  name: '',
  parentId: 0,
  description: '',
  status: true,
  ...props.initialValues
})

const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 20, message: '部门名称长度在2-20之间', trigger: 'blur' }
  ]
}

// 验证表单
const validateForm = async () => {
  if (formRef.value) {
    return await formRef.value.validate()
  }
  return false
}

// 获取表单数据
const getFormData = () => {
  return form
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 导出方法
defineExpose({
  validateForm,
  getFormData,
  resetForm
})
</script>

<style scoped>
/* 样式将通过Ant Design Vue组件库自动应用 */
</style>