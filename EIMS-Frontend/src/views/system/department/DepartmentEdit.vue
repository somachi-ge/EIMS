<template>
  <AppLayout>
    <div class="department-edit-page">
      <a-card title="编辑部门">
        <div class="card-content">
          <DepartmentForm
            :departments="departments"
            :initial-values="departmentInfo"
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '../../../components/layout/AppLayout.vue'
import DepartmentForm from '../../../components/system/DepartmentForm.vue'

const router = useRouter()
const route = useRoute()

const departmentInfo = ref({
  id: 1,
  name: '技术部',
  parentId: 0,
  description: '技术开发部门',
  status: true
})

const departments = reactive([
  { id: 1, name: '技术部' },
  { id: 2, name: '市场部' },
  { id: 3, name: '销售部' }
])

onMounted(() => {
  // 获取部门ID
  const id = route.params.id
  // 根据ID获取部门信息
  console.log('获取部门信息', id)
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
.department-edit-page {
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