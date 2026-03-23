<template>
  <div class="system-log-container">
      <a-config-provider :locale="zhCN">
        <div class="system-log-page">
        <a-card class="system-log-card">
        <div class="system-log-filter" style="overflow-x: auto;">
          <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
            <div style="flex: 1.5; min-width: 200px;">
              <a-input v-model:value="filterForm.keyword" placeholder="请输入搜索关键词" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
            </div>
            <div style="flex: 1.2; min-width: 180px;">
              <a-range-picker v-model:value="filterForm.dateRange" :placeholder="['开始日期', '结束日期']" format="YYYY年MM月DD日" style="width: 100%;" />
            </div>
            <div style="flex: 1; min-width: 120px;">
              <a-select v-model:value="filterForm.type" placeholder="全部类型" allow-clear style="width: 100%;">
                <a-select-option value="">全部类型</a-select-option>
                <a-select-option value="安全日志">安全日志</a-select-option>
                <a-select-option value="数据库日志">数据库日志</a-select-option>
                <a-select-option value="错误日志">错误日志</a-select-option>
                <a-select-option value="系统日志">系统日志</a-select-option>
              </a-select>
            </div>
            <div style="flex: 1; min-width: 120px;">
              <a-select v-model:value="filterForm.level" placeholder="全部级别" allow-clear style="width: 100%;">
                <a-select-option value="">全部级别</a-select-option>
                <a-select-option value="信息">信息</a-select-option>
                <a-select-option value="警告">警告</a-select-option>
                <a-select-option value="错误">错误</a-select-option>
                <a-select-option value="致命">致命</a-select-option>
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
        
        <div class="system-log-actions">
          <a-button type="primary" @click="handleExport">导出日志</a-button>
          <a-button type="primary" style="margin-left: 8px; background-color: #52c41a; color: white;" @click="handleClearExpired">过期清理</a-button>
          <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f; color: white;" @click="handleDeleteSelected">批量删除</a-button>
        </div>
        
        <div class="system-log-table-container">
          <a-table
            :columns="columns"
            :data-source="paginatedLogs"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :pagination="false"
            size="small"
            class="system-log-table"
            row-key="id"
            :scroll="{ x: 1200 }"
            :loading="loading"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'level'">
                <a-tag :color="getLevelColor(record.level)" :bordered="false">
                  {{ record.level }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'type'">
                {{ record.type }}
              </template>
              <template v-else-if="column.key === 'message'">
                <span class="message-text">{{ record.message }}</span>
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
            :total="filteredLogs.length"
            :showSizeChanger="true"
            :pageSizeOptions="PAGE_SIZE_OPTIONS"
            :showTotal="showTotal"
            :showQuickJumper="true"
            class="system-log-pagination"
          />
        </div>
      </a-card>
      
      <a-modal
        v-model:open="detailModalVisible"
        title="日志详情"
        width="700px"
        :ok-text="'关闭'"
        :cancel-text="'取消'"
        @ok="closeDetailModal"
        @cancel="closeDetailModal"
        class="system-log-detail-modal"
        :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
      >
        <div v-if="currentLog" class="system-log-detail">
          <div class="detail-header">
            <h3 class="detail-title">{{ currentLog.message }}</h3>
            <div class="header-right">
              <a-tag :color="getLevelColor(currentLog.level)" :bordered="false" class="level-tag">
                {{ currentLog.level }}
              </a-tag>
            </div>
          </div>
          
          <div class="detail-content">
            <div class="detail-section">
              <h4 class="section-title">基本信息</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <div class="detail-label">日志类型：</div>
                  <div class="detail-value">
                    {{ currentLog.type }}
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">日志级别：</div>
                  <div class="detail-value">
                    <a-tag :color="getLevelColor(currentLog.level)" :bordered="false" class="level-tag">
                      {{ currentLog.level }}
                    </a-tag>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">发生时间：</div>
                  <div class="detail-value">{{ currentLog.timestamp }}</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">操作人：</div>
                  <div class="detail-value">{{ currentLog.user || '系统' }}</div>
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
  type: string;
  level: string;
  message: string;
  timestamp: string;
  user: string;
  ip: string;
  mac: string;
  userAgent: string;
  details: {
    action: string;
    module: string;
    server: string;
    process: string;
    processId: number;
    parameters: any;
    result: string;
    error: string | null;
    duration: number;
  };
}

interface FilterForm {
  type: string;
  level: string;
  dateRange: any;
  keyword: string;
}

interface Pagination {
  current: number;
  pageSize: number;
}

const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;

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

// 生成随机日志数据
const generateRandomLogs = (): Log[] => {
  const types = ['安全日志', '数据库日志', '错误日志', '系统日志'];
  const users = ['admin', 'user1', 'user2', 'system', 'manager', 'operator'];
  const ipPrefixes = ['192.168.1.', '10.0.0.', '172.16.0.'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
  ];
  const modules = ['system', 'user', 'role', 'permission', 'log', 'dashboard', 'settings', 'report', 'task', 'api'];
  const servers = ['eims-server-01', 'eims-server-02', 'eims-server-03'];
  const processes = ['main', 'worker', 'scheduler', 'api', 'cache'];
  
  // 不同类型日志的具体操作
  const typeActions = {
    '安全日志': ['登录系统', '退出系统', '登录失败', '密码错误', '账户锁定', '会话超时', '权限变更', '密码修改', '账户创建', '账户删除', '异常登录尝试', 'IP地址异常', '权限验证失败', 'MFA验证', '安全策略更新'],
    '数据库日志': ['执行SQL查询', '执行SQL更新', '执行SQL删除', '执行SQL插入', '数据库备份', '数据库恢复', '表结构变更', '索引创建', '存储过程执行', '事务提交', '事务回滚'],
    '错误日志': ['数据库连接失败', 'API调用失败', '文件上传失败', '权限验证失败', '参数验证错误', '系统异常'],
    '系统日志': ['系统启动', '系统关闭', '定时任务执行', '备份完成', '内存不足', '磁盘空间不足', '服务重启', '配置更新']
  };
  
  // 错误信息模板
  const errorMessages = {
    '数据库连接失败': '无法连接到数据库服务器，请检查网络连接和数据库服务状态',
    'API调用失败': '第三方API调用超时，返回状态码: 500',
    '文件上传失败': '文件大小超过限制，最大允许上传10MB',
    '权限验证失败': '当前用户没有执行此操作的权限',
    '参数验证错误': '请求参数格式错误，请检查输入数据',
    '系统异常': '系统内部错误，请联系管理员',
    '登录失败': '用户名或密码错误',
    '密码错误': '密码输入错误，剩余尝试次数: 2',
    '账户锁定': '账户已被锁定，请联系管理员解锁',
    '内存不足': '服务器内存使用率达到90%，请及时处理',
    '磁盘空间不足': '服务器磁盘空间不足，剩余空间: 100MB'
  };
  
  const logs: Log[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const actions = typeActions[type as keyof typeof typeActions];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const level = getLevelByAction(action);
    const user = type === '系统日志' && (action === '系统启动' || action === '系统关闭' || action === '定时任务执行') ? 'system' : users[Math.floor(Math.random() * users.length)];
    const ip = `${ipPrefixes[Math.floor(Math.random() * ipPrefixes.length)]}${Math.floor(Math.random() * 255)}`;
    const mac = generateRandomMacAddress();
    const userAgent = type === '系统日志' ? 'System Process' : userAgents[Math.floor(Math.random() * userAgents.length)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    const server = servers[Math.floor(Math.random() * servers.length)];
    const process = processes[Math.floor(Math.random() * processes.length)];
    const processId = Math.floor(Math.random() * 9999) + 1000;
    
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
    const timestamp = `${formattedDate} ${formattedTime}`;
    
    // 生成更具体的消息
    let message = '';
    if (type === '安全日志') {
      message = `${user} ${action}`;
    } else if (type === '数据库日志') {
      message = `${user} ${action}`;
    } else if (type === '错误日志') {
      message = `${action} (${module}模块)`;
    } else if (type === '系统日志') {
      message = `${server} 服务器 ${action}`;
    }
    
    // 生成详细信息
    const details = {
      action: action,
      module: module,
      server: server,
      process: process,
      processId: processId,
      parameters: getParametersByAction(action, i),
      result: level === '错误' || level === '致命' ? '失败' : '成功',
      error: (level === '错误' || level === '致命') ? (errorMessages[action as keyof typeof errorMessages] || '系统错误') : null,
      duration: Math.floor(Math.random() * 1000) + 100 // 操作持续时间（毫秒）
    };
    
    logs.push({
      id: i,
      type: type,
      level: level,
      message: message,
      timestamp: timestamp,
      user: user,
      ip: ip,
      mac: mac,
      userAgent: userAgent,
      details: details
    });
  }
  
  // 根据操作类型确定日志级别
  function getLevelByAction(action: string): string {
    if (action.includes('失败') || action.includes('错误') || action.includes('锁定') || action.includes('不足')) {
      return ['错误', '致命'][Math.floor(Math.random() * 2)];
    } else if (action.includes('警告') || action.includes('超时')) {
      return '警告';
    } else {
      return '信息';
    }
  }
  
  // 根据操作类型生成参数
  function getParametersByAction(action: string, id: number) {
    if (action.includes('用户')) {
      return { userId: id, username: `user${id}`, roleId: Math.floor(Math.random() * 10) + 1 };
    } else if (action.includes('角色')) {
      return { roleId: id, roleName: `role${id}`, permissionIds: [1, 2, 3] };
    } else if (action.includes('权限')) {
      return { permissionId: id, permissionName: `permission${id}`, resource: '/api/v1/users' };
    } else if (action.includes('登录') || action.includes('退出') || action.includes('密码') || action.includes('账户') || action.includes('会话') || action.includes('MFA') || action.includes('安全')) {
      const loginTypes = ['web', 'mobile', 'api', 'ssh', 'ftp'];
      const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
      const devices = ['Windows PC', 'MacOS', 'Linux', 'iPhone', 'Android'];
      return {
        username: `user${Math.floor(Math.random() * 100)}`,
        loginType: loginTypes[Math.floor(Math.random() * loginTypes.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        location: ['北京', '上海', '广州', '深圳', '长春'][Math.floor(Math.random() * 5)],
        isMfaUsed: Math.random() > 0.5,
        sessionId: `session_${Math.floor(Math.random() * 9999999999)}`
      };
    } else if (action.includes('导出')) {
      return { exportType: ['excel', 'pdf', 'csv'][Math.floor(Math.random() * 3)], recordCount: Math.floor(Math.random() * 1000) + 1 };
    } else if (action.includes('定时任务')) {
      return { taskId: id, taskName: `task${id}`, cronExpression: '0 0 * * *' };
    } else if (action.includes('SQL') || action.includes('数据库') || action.includes('表结构') || action.includes('索引') || action.includes('存储过程') || action.includes('事务')) {
      const tables = ['users', 'roles', 'permissions', 'logs', 'settings'];
      const table = tables[Math.floor(Math.random() * tables.length)];
      return {
        database: 'eims_db',
        table: table,
        sql: action.includes('查询') ? `SELECT * FROM ${table} WHERE id = ${id}` :
              action.includes('更新') ? `UPDATE ${table} SET name = 'updated' WHERE id = ${id}` :
              action.includes('删除') ? `DELETE FROM ${table} WHERE id = ${id}` :
              action.includes('插入') ? `INSERT INTO ${table} (name) VALUES ('new_${table}_${id}')` :
              action.includes('备份') ? `BACKUP DATABASE eims_db TO 'backup_${id}.bak'` :
              action.includes('恢复') ? `RESTORE DATABASE eims_db FROM 'backup_${id}.bak'` :
              action.includes('表结构') ? `ALTER TABLE ${table} ADD COLUMN new_column VARCHAR(255)` :
              action.includes('索引') ? `CREATE INDEX idx_${table}_name ON ${table} (name)` :
              action.includes('存储过程') ? `EXEC sp_get_${table}_data ${id}` :
              action.includes('事务') ? `BEGIN TRANSACTION; UPDATE ${table} SET name = 'updated'; COMMIT;` :
              '',
        affectedRows: Math.floor(Math.random() * 100) + 1,
        executionTime: Math.floor(Math.random() * 1000) + 10 // 毫秒
      };
    } else {
      return { id: id, timestamp: new Date().toISOString() };
    }
  }
  
  return logs;
};

const loading = ref(false);
const originalLogs = ref<Log[]>(generateRandomLogs());
const selectedRowKeys = ref<(string | number)[]>([]);
const detailModalVisible = ref(false);
const currentLog = ref<Log | null>(null);

const filterForm = reactive<FilterForm>({
  type: '',
  level: '',
  dateRange: null,
  keyword: ''
});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10
});

const columns = shallowRef([
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '级别',
    dataIndex: 'level',
    key: 'level',
    width: 80
  },
  {
    title: '消息',
    dataIndex: 'message',
    key: 'message',
    width: 300
  },
  {
    title: '操作人',
    dataIndex: 'user',
    key: 'user',
    width: 100,
    customRender: (text: any) => text || '系统'
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
    title: '发生时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 160
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right'
  }
]);

const filteredLogs = computed(() => {
  let result = [...originalLogs.value];
  
  if (filterForm.type) {
    result = result.filter(log => log.type === filterForm.type);
  }
  
  if (filterForm.level) {
    result = result.filter(log => log.level === filterForm.level);
  }
  
  if (filterForm.keyword) {
    const lowerKeyword = filterForm.keyword.toLowerCase();
    result = result.filter(log => 
      log.message.toLowerCase().includes(lowerKeyword) ||
      log.user.toLowerCase().includes(lowerKeyword) ||
      log.ip.includes(filterForm.keyword)
    );
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
  message.success(`搜索完成，共找到 ${filteredLogs.value.length} 条日志`);
};

const handleReset = () => {
  Object.assign(filterForm, {
    type: '',
    level: '',
    dateRange: null,
    keyword: ''
  });
  pagination.current = 1;
  message.success('表单已重置，日志列表已恢复');
};

const onSelectChange = (keys: (string | number)[]) => {
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
  await deleteLog(id);
};

const handleExport = async () => {
  await exportLogs();
};

const handleClearExpired = async () => {
  await clearExpiredLogs();
};

const handleDeleteSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的日志');
    return;
  }
  
  const deleteCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      await deleteLog(id as number);
    }
    
    selectedRowKeys.value = [];
    message.success(`删除 ${deleteCount} 条日志`);
  } catch (error) {
    console.error('批量删除日志失败:', error);
    message.error('批量删除日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const deleteLog = async (id: number) => {
  try {
    loading.value = true;
    originalLogs.value = originalLogs.value.filter(log => log.id !== id);
    message.success(`删除日志 ID: ${id}`);
  } catch (error) {
    console.error('删除日志失败:', error);
    message.error('删除日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const exportLogs = async () => {
  try {
    loading.value = true;
    message.success('日志导出成功');
  } catch (error) {
    console.error('导出日志失败:', error);
    message.error('导出日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const clearExpiredLogs = async () => {
  try {
    loading.value = true;
    message.success('过期日志清理成功');
  } catch (error) {
    console.error('清理过期日志失败:', error);
    message.error('清理过期日志失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};



const getLevelColor = (level: string) => {
  switch (level) {
    case '信息':
      return 'blue';
    case '警告':
      return 'yellow';
    case '错误':
      return 'red';
    case '致命':
      return 'orange';
    default:
      return 'default';
  }
};

onMounted(() => {
  // 初始化完成
});
</script>

<style scoped>
.system-log-container {
  width: 100%;
  padding: 1.5%;
}

.system-log-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.system-log-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.system-log-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.system-log-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.system-log-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.system-log-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.system-log-table {
  border-radius: 4px;
}

.system-log-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.system-log-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.system-log-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.system-log-detail-modal {
  border-radius: 8px;
}

.system-log-detail {
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

.level-tag {
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

.type-tag {
  font-size: 12px;
  padding: 2px 8px;
}

.message-text {
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
  .system-log-page {
    padding: 20px;
  }
  
  .system-log-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .system-log-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .system-log-page {
    padding: 12px;
  }
  
  .system-log-filter {
    padding: 12px;
  }
  
  .system-log-actions {
    flex-direction: column;
  }
  
  .system-log-actions :deep(.ant-btn) {
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
  .system-log-page {
    padding: 12px;
  }
  
  .system-log-pagination {
    justify-content: center;
  }
  
  .system-log-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .system-log-detail-modal {
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