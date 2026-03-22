<template>
  <AppLayout>
    <div class="system-notification-page">
      <a-card title="系统通知">
        <div class="card-content">
          <div class="notification-actions">
            <a-button type="primary" @click="handleAdd">添加通知</a-button>
            <a-button @click="handleBatchDelete">批量删除</a-button>
          </div>
          <TablePagination
            :columns="columns"
            :data="notificationList"
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

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const notificationList = reactive([
  { id: 1, title: '系统更新通知', content: '系统将于今晚进行更新维护', createTime: '2024-01-01 00:00:00', status: '已发布' },
  { id: 2, title: '安全提醒', content: '请及时修改密码', createTime: '2024-01-02 00:00:00', status: '已发布' },
  { id: 3, title: '新功能上线', content: '新增用户管理功能', createTime: '2024-01-03 00:00:00', status: '已发布' }
])

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', slots: { customRender: 'action' } }
]

const handleAdd = () => {
  // 跳转到添加通知页面
  console.log('添加通知')
}

const handleBatchDelete = () => {
  // 批量删除通知
  console.log('批量删除通知')
}

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  // 重新获取数据
  console.log('分页变化', page, size)
}
</script>

<style scoped>
.system-notification-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.notification-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>