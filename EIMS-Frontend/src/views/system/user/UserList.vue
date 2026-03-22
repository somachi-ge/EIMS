<template>
  <AppLayout>
    <div class="user-list-page">
      <a-card title="用户管理">
        <div class="card-content">
          <div class="search-bar">
            <a-input v-model:value="searchText" placeholder="搜索用户" style="width: 200px; margin-right: 10px" />
            <a-button type="primary" @click="handleAdd">添加用户</a-button>
          </div>
          <TablePagination
            :columns="columns"
            :data="userList"
            :loading="loading"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @pageChange="handlePageChange"
          />
        </div>
      </a-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import AppLayout from '../../../components/layout/AppLayout.vue'
import TablePagination from '../../../components/common/TablePagination.vue'

const searchText = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const userList = reactive([
  { id: 1, username: 'admin', name: '管理员', email: 'admin@example.com', phone: '13800138000', department: '技术部', status: true },
  { id: 2, username: 'user1', name: '用户1', email: 'user1@example.com', phone: '13800138001', department: '市场部', status: true },
  { id: 3, username: 'user2', name: '用户2', email: 'user2@example.com', phone: '13800138002', department: '销售部', status: false }
])

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '电话', dataIndex: 'phone', key: 'phone' },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '状态', dataIndex: 'status', key: 'status', slots: { customRender: 'status' } },
  { title: '操作', key: 'action', slots: { customRender: 'action' } }
]

const handleAdd = () => {
  // 跳转到添加用户页面
  console.log('添加用户')
}

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  // 重新获取数据
  console.log('分页变化', page, size)
}
</script>

<style scoped>
.user-list-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
</style>