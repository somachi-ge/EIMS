<template>
  <AppLayout>
    <div class="role-edit-page">
      <a-card title="编辑角色">
        <div class="card-content">
          <RoleForm :initial-values="roleInfo" />
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '../../../components/layout/AppLayout.vue'
import RoleForm from '../../../components/system/RoleForm.vue'

const router = useRouter()
const route = useRoute()

const roleInfo = ref({
  id: 1,
  name: '管理员',
  description: '系统管理员',
  status: true
})

onMounted(() => {
  // 获取角色ID
  const id = route.params.id
  // 根据ID获取角色信息
  console.log('获取角色信息', id)
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
.role-edit-page {
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