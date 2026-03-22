<template>
  <AppLayout>
    <div class="role-list-page">
      <a-card title="角色管理">
        <div class="card-content">
          <div class="search-bar">
            <a-input v-model:value="searchText" placeholder="搜索角色" style="width: 200px; margin-right: 10px" />
            <a-button type="primary" @click="handleAdd">添加角色</a-button>
          </div>
          <TablePagination
            :columns="columns"
            :data="roleList"
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

const roleList = reactive([
  { id: 1, name: '管理员', description: '系统管理员', status: true },
  { id: 2, name: '普通用户', description: '普通用户', status: true },
  { id: 3, name: '访客', description: '访客权限', status: false }
])

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '状态', dataIndex: 'status', key: 'status', slots: { customRender: 'status' } },
  { title: '操作', key: 'action', slots: { customRender: 'action' } }
]

const handleAdd = () => {
  // 跳转到添加角色页面
  console.log('添加角色')
}

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  // 重新获取数据
  console.log('分页变化', page, size)
}
</script>

<style scoped>
.role-list-page {
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