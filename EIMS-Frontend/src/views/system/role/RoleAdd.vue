<template>
  <AppLayout>
    <div class="role-add-page">
      <a-card title="添加角色">
        <div class="card-content">
          <RoleForm />
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
import { useRouter } from 'vue-router'
import AppLayout from '../../../components/layout/AppLayout.vue'
import RoleForm from '../../../components/system/RoleForm.vue'

const router = useRouter()

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
.role-add-page {
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