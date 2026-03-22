<template>
  <AppLayout>
    <div class="user-detail-page">
      <a-card title="用户详情">
        <div class="card-content">
          <a-descriptions column={2} bordered>
            <a-descriptions-item label="用户名">admin</a-descriptions-item>
            <a-descriptions-item label="姓名">管理员</a-descriptions-item>
            <a-descriptions-item label="邮箱">admin@example.com</a-descriptions-item>
            <a-descriptions-item label="电话">13800138000</a-descriptions-item>
            <a-descriptions-item label="部门">技术部</a-descriptions-item>
            <a-descriptions-item label="角色">管理员</a-descriptions-item>
            <a-descriptions-item label="状态">
              <a-tag color="green">启用</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">2024-01-01 00:00:00</a-descriptions-item>
          </a-descriptions>
          <div class="detail-actions">
            <a-button @click="handleEdit">编辑</a-button>
            <a-button @click="handleBack">返回</a-button>
          </div>
        </div>
      </a-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '../../../components/layout/AppLayout.vue'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  // 获取用户ID
  const id = route.params.id
  // 根据ID获取用户详情
  console.log('获取用户详情', id)
})

const handleEdit = () => {
  // 跳转到编辑页面
  const id = route.params.id
  router.push(`/system/user/edit/${id}`)
}

const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.user-detail-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.detail-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>