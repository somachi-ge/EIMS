<template>
  <AppLayout>
    <div class="user-add-page">
      <a-card title="添加用户">
        <div class="card-content">
          <UserForm
            :is-add="true"
            :departments="departments"
            :roles="roles"
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../../../components/layout/AppLayout.vue'
import UserForm from '../../../components/system/UserForm.vue'

const router = useRouter()

const departments = reactive([
  { id: 1, name: '技术部' },
  { id: 2, name: '市场部' },
  { id: 3, name: '销售部' }
])

const roles = reactive([
  { id: 1, name: '管理员' },
  { id: 2, name: '普通用户' }
])

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
.user-add-page {
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