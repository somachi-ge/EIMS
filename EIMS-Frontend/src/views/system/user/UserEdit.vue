<template>
  <AppLayout>
    <div class="user-edit-page">
      <a-card title="编辑用户">
        <div class="card-content">
          <UserForm
            :is-add="false"
            :departments="departments"
            :roles="roles"
            :initial-values="userInfo"
          />
          <div class="form-actions">
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleSubmit">提交</a-button>
          </div>
        </div>
      </a-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '../../../components/layout/AppLayout.vue'
import UserForm from '../../../components/system/UserForm.vue'

const router = useRouter()
const route = useRoute()

const userInfo = ref({
  id: 1,
  username: 'admin',
  name: '管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  departmentId: 1,
  roleIds: [1],
  status: true
})

const departments = reactive([
  { id: 1, name: '技术部' },
  { id: 2, name: '市场部' },
  { id: 3, name: '销售部' }
])

const roles = reactive([
  { id: 1, name: '管理员' },
  { id: 2, name: '普通用户' }
])

onMounted(() => {
  // 获取用户ID
  const id = route.params.id
  // 根据ID获取用户信息
  console.log('获取用户信息', id)
})

const handleCancel = () => {
  router.back()
}

const handleSubmit = () => {
  // 提交表单
  console.log('提交表单')
  router.back()
}
</script>

<style scoped>
.user-edit-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>