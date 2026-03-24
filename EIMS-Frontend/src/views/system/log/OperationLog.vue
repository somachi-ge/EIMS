<template>
  <div class="operation-log-container">
      <a-config-provider :locale="zhCN">
        <div class="operation-log-page">
        <a-card class="operation-log-card">
          <div class="operation-log-filter" style="overflow-x: auto;">
            <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
              <div style="flex: 1.5; min-width: 200px;">
                <a-input v-model:value="filterForm.keyword" placeholder="请输入搜索关键词" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1.2; min-width: 180px;">
                <a-range-picker v-model:value="filterForm.dateRange" :placeholder="['开始日期', '结束日期']" format="YYYY年MM月DD日" style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-select v-model:value="filterForm.status" placeholder="全部状态" allow-clear style="width: 100%;">
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="success">成功</a-select-option>
                  <a-select-option value="failed">失败</a-select-option>
                </a-select>
              </div>
              <div style="flex: 0.4; min-width: 70px;">
                <a-button type="primary" @click="handleSearch" style="width: 100%;">搜索</a-button>
              </div>
              <div style="flex: 0.4; min-width: 70px;">
                <a-button @click="handleReset" style="width: 100%;">重置</a-button>
              </div>
            </div>
          </div>
          
          <div class="operation-log-actions">
            <a-button type="primary" @click="handleExport">导出日志</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f; color: white;" @click="handleDeleteSelected">批量删除</a-button>
          </div>
          
          <div class="operation-log-table-container">
            <a-table
              :columns="columns"
              :data-source="paginatedLogs"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectChange }"
              :pagination="false"
              size="small"
              class="operation-log-table"
              row-key="id"
              :scroll="{ x: 1200 }"
              :loading="loading"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === 'success' ? 'green' : 'red'" :bordered="false">
                    {{ record.status === 'success' ? '成功' : '失败' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <span class="action-text">{{ record.action }}</span>
                </template>
                <template v-else-if="column.key === 'operate'">
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
              :total="filteredLogs.length"
              :showSizeChanger="true"
              :pageSizeOptions="pageSizeOptions"
              :showTotal="showTotal"
              :showQuickJumper="true"
              class="operation-log-pagination"
            />
          </div>
        </a-card>
        
        <a-modal
          v-model:open="detailModalVisible"
          title="操作日志详情"
          width="700px"
          :ok-text="'关闭'"
          :cancel-text="'取消'"
          @ok="closeDetailModal"
          @cancel="closeDetailModal"
          class="operation-log-detail-modal"
          :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
        >
          <div v-if="currentLog" class="operation-log-detail">
            <div class="detail-header">
              <h3 class="detail-title">{{ currentLog.action }}</h3>
              <div class="header-right">
                <a-tag :color="currentLog.status === 'success' ? 'green' : 'red'" :bordered="false" class="status-tag">
                  {{ currentLog.status === 'success' ? '成功' : '失败' }}
                </a-tag>
              </div>
            </div>
            
            <div class="detail-content">
              <div class="detail-section">
                <h4 class="section-title">基本信息</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <div class="detail-label">操作人：</div>
                    <div class="detail-value">{{ currentLog.user }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">操作状态：</div>
                    <div class="detail-value">
                      <a-tag :color="currentLog.status === 'success' ? 'green' : 'red'" :bordered="false" class="status-tag">
                        {{ currentLog.status === 'success' ? '成功' : '失败' }}
                      </a-tag>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">操作时间：</div>
                    <div class="detail-value">{{ currentLog.created_at }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">IP地址：</div>
                    <div class="detail-value">{{ currentLog.ip }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">MAC地址：</div>
                    <div class="detail-value">{{ currentLog.mac }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">用户代理：</div>
                    <div class="detail-value">{{ currentLog.userAgent }}</div>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h4 class="section-title">详细内容</h4>
                <div class="detail-content-text">
                  <pre>{{ JSON.stringify(currentLog.details, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </a-modal>
        </div>
      </a-config-provider>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, shallowRef } from 'vue';
import { message } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

interface Log {
  id: number;
  user: string;
  action: string;
  ip: string;
  mac: string;
  userAgent: string;
  status: string;
  created_at: string;
  module: string;
  details: {
    module: string;
    parameters: any;
    result: string;
    error: string | null;
    duration: number;
  };
}

interface FilterForm {
  keyword: string;
  dateRange: any;
  status: string;
}

interface Pagination {
  current: number;
  pageSize: number;
}

const pageSizeOptions = ['10', '30', '50'] as const;

// 生成随机MAC地址
const generateRandomMacAddress = (): string => {
  const chars = '0123456789ABCDEF';
  let mac = '';
  for (let i = 0; i < 6; i++) {
    mac += chars.charAt(Math.floor(Math.random() * 16));
    mac += chars.charAt(Math.floor(Math.random() * 16));
    if (i < 5) mac += ':';
  }
  return mac;
};

// 生成随机操作日志数据
const generateRandomLogs = (): Log[] => {
  const users = ['admin', 'user1', 'user2', 'manager', 'operator'];
  const ipPrefixes = ['192.168.1.', '10.0.0.', '172.16.0.'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
  ];
  const modules = ['system', 'user', 'role', 'permission', 'log', 'dashboard', 'settings', 'report', 'task', 'api'];
  const actions = [
    '登录系统', '退出系统', '创建用户', '修改用户', '删除用户', '创建角色', '修改角色', '删除角色',
    '分配权限', '修改权限', '更新系统设置', '导出数据', '导入数据', '修改密码', '重置密码',
    '创建部门', '修改部门', '删除部门', '创建项目', '修改项目', '删除项目', '上传文件', '下载文件'
  ];
  const logs: Log[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const ip = `${ipPrefixes[Math.floor(Math.random() * ipPrefixes.length)]}${Math.floor(Math.random() * 255)}`;
    const mac = generateRandomMacAddress();
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    const status = Math.random() > 0.1 ? 'success' : 'failed'; // 90% 成功率
    
    // 生成随机时间（最近6个月内）
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 180); // 6个月 = 180天
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    
    const date = new Date(now);
    date.setDate(now.getDate() - randomDays);
    date.setHours(randomHours);
    date.setMinutes(randomMinutes);
    date.setSeconds(randomSeconds);
    
    const formattedDate = date.toISOString().slice(0, 10);
    const formattedTime = `${randomHours.toString().padStart(2, '0')}:${randomMinutes.toString().padStart(2, '0')}:${randomSeconds.toString().padStart(2, '0')}`;
    const created_at = `${formattedDate} ${formattedTime}`;
    
    logs.push({
      id: i,
      user: user,
      action: action,
      ip: ip,
      mac: mac,
      userAgent: userAgent,
      status: status,
      created_at: created_at,
      module: module,
      details: {
        module: module,
        parameters: getParametersByAction(action, i),
        result: status === 'success' ? '成功' : '失败',
        error: status === 'failed' ? '操作失败：' + getErrorMessage() : null,
        duration: Math.floor(Math.random() * 1000) + 100 // 操作持续时间（毫秒）
      }
    });
  }
  
  // 根据操作类型生成参数
  function getParametersByAction(action: string, id: number) {
    if (action.includes('用户')) {
      return { userId: id, username: `user${id}`, roleId: Math.floor(Math.random() * 10) + 1 };
    } else if (action.includes('角色')) {
      return { roleId: id, roleName: `role${id}`, permissionIds: [1, 2, 3] };
    } else if (action.includes('权限')) {
      return { permissionId: id, permissionName: `permission${id}`, resource: '/api/v1/users' };
    } else if (action.includes('登录')) {
      return { username: `user${Math.floor(Math.random() * 100)}`, loginType: ['web', 'mobile', 'api'][Math.floor(Math.random() * 3)] };
    } else if (action.includes('导出')) {
      return { exportType: ['excel', 'pdf', 'csv'][Math.floor(Math.random() * 3)], recordCount: Math.floor(Math.random() * 1000) + 1 };
    } else if (action.includes('部门')) {
      return { departmentId: id, departmentName: `department${id}`, parentId: Math.floor(Math.random() * id) };
    } else if (action.includes('项目')) {
      return { projectId: id, projectName: `project${id}`, status: ['active', 'completed', 'cancelled'][Math.floor(Math.random() * 3)] };
    } else {
      return { id: id, timestamp: new Date().toISOString() };
    }
  }
  
  // 生成错误信息
  function getErrorMessage() {
    const errorMessages = [
      '权限不足，无法执行此操作',
      '操作超时，请稍后重试',
      '参数错误，请检查输入',
      '系统繁忙，请稍后再试',
      '数据冲突，操作失败',
      '网络连接失败，请检查网络',
      '资源不存在，操作失败',
      '服务器内部错误，请联系管理员'
    ];
    return errorMessages[Math.floor(Math.random() * errorMessages.length)];
  }
  
  return logs;
};

const loading = ref(false);
const originalLogs = ref<Log[]>(generateRandomLogs());
const selectedRowKeys = ref<(string | number)[]>([]);
const detailModalVisible = ref(false);
const currentLog = ref<Log | null>(null);

const filterForm = reactive<FilterForm>({
  keyword: '',
  dateRange: null,
  status: ''
});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10
});

const columns = shallowRef([
  {
    title: '操作人',
    dataIndex: 'user',
    key: 'user',
    width: 100
  },
  {
    title: '操作内容',
    dataIndex: 'action',
    key: 'action',
    width: 250
  },
  {
    title: '操作模块',
    dataIndex: 'module',
    key: 'module',
    width: 120
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 120
  },
  {
    title: 'MAC地址',
    dataIndex: 'mac',
    key: 'mac',
    width: 160
  },
  {
    title: '状态',
    key: 'status',
    width: 80
  },
  {
    title: '操作时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 160
  },
  {
    title: '操作',
    key: 'operate',
    width: 120,
    fixed: 'right'
  }
]);

const filteredLogs = computed(() => {
  let result = [...originalLogs.value];
  
  if (filterForm.keyword) {
    const lowerKeyword = filterForm.keyword.toLowerCase();
    result = result.filter(log => 
      log.action.toLowerCase().includes(lowerKeyword) ||
      log.user.toLowerCase().includes(lowerKeyword) ||
      log.ip.includes(filterForm.keyword)
    );
  }
  
  if (filterForm.status) {
    result = result.filter(log => log.status === filterForm.status);
  }
  
  return result;
});

const paginatedLogs = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredLogs.value.slice(start, end);
});

const showTotal = (total: number) => `共 ${total} 条记录`;

const handleSearch = () => {
  pagination.current = 1;
  message.success(`搜索完成，共找到 ${filteredLogs.value.length} 条操作日志`);
};

const handleReset = () => {
  Object.assign(filterForm, {
    keyword: '',
    dateRange: null,
    status: ''
  });
  pagination.current = 1;
  message.success('表单已重置，操作日志列表已恢复');
};

const handleSelectChange = (keys: (string | number)[]) => {
  selectedRowKeys.value = keys;
};

const handleDetail = (record: Log) => {
  currentLog.value = record;
  detailModalVisible.value = true;
};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  currentLog.value = null;
};

const handleDelete = async (id: number) => {
  try {
    loading.value = true;
    originalLogs.value = originalLogs.value.filter(log => log.id !== id);
    message.success(`删除操作日志 ID: ${id}`);
  } catch (error) {
    console.error('删除操作日志失败:', error);
    message.error('删除操作日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handleExport = async () => {
  try {
    loading.value = true;
    message.success('操作日志导出成功');
  } catch (error) {
    console.error('导出操作日志失败:', error);
    message.error('导出操作日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handleDeleteSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的操作日志');
    return;
  }
  
  const deleteCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      originalLogs.value = originalLogs.value.filter(log => log.id !== id);
    }
    
    selectedRowKeys.value = [];
    message.success(`删除 ${deleteCount} 条操作日志`);
  } catch (error) {
    console.error('批量删除操作日志失败:', error);
    message.error('批量删除操作日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 初始化完成
});
</script>

<style scoped>
.operation-log-container {
  width: 100%;
  padding: 1.5%;
}

.operation-log-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.operation-log-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.operation-log-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.operation-log-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.operation-log-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.operation-log-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.operation-log-table {
  border-radius: 4px;
}

.operation-log-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.operation-log-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.operation-log-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.operation-log-detail-modal {
  border-radius: 8px;
}

.operation-log-detail {
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
  grid-template-columns: repeat(2, 1fr);
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

.detail-content-text pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.action-text {
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

@media (max-width: 1200px) {
  .operation-log-page {
    padding: 20px;
  }
  
  .operation-log-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .operation-log-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .operation-log-page {
    padding: 12px;
  }
  
  .operation-log-filter {
    padding: 12px;
  }
  
  .operation-log-actions {
    flex-direction: column;
  }
  
  .operation-log-actions :deep(.ant-btn) {
    width: 100%;
    margin-left: 0 !important;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 576px) {
  .operation-log-page {
    padding: 12px;
  }
  
  .operation-log-pagination {
    justify-content: center;
  }
  
  .operation-log-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .operation-log-detail-modal {
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