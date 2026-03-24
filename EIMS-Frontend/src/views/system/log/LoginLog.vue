<template>
  <div class="login-log-container">
      <a-config-provider :locale="zhCN">
        <div class="login-log-page">
        <a-card class="login-log-card">
          <div class="login-log-filter" style="overflow-x: auto;">
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
          
          <div class="login-log-actions">
            <a-button type="primary" @click="handleExport">导出日志</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f; color: white;" @click="handleDeleteSelected">批量删除</a-button>
          </div>
          
          <div class="login-log-table-container">
            <a-table
              :columns="columns"
              :data-source="paginatedLogs"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectChange }"
              :pagination="false"
              size="small"
              class="login-log-table"
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
              class="login-log-pagination"
            />
          </div>
        </a-card>
        
        <a-modal
          v-model:open="detailModalVisible"
          title="登录日志详情"
          width="700px"
          :ok-text="'关闭'"
          :cancel-text="'取消'"
          @ok="closeDetailModal"
          @cancel="closeDetailModal"
          class="login-log-detail-modal"
          :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
        >
          <div v-if="currentLog" class="login-log-detail">
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
                    <div class="detail-label">登录用户：</div>
                    <div class="detail-value">{{ currentLog.user }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">登录状态：</div>
                    <div class="detail-value">
                      <a-tag :color="currentLog.status === 'success' ? 'green' : 'red'" :bordered="false" class="status-tag">
                        {{ currentLog.status === 'success' ? '成功' : '失败' }}
                      </a-tag>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">登录时间：</div>
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
                    <div class="detail-label">登录方式：</div>
                    <div class="detail-value">{{ currentLog.loginType }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">登录设备：</div>
                    <div class="detail-value">{{ currentLog.device }}</div>
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
  loginType: string;
  device: string;
  details: {
    loginType: string;
    device: string;
    ip: string;
    location: string;
    browser: string;
    os: string;
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

// 生成随机登录日志数据
const generateRandomLogs = (): Log[] => {
  const users = ['admin', 'user1', 'user2', 'manager', 'operator', 'guest'];
  const ipPrefixes = ['192.168.1.', '10.0.0.', '172.16.0.'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
  ];
  const loginTypes = ['web', 'mobile', 'api', 'sso'];
  const devices = ['Windows PC', 'MacBook', 'iPhone', 'Android Phone', 'iPad', 'Linux PC'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
  const os = ['Windows 10', 'Windows 11', 'macOS Big Sur', 'iOS 14', 'Android 10', 'Ubuntu 20.04'];
  const locations = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '天津'];
  const actions = [
    '登录系统', '退出系统', '登录失败', '密码错误', '账户锁定', '会话超时', '重新登录', '强制登出'
  ];
  const logs: Log[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const ip = `${ipPrefixes[Math.floor(Math.random() * ipPrefixes.length)]}${Math.floor(Math.random() * 255)}`;
    const mac = generateRandomMacAddress();
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const loginType = loginTypes[Math.floor(Math.random() * loginTypes.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const status = action.includes('失败') || action.includes('错误') || action.includes('锁定') ? 'failed' : 'success';
    
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
      loginType: loginType,
      device: device,
      details: {
        loginType: loginType,
        device: device,
        ip: ip,
        location: locations[Math.floor(Math.random() * locations.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: os[Math.floor(Math.random() * os.length)],
        result: status === 'success' ? '成功' : '失败',
        error: status === 'failed' ? '登录失败：' + getErrorMessage() : null,
        duration: Math.floor(Math.random() * 1000) + 100 // 登录持续时间（毫秒）
      }
    });
  }
  
  // 生成错误信息
  function getErrorMessage() {
    const errorMessages = [
      '用户名或密码错误',
      '账户已被锁定',
      '会话已超时',
      'IP地址受限',
      '验证码错误',
      '系统繁忙，请稍后重试',
      '网络连接失败',
      '权限不足，无法登录'
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
    title: '登录用户',
    dataIndex: 'user',
    key: 'user',
    width: 100
  },
  {
    title: '登录操作',
    dataIndex: 'action',
    key: 'action',
    width: 200
  },
  {
    title: '登录方式',
    dataIndex: 'loginType',
    key: 'loginType',
    width: 100
  },
  {
    title: '登录设备',
    dataIndex: 'device',
    key: 'device',
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
    title: '登录时间',
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
      log.ip.includes(filterForm.keyword) ||
      log.loginType.toLowerCase().includes(lowerKeyword)
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
  message.success(`搜索完成，共找到 ${filteredLogs.value.length} 条登录日志`);
};

const handleReset = () => {
  Object.assign(filterForm, {
    keyword: '',
    dateRange: null,
    status: ''
  });
  pagination.current = 1;
  message.success('表单已重置，登录日志列表已恢复');
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
    message.success(`删除登录日志 ID: ${id}`);
  } catch (error) {
    console.error('删除登录日志失败:', error);
    message.error('删除登录日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handleExport = async () => {
  try {
    loading.value = true;
    message.success('登录日志导出成功');
  } catch (error) {
    console.error('导出登录日志失败:', error);
    message.error('导出登录日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handleDeleteSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的登录日志');
    return;
  }
  
  const deleteCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      originalLogs.value = originalLogs.value.filter(log => log.id !== id);
    }
    
    selectedRowKeys.value = [];
    message.success(`删除 ${deleteCount} 条登录日志`);
  } catch (error) {
    console.error('批量删除登录日志失败:', error);
    message.error('批量删除登录日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 初始化完成
});
</script>

<style scoped>
.login-log-container {
  width: 100%;
  padding: 1.5%;
}

.login-log-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.login-log-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.login-log-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.login-log-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.login-log-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.login-log-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.login-log-table {
  border-radius: 4px;
}

.login-log-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.login-log-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.login-log-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.login-log-detail-modal {
  border-radius: 8px;
}

.login-log-detail {
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
  .login-log-page {
    padding: 20px;
  }
  
  .login-log-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .login-log-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .login-log-page {
    padding: 12px;
  }
  
  .login-log-filter {
    padding: 12px;
  }
  
  .login-log-actions {
    flex-direction: column;
  }
  
  .login-log-actions :deep(.ant-btn) {
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
  .login-log-page {
    padding: 12px;
  }
  
  .login-log-pagination {
    justify-content: center;
  }
  
  .login-log-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .login-log-detail-modal {
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