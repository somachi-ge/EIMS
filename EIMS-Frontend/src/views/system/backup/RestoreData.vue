<template>
  <div class="restore-container">
    <a-config-provider :locale="zhCN">
      <div class="restore-page">
        <a-card class="restore-card">
          <div class="restore-filter" style="overflow-x: auto;">
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
                  <a-select-option value="failure">失败</a-select-option>
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
          
          <div class="restore-actions">
            <a-button type="primary" @click="handleSelectBackup">选择备份</a-button>
            <a-button type="primary" style="background-color: #52c41a; color: white;" @click="handleRollbackLast">回滚上次</a-button>
            <a-button type="primary" style="background-color: #ff4d4f; color: white;" @click="handleDeleteSelected">批量删除</a-button>
          </div>
          
          <div class="restore-table-container">
            <a-table
              :columns="columns"
              :data-source="paginatedRestores"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="false"
              size="small"
              class="restore-table"
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
                <template v-else-if="column.key === 'user'">
                  <span>{{ record.user || '系统' }}</span>
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
              :total="filteredRestores.length"
              :showSizeChanger="true"
              :pageSizeOptions="PAGE_SIZE_OPTIONS"
              :showTotal="showTotal"
              :showQuickJumper="true"
              class="restore-pagination"
            />
          </div>
        </a-card>
        
        <a-modal
          v-model:open="detailModalVisible"
          title="恢复详情"
          width="700px"
          :ok-text="'关闭'"
          :cancel-text="'取消'"
          @ok="closeDetailModal"
          @cancel="closeDetailModal"
          class="restore-detail-modal"
          :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
        >
          <div v-if="currentRestore" class="restore-detail">
            <div class="detail-header">
              <h3 class="detail-title">{{ currentRestore.name }}</h3>
              <div class="header-right">
                <a-tag :color="currentRestore.status === 'success' ? 'green' : 'red'" :bordered="false" class="status-tag">
                  {{ currentRestore.status === 'success' ? '成功' : '失败' }}
                </a-tag>
              </div>
            </div>
            
            <div class="detail-content">
              <div class="detail-section">
                <h4 class="section-title">基本信息</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <div class="detail-label">恢复状态：</div>
                    <div class="detail-value">
                      <a-tag :color="currentRestore.status === 'success' ? 'green' : 'red'" :bordered="false" class="status-tag">
                        {{ currentRestore.status === 'success' ? '成功' : '失败' }}
                      </a-tag>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">恢复时间：</div>
                    <div class="detail-value">{{ currentRestore.timestamp }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">备份来源：</div>
                    <div class="detail-value">{{ currentRestore.backupName }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">操作人：</div>
                    <div class="detail-value">{{ currentRestore.user || '系统' }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">恢复耗时：</div>
                    <div class="detail-value">{{ currentRestore.duration }}秒</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">影响范围：</div>
                    <div class="detail-value">{{ currentRestore.affectedTables.length }}个表</div>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h4 class="section-title">恢复内容</h4>
                <div class="detail-content-text">
                  <pre>{{ JSON.stringify(currentRestore.affectedTables, null, 2) }}</pre>
                </div>
              </div>
              
              <div v-if="currentRestore.error" class="detail-section">
                <h4 class="section-title">错误信息</h4>
                <div class="detail-content-text error-text">
                  <pre>{{ currentRestore.error }}</pre>
                </div>
              </div>
            </div>
          </div>
        </a-modal>
        
        <!-- 选择备份恢复模态框 -->
        <a-modal
          v-model:open="selectBackupModalVisible"
          title="选择备份恢复"
          width="800px"
          :ok-text="'开始恢复'"
          :cancel-text="'取消'"
          @ok="handleStartRestore"
          @cancel="closeSelectBackupModal"
          class="restore-detail-modal"
          :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
        >
          <div class="select-backup-content" @keyup.enter="handleStartRestore">
            <a-alert
              message="恢复操作警告"
              description="恢复操作将覆盖当前系统数据，请确保已做好充分准备。建议在恢复前创建新的备份。"
              type="warning"
              show-icon
              style="margin-bottom: 20px;"
            />
            
            <h4 style="margin-bottom: 16px;">可用备份列表</h4>
            
            <a-table
              :columns="backupColumns"
              :data-source="availableBackups"
              :row-selection="{ selectedRowKeys: selectedBackupKeys, onChange: onBackupSelectChange }"
              size="small"
              class="restore-table"
              row-key="id"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'type'">
                  <a-tag :color="record.type === 'manual' ? 'blue' : 'green'" :bordered="false">
                    {{ record.type === 'manual' ? '手动备份' : '自动备份' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="record.status === 'success' ? 'green' : 'red'" :bordered="false">
                    {{ record.status === 'success' ? '成功' : '失败' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'size'">
                  <span>{{ formatFileSize(record.size) }}</span>
                </template>
              </template>
            </a-table>
            
            <div style="margin-top: 20px;">
              <a-checkbox v-model:checked="confirmRestore">我确认要执行恢复操作，了解可能的风险</a-checkbox>
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
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

// 设置 dayjs 为中文
dayjs.locale('zh-cn');

// 类型定义
interface RestoreRecord {
  id: number;
  name: string;
  status: 'success' | 'failure';
  timestamp: string;
  backupName: string;
  user: string | null;
  duration: number;
  affectedTables: string[];
  error: string | null;
}

interface BackupFile {
  id: number;
  name: string;
  type: 'manual' | 'auto';
  status: 'success' | 'failure';
  timestamp: string;
  size: number;
}

interface FilterForm {
  status: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  keyword: string;
}

interface Pagination {
  current: number;
  pageSize: number;
}

const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;


// 生成随机恢复历史数据
const generateRandomRestores = (): RestoreRecord[] => {
  const statuses: ('success' | 'failure')[] = ['success', 'failure'];
  const users = ['admin', 'user1', 'user2', 'system'];
  const backupNames = [
    '手动备份_2026-02-01', '自动备份_2026-01-30', '手动备份_2026-01-25',
    '自动备份_2026-01-20', '手动备份_2026-01-15', '自动备份_2026-01-10',
    '手动备份_2026-01-05', '自动备份_2025-12-30', '手动备份_2025-12-25'
  ];
  const affectedTables = [
    ['users', 'roles', 'permissions', 'departments'],
    ['products', 'orders', 'customers', 'suppliers'],
    ['inventory', 'warehouse', 'locations'],
    ['finance', 'accounts', 'transactions'],
    ['hr', 'employees', 'attendance', 'salary']
  ];
  const restores: RestoreRecord[] = [];
  
  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const backupName = backupNames[Math.floor(Math.random() * backupNames.length)];
    const affected = affectedTables[Math.floor(Math.random() * affectedTables.length)];
    
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
    
    // 生成随机耗时（1-300秒）
    const duration = Math.floor(Math.random() * 300) + 1;
    
    restores.push({
      id: i,
      name: `恢复操作_${formattedDate}`,
      status: status,
      timestamp: timestamp,
      backupName: backupName,
      user: user === 'system' ? null : user,
      duration: duration,
      affectedTables: affected,
      error: status === 'failure' ? '模拟恢复失败错误信息' : null
    });
  }
  
  return restores;
};

// 生成随机可用备份数据
const generateRandomBackups = (): BackupFile[] => {
  const types: ('manual' | 'auto')[] = ['manual', 'auto'];
  const statuses: ('success' | 'failure')[] = ['success', 'failure'];
  const backups: BackupFile[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // 生成随机时间（最近6个月内）
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 180); // 6个月 = 180天
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    
    const date = new Date(now);
    date.setDate(now.getDate() - randomDays);
    date.setHours(randomHours);
    date.setMinutes(randomMinutes);
    
    const formattedDate = date.toISOString().slice(0, 10);
    const formattedTime = `${randomHours.toString().padStart(2, '0')}:${randomMinutes.toString().padStart(2, '0')}`;
    const timestamp = `${formattedDate} ${formattedTime}`;
    
    // 生成随机文件大小（10MB - 1GB）
    const size = Math.floor(Math.random() * (1024 * 1024 * 1024 - 10 * 1024 * 1024)) + 10 * 1024 * 1024;
    
    backups.push({
      id: i,
      name: `${type === 'manual' ? '手动' : '自动'}备份_${formattedDate}`,
      type: type,
      status: status,
      timestamp: timestamp,
      size: size
    });
  }
  
  return backups;
};

// 加载状态
const loading = ref(false);
const backupLoading = ref(false);
const restoreLoading = ref(false);
const rollbackLoading = ref(false);
const deleteLoading = ref(false);

// 恢复历史数据
const originalRestores = ref<RestoreRecord[]>(generateRandomRestores());

// 可用备份数据
const availableBackups = ref<BackupFile[]>([]);

// 过滤表单数据
const filterForm = reactive<FilterForm>({
  status: '',
  dateRange: null,
  keyword: ''
});

// 分页相关数据
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10
});

// 选中的行 keys
const selectedRowKeys = ref<(string | number)[]>([]);

// 选中的备份 keys
const selectedBackupKeys = ref<(string | number)[]>([]);

// 确认恢复
const confirmRestore = ref(false);

// 详情模态框相关数据
const detailModalVisible = ref(false);
const currentRestore = ref<RestoreRecord | null>(null);

// 选择备份模态框相关数据
const selectBackupModalVisible = ref(false);

// 表格列定义
const columns = shallowRef([
  {
    title: '恢复操作',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80
  },
  {
    title: '备份来源',
    dataIndex: 'backupName',
    key: 'backupName',
    width: 200
  },
  {
    title: '操作人',
    dataIndex: 'user',
    key: 'user',
    width: 100
  },
  {
    title: '恢复时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 160
  },
  {
    title: '操作',
    key: 'operate',
    width: 120,
    fixed: 'right'
  }
]);

// 备份表格列定义
const backupColumns = shallowRef([
  {
    title: '备份名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
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
    title: '备份时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 160
  },
  {
    title: '备份大小',
    dataIndex: 'size',
    key: 'size',
    width: 100
  }
]);

// 过滤后的恢复记录
const filteredRestores = computed(() => {
  let result = [...originalRestores.value];
  
  if (filterForm.status) {
    result = result.filter(restore => restore.status === filterForm.status);
  }
  
  if (filterForm.keyword) {
    const keyword = filterForm.keyword.toLowerCase();
    result = result.filter(restore => 
      restore.name.toLowerCase().includes(keyword) ||
      restore.backupName.toLowerCase().includes(keyword) ||
      (restore.user && restore.user.toLowerCase().includes(keyword))
    );
  }
  
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const startDate = dayjs(filterForm.dateRange[0]);
    const endDate = dayjs(filterForm.dateRange[1]);
    result = result.filter(restore => {
      const restoreDate = dayjs(restore.timestamp.split(' ')[0]);
      return restoreDate.isAfter(startDate.subtract(1, 'day')) && restoreDate.isBefore(endDate.add(1, 'day'));
    });
  }
  
  return result;
});

// 分页后的恢复记录
const paginatedRestores = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredRestores.value.slice(start, end);
});

const showTotal = (total: number) => `共 ${total} 条记录`;

/**
 * 格式化文件大小
 * @param {number} bytes 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 搜索按钮点击事件
 */
const handleSearch = () => {
  pagination.current = 1;
  message.success(`搜索完成，共找到 ${filteredRestores.value.length} 条恢复记录`);
};

/**
 * 重置按钮点击事件
 */
const handleReset = () => {
  Object.assign(filterForm, {
    status: '',
    dateRange: null,
    keyword: ''
  });
  pagination.current = 1;
  message.success('表单已重置，恢复历史列表已恢复');
};

/**
 * 选择行变化事件
 * @param {Array} keys 选中的行 keys
 */
const onSelectChange = (keys: (string | number)[]) => {
  selectedRowKeys.value = keys;
};

/**
 * 备份选择变化事件
 * @param {Array} keys 选中的备份 keys
 */
const onBackupSelectChange = (keys: (string | number)[]) => {
  selectedBackupKeys.value = keys;
};

/**
 * 获取恢复历史记录
 */
const fetchRestores = async () => {
  loading.value = true;
  try {
    // 模拟API调用，使用模拟数据
    setTimeout(() => {
      originalRestores.value = generateRandomRestores();
      loading.value = false;
    }, 500);
  } catch (error: any) {
    console.error('获取恢复历史失败:', error);
    message.error(`获取恢复历史失败: ${error.message || '未知错误'}`);
    // 使用模拟数据作为 fallback
    originalRestores.value = generateRandomRestores();
    loading.value = false;
  }
};

/**
 * 获取可用备份列表
 */
const fetchAvailableBackups = async () => {
  backupLoading.value = true;
  try {
    // 模拟API调用，使用模拟数据
    setTimeout(() => {
      availableBackups.value = generateRandomBackups();
      backupLoading.value = false;
    }, 500);
  } catch (error) {
    console.error('获取可用备份失败:', error);
    message.error('获取可用备份失败');
    // 使用模拟数据作为 fallback
    availableBackups.value = generateRandomBackups();
    backupLoading.value = false;
  }
};

/**
 * 开始恢复操作
 * @param {number} backupId 备份ID
 */
const startRestore = async (_backupId: number) => {
  restoreLoading.value = true;
  try {
    // 模拟API调用
    setTimeout(() => {
      message.success('恢复操作成功完成');
      fetchRestores();
      restoreLoading.value = false;
    }, 1500);
  } catch (error) {
    console.error('恢复操作失败:', error);
    message.error('恢复操作失败，请查看详情');
    restoreLoading.value = false;
  }
};

/**
 * 回滚到上一次恢复
 */
const rollbackLast = async () => {
  rollbackLoading.value = true;
  try {
    // 模拟API调用
    setTimeout(() => {
      message.success('回滚操作成功完成');
      fetchRestores();
      rollbackLoading.value = false;
    }, 1500);
  } catch (error) {
    console.error('回滚操作失败:', error);
    message.error('回滚操作失败，请查看详情');
    rollbackLoading.value = false;
  }
};

/**
 * 删除恢复记录
 * @param {number} id 恢复记录ID
 */
const deleteRestore = async (_id: number) => {
  deleteLoading.value = true;
  try {
    // 模拟API调用
    setTimeout(() => {
      message.success('删除恢复记录成功');
      fetchRestores();
      deleteLoading.value = false;
    }, 500);
  } catch (error) {
    console.error('删除恢复记录失败:', error);
    message.error('删除恢复记录失败');
    deleteLoading.value = false;
  }
};

/**
 * 批量删除恢复记录
 * @param {Array} ids 恢复记录ID数组
 */
const batchDeleteRestore = async (ids: (string | number)[]) => {
  deleteLoading.value = true;
  try {
    // 模拟API调用
    setTimeout(() => {
      message.success(`删除 ${ids.length} 条恢复记录成功`);
      fetchRestores();
      deleteLoading.value = false;
    }, 500);
  } catch (error) {
    console.error('批量删除恢复记录失败:', error);
    message.error('批量删除恢复记录失败');
    deleteLoading.value = false;
  }
};

/**
 * 查看恢复详情
 * @param {Object} record 恢复记录
 */
const handleDetail = (record: RestoreRecord) => {
  currentRestore.value = record;
  detailModalVisible.value = true;
};

/**
 * 关闭详情模态框
 */
const closeDetailModal = () => {
  detailModalVisible.value = false;
  currentRestore.value = null;
};

/**
 * 删除恢复记录
 * @param {number} id 恢复记录 ID
 */
const handleDelete = async (id: number) => {
  await deleteRestore(id);
};

/**
 * 批量删除恢复记录
 */
const handleDeleteSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的恢复记录');
    return;
  }
  
  await batchDeleteRestore(selectedRowKeys.value);
  selectedRowKeys.value = [];
};

/**
 * 选择备份恢复
 */
const handleSelectBackup = async () => {
  // 重置选择状态
  selectedBackupKeys.value = [];
  confirmRestore.value = false;
  // 获取可用备份列表
  await fetchAvailableBackups();
  // 打开选择备份模态框
  selectBackupModalVisible.value = true;
};

/**
 * 关闭选择备份模态框
 */
const closeSelectBackupModal = () => {
  selectBackupModalVisible.value = false;
  selectedBackupKeys.value = [];
  confirmRestore.value = false;
};

/**
 * 开始恢复
 */
const handleStartRestore = async () => {
  if (selectedBackupKeys.value.length === 0) {
    message.warning('请选择要恢复的备份');
    return;
  }
  
  if (!confirmRestore.value) {
    message.warning('请确认恢复操作');
    return;
  }
  
  await startRestore(selectedBackupKeys.value[0] as number);
  
  // 关闭模态框
  selectBackupModalVisible.value = false;
  selectedBackupKeys.value = [];
  confirmRestore.value = false;
};

/**
 * 回滚到上一次恢复
 */
const handleRollbackLast = async () => {
  await rollbackLast();
};

// 组件挂载时获取数据
onMounted(async () => {
  await fetchRestores();
});
</script>

<style scoped>
.restore-container {
  width: 100%;
  padding: 1.5%;
}

.restore-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.restore-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.restore-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.restore-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.restore-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.restore-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.restore-table {
  border-radius: 4px;
}

.restore-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.restore-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.restore-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.restore-detail-modal {
  border-radius: 8px;
}

.restore-detail {
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

.detail-content-text.error-text {
  background-color: #fff2f0;
  border-color: #ffccc7;
  color: #cf1322;
}

.detail-content-text pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.select-backup-content {
  padding: 10px 0;
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
  .restore-page {
    padding: 20px;
  }
  
  .restore-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .restore-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .restore-page {
    padding: 12px;
  }
  
  .restore-filter {
    padding: 12px;
  }
  
  .restore-actions {
    flex-direction: column;
  }
  
  .restore-actions :deep(.ant-btn) {
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
  .restore-page {
    padding: 12px;
  }
  
  .restore-pagination {
    justify-content: center;
  }
  
  .restore-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .restore-detail-modal {
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