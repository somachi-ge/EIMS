<template>
  <AppLayout>
    <div class="permission-assign-page">
      <a-card title="权限分配">
        <div class="card-content">
          <div class="role-info">
            <h3>角色：管理员</h3>
          </div>
          <PermissionTree
            :tree-data="permissionTree"
            :checked-keys="checkedKeys"
            @update:checkedKeys="handleCheckedKeysChange"
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
import PermissionTree from '../../../components/system/PermissionTree.vue'

const router = useRouter()
const route = useRoute()

const checkedKeys = ref<string[]>(['1', '1-1', '1-2'])

const permissionTree = reactive([
  {
    title: '系统管理',
    key: '1',
    children: [
      { title: '用户管理', key: '1-1' },
      { title: '角色管理', key: '1-2' },
      { title: '部门管理', key: '1-3' },
      { title: '系统配置', key: '1-4' }
    ]
  },
  {
    title: '应用管理',
    key: '2',
    children: [
      { title: '应用列表', key: '2-1' },
      { title: '应用配置', key: '2-2' }
    ]
  },
  {
    title: '平台管理',
    key: '3',
    children: [
      { title: '平台设置', key: '3-1' },
      { title: '监控中心', key: '3-2' }
    ]
  }
])

onMounted(() => {
  // 获取角色ID
  const id = route.params.id
  // 根据ID获取角色权限
  console.log('获取角色权限', id)
})

const handleCheckedKeysChange = (keys: string[]) => {
  checkedKeys.value = keys
  console.log('权限变化', keys)
}

const handleCancel = () => {
  router.back()
}

const handleSubmit = () => {
  // 提交权限
  console.log('提交权限', checkedKeys.value)
  router.back()
}
</script>

<style scoped>
.permission-assign-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.role-info {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>