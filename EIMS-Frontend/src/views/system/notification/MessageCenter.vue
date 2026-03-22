<template>
  <AppLayout>
    <div class="message-center-page">
      <a-card title="消息中心">
        <div class="card-content">
          <div class="message-actions">
            <a-button @click="handleMarkAllRead">全部标记为已读</a-button>
            <a-button @click="handleDeleteAll">清空消息</a-button>
          </div>
          <TablePagination
            :columns="columns"
            :data="messageList"
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

const messageList = reactive([
  { id: 1, title: '系统更新通知', content: '系统将于今晚进行更新维护', time: '2024-01-01 00:00:00', status: '未读' },
  { id: 2, title: '安全提醒', content: '请及时修改密码', time: '2024-01-02 00:00:00', status: '已读' },
  { id: 3, title: '新功能上线', content: '新增用户管理功能', time: '2024-01-03 00:00:00', status: '已读' }
])

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', slots: { customRender: 'action' } }
]

const handleMarkAllRead = () => {
  // 全部标记为已读
  console.log('全部标记为已读')
}

const handleDeleteAll = () => {
  // 清空消息
  console.log('清空消息')
}

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  // 重新获取数据
  console.log('分页变化', page, size)
}
</script>

<style scoped>
.message-center-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.message-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>