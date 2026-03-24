<template>
  <a-form
    :model="form"
    :rules="rules"
    ref="formRef"
    layout="vertical"
  >
    <a-form-item label="用户名" name="username">
      <a-input v-model:value="form.username" placeholder="请输入用户名" />
    </a-form-item>
    <a-form-item label="密码" name="password" v-if="isAdd">
      <a-input-password v-model:value="form.password" placeholder="请输入密码" />
    </a-form-item>
    <a-form-item label="姓名" name="name">
      <a-input v-model:value="form.name" placeholder="请输入姓名" />
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="form.email" placeholder="请输入邮箱" />
    </a-form-item>
    <a-form-item label="电话" name="phone">
      <a-input v-model:value="form.phone" placeholder="请输入电话" />
    </a-form-item>

    <a-form-item label="角色" name="roleIds">
      <a-select v-model:value="form.roleIds" mode="multiple" placeholder="请选择角色">
        <a-select-option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-switch v-model:checked="form.status" />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Props {
  isAdd: boolean
  roles: Array<{ id: number; name: string }>
  initialValues?: any
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({})
})

const formRef = ref()

const form = reactive({
  username: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  roleIds: [],
  status: true,
  ...props.initialValues
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20之间', trigger: 'blur' }
  ],
  password: [
    { required: props.isAdd, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
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