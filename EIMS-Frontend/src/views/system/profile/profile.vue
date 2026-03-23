<template>
  <a-config-provider :locale="zhCN">
    <div class="message-center-container">
      <Header />
      <div class="message-page">
        <a-card class="message-card">
          <div class="card-header">
            <div class="header-right">
            </div>
          </div>
          
          <div class="message-filter" style="overflow-x: auto;">
            <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
              <div style="flex: 2; min-width: 200px;">
                <a-input v-model:value="filterForm.keyword" placeholder="请输入搜索关键词" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1.5; min-width: 200px;">
                <a-range-picker v-model:value="filterForm.dateRange" :placeholder="['开始日期', '结束日期']" format="YYYY年MM月DD日" :locale="zhCN" style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-select v-model:value="filterForm.type" placeholder="全部类型" allow-clear style="width: 100%;">
                  <a-select-option value="">全部类型</a-select-option>
                  <a-select-option value="warning">警告消息</a-select-option>
                  <a-select-option value="error">错误消息</a-select-option>
                  <a-select-option value="info">提醒消息</a-select-option>
                </a-select>
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-select v-model:value="filterForm.status" placeholder="全部状态" allow-clear style="width: 100%;">
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="unread">未读</a-select-option>
                  <a-select-option value="read">已读</a-select-option>
                </a-select>
              </div>
              <div style="flex: 0.5; min-width: 70px;">
                <a-button type="primary" @click="handleSearch" style="width: 100%;">搜索</a-button>
              </div>
              <div style="flex: 0.5; min-width: 70px;">
                <a-button @click="handleReset" style="width: 100%;">重置</a-button>
              </div>
            </div>
          </div>
          
          <div class="message-actions">
            <a-button type="primary" @click="handleMarkAllRead">全部已读</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #52c41a;" @click="handleMarkSelectedRead">标记已读</a-button>
            <a-button type="warning" style="margin-left: 8px; background-color: #fa8c16;" @click="handleMarkSelectedUnread">标记未读</a-button>
            <a-button danger style="margin-left: 8px;" @click="handleDeleteSelected">批量删除</a-button>
          </div>
          
          <div class="message-list">
            <a-table
              :columns="columns"
              :data-source="paginatedMessages"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="false"
              size="small"
              class="message-table"
              row-key="id"
              :scroll="{ x: 800 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === '未读' ? 'orange' : 'green'" :bordered="false" @click="toggleMessageStatus(record)" style="cursor: pointer;">
                    {{ record.status }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'type'">
                  <a-tag :color="getTypeColor(record.type)" :bordered="false">
                    {{ record.type }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'content'">
                  <span class="content-text">{{ record.content }}</span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <div style="display: flex; gap: 8px;">
                    <a-tag color="blue" :bordered="false" @click="handleDetail(record)" style="cursor: pointer;">详情</a-tag>
                    <a-tag color="red" :bordered="false" @click="handleDelete(record.id)" style="cursor: pointer;">删除</a-tag>
                  </div>
                </template>
              </template>
            </a-table>
            
            <a-pagination
              v-model:current="pagination.current"
              v-model:pageSize="pagination.pageSize"
              :total="filteredMessages.length"
              :showSizeChanger="true"
              :pageSizeOptions="PAGE_SIZE_OPTIONS"
              :showTotal="showTotal"
              :showQuickJumper="true"
              class="message-pagination"
              :locale="PAGINATION_LOCALE"
            />
          </div>
        </a-card>
        
        <a-modal
          v-model:open="detailModalVisible"
          title="消息详情"
          width="700px"
          :ok-text="'关闭'"
          :cancel-button-props="{ style: { display: 'none' } }"
          @ok="closeDetailModal"
          @cancel="closeDetailModal"
          class="message-detail-modal"
          :body-style="{ maxHeight: '60vh', overflow: 'auto' }"
          :scrollable="true"
        >
          <div v-if="currentMessage" class="message-detail">
            <div class="detail-header">
              <h3 class="detail-title">{{ currentMessage.title }}</h3>
              <div class="header-right">
                <a-tag :color="currentMessage.status === '未读' ? 'orange' : 'green'" :bordered="false" class="status-tag">
                  {{ currentMessage.status }}
                </a-tag>
              </div>
            </div>
            
            <div class="detail-content">
              <div class="detail-section">
                <h4 class="section-title">基本信息</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <div class="detail-label">消息类型：</div>
                    <div class="detail-value">
                      <a-tag :color="getTypeColor(currentMessage.type)" :bordered="false" class="type-tag">
                        {{ currentMessage.type }}
                      </a-tag>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">发送时间：</div>
                    <div class="detail-value">{{ currentMessage.sendTime }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">消息来源：</div>
                    <div class="detail-value">{{ getSourceText(currentMessage.content) }}</div>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h4 class="section-title">消息内容</h4>
                <div class="detail-content-text">
                  {{ currentMessage.content }}
                </div>
              </div>
            </div>
          </div>
        </a-modal>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, shallowRef } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import Header from '@/components/layout/Header.vue';

interface Message {
  id: string;
  title: string;
  type: string;
  status: string;
  content: string;
  sendTime: string;
}

interface FilterForm {
  type: string;
  status: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  keyword: string;
}

interface Pagination {
  current: number;
  pageSize: number;
}

const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;

const PAGINATION_LOCALE = {
  items_per_page: '条/页',
  jump_to: '前往',
  page: '页',
  prev_page: '上一页',
  next_page: '下一页',
  prev_5: '向前 5 页',
  next_5: '向后 5 页',
  prev_3: '向前 3 页',
  next_3: '向后 3 页',
  first_page: '首页',
  last_page: '末页'
} as const;

const TYPE_MAP: Record<string, string> = {
  'warning': '警告消息',
  'error': '错误消息',
  'info': '提醒消息'
} as const;

const STATUS_MAP: Record<string, string> = {
  'unread': '未读',
  'read': '已读'
} as const;

const TYPE_COLORS: Record<string, string> = {
  '警告消息': 'orange',
  '错误消息': 'red',
  '提醒消息': 'blue'
} as const;

const MOCK_TYPES = shallowRef(['提醒消息', '警告消息', '错误消息']);
const MOCK_STATUSES = shallowRef(['未读', '已读']);
const MOCK_MODULES = shallowRef(['系统', '任务', '数据', '权限', '用户', '组织', '配置', '日志']);
const MOCK_TITLES = shallowRef(['系统通知', '任务提醒', '错误提示', '数据更新', '权限变更', '用户操作', '组织变更', '配置更新', '日志记录']);

const allMessages = ref<Message[]>([]);
const selectedRowKeys = ref<(string | number)[]>([]);
const detailModalVisible = ref(false);
const currentMessage = ref<Message | null>(null);

const filterForm = reactive<FilterForm>({
  type: '',
  status: '',
  dateRange: null,
  keyword: ''
});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10
});

const columns = shallowRef([
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 180
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    width: 300
  },
  {
    title: '发送时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    width: 140
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right'
  }
]);

const filteredMessages = computed(() => {
  let result = [...allMessages.value];
  
  if (filterForm.type) {
    const targetType = TYPE_MAP[filterForm.type];
    result = result.filter(msg => msg.type === targetType);
  }
  
  if (filterForm.status) {
    const targetStatus = STATUS_MAP[filterForm.status];
    result = result.filter(msg => msg.status === targetStatus);
  }
  
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const startDate = dayjs(filterForm.dateRange[0]);
    const endDate = dayjs(filterForm.dateRange[1]);
    result = result.filter(msg => {
      const messageDate = dayjs(msg.sendTime.split(' ')[0]);
      return messageDate.isAfter(startDate.subtract(1, 'day')) && messageDate.isBefore(endDate.add(1, 'day'));
    });
  }
  
  if (filterForm.keyword) {
    const keyword = filterForm.keyword.toLowerCase();
    result = result.filter(msg => 
      msg.title.toLowerCase().includes(keyword) || 
      msg.content.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

const paginatedMessages = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredMessages.value.slice(start, end);
});

const generateMockMessages = (): Message[] => {
  const messages: Message[] = [];
  
  for (let i = 1; i <= 75; i++) {
    const type = MOCK_TYPES.value[Math.floor(Math.random() * MOCK_TYPES.value.length)];
    const status = MOCK_STATUSES.value[Math.floor(Math.random() * MOCK_STATUSES.value.length)];
    const module = MOCK_MODULES.value[Math.floor(Math.random() * MOCK_MODULES.value.length)];
    const title = MOCK_TITLES.value[Math.floor(Math.random() * MOCK_TITLES.value.length)];
    const content = `${title}，来自${module}模块，这是第${i}条消息`;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const sendTime = date.toISOString().replace('T', ' ').substring(0, 19);
    
    messages.push({
      id: i.toString(),
      title,
      type,
      status,
      content,
      sendTime
    });
  }
  
  return messages;
};

const fetchMessages = async () => {
  try {
    allMessages.value = generateMockMessages();
  } catch (error) {
    message.error('获取消息列表失败');
    console.error('Error fetching messages:', error);
  }
};

const showTotal = (total: number) => `共 ${total} 条记录`;

const handleSearch = async () => {
  pagination.current = 1;
  message.success(`搜索完成，共找到 ${filteredMessages.value.length} 条消息`);
};

const handleReset = async () => {
  Object.assign(filterForm, {
    type: '',
    status: '',
    dateRange: null,
    keyword: ''
  });
  pagination.current = 1;
  message.success('表单已重置，消息列表已恢复');
};

const onSelectChange = (keys: (string | number)[]) => {
  selectedRowKeys.value = keys;
};

const handleDetail = (record: Message) => {
  currentMessage.value = record;
  detailModalVisible.value = true;
};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  currentMessage.value = null;
};

const handleDelete = async (id: string) => {
  try {
    const index = allMessages.value.findIndex(msg => msg.id === id);
    if (index !== -1) {
      allMessages.value.splice(index, 1);
      message.success(`删除消息 ID: ${id}`);
    }
  } catch (error) {
    message.error('删除消息失败');
    console.error('Error deleting message:', error);
  }
};

const handleMarkAllRead = async () => {
  try {
    allMessages.value.forEach(msg => {
      msg.status = '已读';
    });
    selectedRowKeys.value = [];
    message.success('所有消息已标记为已读');
  } catch (error) {
    message.error('标记消息失败');
    console.error('Error marking messages as read:', error);
  }
};

const handleMarkSelectedRead = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要标记的消息');
    return;
  }
  
  const selectedCount = selectedRowKeys.value.length;
  
  try {
    allMessages.value.forEach(msg => {
      if (selectedRowKeys.value.includes(msg.id)) {
        msg.status = '已读';
      }
    });
    selectedRowKeys.value = [];
    message.success(`标记 ${selectedCount} 条消息为已读`);
  } catch (error) {
    message.error('标记消息失败');
    console.error('Error marking messages as read:', error);
  }
};

const handleMarkSelectedUnread = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要标记的消息');
    return;
  }
  
  const selectedCount = selectedRowKeys.value.length;
  
  try {
    allMessages.value.forEach(msg => {
      if (selectedRowKeys.value.includes(msg.id)) {
        msg.status = '未读';
      }
    });
    selectedRowKeys.value = [];
    message.success(`标记 ${selectedCount} 条消息为未读`);
  } catch (error) {
    message.error('标记消息失败');
    console.error('Error marking messages as unread:', error);
  }
};

const handleDeleteSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的消息');
    return;
  }
  
  const deleteCount = selectedRowKeys.value.length;
  
  try {
    allMessages.value = allMessages.value.filter(msg => !selectedRowKeys.value.includes(msg.id));
    selectedRowKeys.value = [];
    message.success(`删除 ${deleteCount} 条消息`);
  } catch (error) {
    message.error('删除消息失败');
    console.error('Error deleting messages:', error);
  }
};

const getTypeColor = (type: string) => {
  return TYPE_COLORS[type] || 'default';
};

const getSourceText = (content: string) => {
  const match = content.match(/来自(\w+)模块/);
  return match ? match[1] : '未知';
};

const toggleMessageStatus = async (record: Message) => {
  try {
    const newStatus = record.status === '未读' ? '已读' : '未读';
    const msg = allMessages.value.find(m => m.id === record.id);
    if (msg) {
      msg.status = newStatus;
    }
    message.success(`消息状态已切换为${newStatus}`);
  } catch (error) {
    message.error('切换消息状态失败');
    console.error('Error toggling message status:', error);
  }
};

onMounted(() => {
  fetchMessages();
});
</script>

<style scoped>
.message-center-container {
  width: 100%;
  padding: 1.5%;
}

.message-page {
  padding: 24px;
  min-height: calc(100vh - 64px);
  margin-top: 64px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.message-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.message-filter :deep(.ant-form-inline) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.message-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.message-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.message-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.content-text {
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666;
}

.message-list {
  position: relative;
}

.message-table {
  border-radius: 4px;
}

.message-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.message-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.message-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.message-detail-modal {
  border-radius: 8px;
}

.message-detail {
  padding: 20px 0;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
  margin: 0;
}

.status-tag {
  font-size: 14px;
  padding: 4px 12px;
}

.detail-content {
  margin-bottom: 20px;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding: 10px 16px;
  background-color: #f5f5f5;
  border-left: 4px solid #1890ff;
  border-radius: 4px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-right: 12px;
  min-width: 100px;
}

.detail-value {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.detail-content-text {
  font-size: 14px;
  color: #333;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  min-height: 120px;
  line-height: 1.5;
}

.type-tag {
  font-size: 12px;
  padding: 2px 8px;
}

@media (max-width: 1200px) {
  .message-page {
    padding: 20px;
  }
}

@media (max-width: 992px) {
  .message-page {
    padding: 16px;
  }
  
  .message-filter :deep(.ant-form-inline) {
    grid-template-columns: 1fr;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .message-page {
    padding: 12px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .message-filter {
    padding: 12px;
  }
  
  .message-actions {
    flex-direction: column;
  }
  
  .message-actions :deep(.ant-btn) {
    width: 100%;
    margin-left: 0 !important;
  }
}

@media (max-width: 576px) {
  .message-detail-modal {
    width: 90% !important;
  }
  
  .detail-title {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 14px;
  }
  
  .detail-value {
    font-size: 13px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-label {
    margin-bottom: 6px;
    margin-right: 0;
  }
}
</style>
