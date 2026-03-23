<template>
  <div class="backup-container">
    <a-config-provider :locale="zhCN">
      <div class="backup-page">
        <a-card class="backup-card">
          <!-- 搜索过滤区域 -->
          <div class="backup-filter" style="overflow-x: auto;">
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
                  <a-select-option value="manual">手动备份</a-select-option>
                  <a-select-option value="auto">自动备份</a-select-option>
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
          
          <!-- 操作按钮区域 -->
          <div class="backup-actions">
            <a-button type="primary" @click="handleManualBackup">立即备份</a-button>
            <a-button type="primary" style="margin-left: 8px;" @click="handleBackupSettings">备份设置</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #52c41a; color: white;" @click="handleDownloadSelected">下载选中</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f; color: white;" @click="handleDeleteSelected">批量删除</a-button>
          </div>
          
          <!-- 备份列表 -->
          <div class="backup-table-container">
            <a-table
              :columns="columns"
              :data-source="paginatedBackups"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="false"
              size="small"
              class="backup-table"
              row-key="id"
              :scroll="{ x: 1200 }"
              :loading="loading"
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
                <template v-else-if="column.key === 'user'">
                  <span>{{ record.user || '系统' }}</span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <div style="display: flex; gap: 8px;">
                    <a-tag color="blue" :bordered="false" @click="handleDetail(record)" style="cursor: pointer;">详情</a-tag>
                    <a-tag color="green" :bordered="false" @click="handleDownload(record.id)" style="cursor: pointer;">下载</a-tag>
                    <a-tag color="red" :bordered="false" @click="handleDelete(record.id)" style="cursor: pointer;">删除</a-tag>
                  </div>
                </template>
              </template>
            </a-table>
            
            <a-pagination
              v-model:current="pagination.current"
              v-model:pageSize="pagination.pageSize"
              :total="filteredBackups.length"
              :showSizeChanger="true"
              :pageSizeOptions="PAGE_SIZE_OPTIONS"
              :showTotal="showTotal"
              :showQuickJumper="true"
              class="backup-pagination"
            />
          </div>
        </a-card>
        
        <!-- 备份详情模态框 -->
        <a-modal
          v-model:open="detailModalVisible"
          title="备份详情"
          width="700px"
          :ok-text="'关闭'"
          :cancel-text="'取消'"
          @ok="closeDetailModal"
          @cancel="closeDetailModal"
          class="backup-detail-modal"
          :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
        >
          <div v-if="currentBackup" class="backup-detail">
            <div class="detail-header">
              <h3 class="detail-title">{{ currentBackup.name }}</h3>
              <div class="header-right">
                <a-tag :color="currentBackup.status === 'success' ? 'green' : 'red'" :bordered="false" class="status-tag">
                  {{ currentBackup.status === 'success' ? '成功' : '失败' }}
                </a-tag>
              </div>
            </div>
            
            <div class="detail-content">
              <div class="detail-section">
                <h4 class="section-title">基本信息</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <div class="detail-label">备份类型：</div>
                    <div class="detail-value">
                      <a-tag :color="currentBackup.type === 'manual' ? 'blue' : 'green'" :bordered="false" class="type-tag">
                        {{ currentBackup.type === 'manual' ? '手动备份' : '自动备份' }}
                      </a-tag>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">备份状态：</div>
                    <div class="detail-value">
                      <a-tag :color="currentBackup.status === 'success' ? 'green' : 'red'" :bordered="false" class="status-tag">
                        {{ currentBackup.status === 'success' ? '成功' : '失败' }}
                      </a-tag>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">备份时间：</div>
                    <div class="detail-value">{{ currentBackup.timestamp }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">备份大小：</div>
                    <div class="detail-value">{{ formatFileSize(currentBackup.size) }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">备份路径：</div>
                    <div class="detail-value">{{ currentBackup.path }}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">操作人：</div>
                    <div class="detail-value">{{ currentBackup.user || '系统' }}</div>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h4 class="section-title">备份内容</h4>
                <div class="detail-content-text">
                  <pre>{{ JSON.stringify(currentBackup.content, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </a-modal>
        
        <!-- 备份设置模态框 -->
        <a-modal
          v-model:open="settingsModalVisible"
          title="备份设置"
          width="600px"
          :ok-text="'保存'"
          :cancel-text="'取消'"
          @ok="handleSaveSettings"
          @cancel="closeSettingsModal"
          class="backup-detail-modal"
          :body-style="{ maxHeight: '400px', overflowY: 'auto' }"
        >
          <div class="settings-content" @keyup.enter="handleSaveSettings">
            <a-form layout="vertical" :model="backupSettings">
              <a-form-item label="自动备份">
                <a-switch v-model:checked="backupSettings.autoBackup" />
              </a-form-item>
              
              <a-form-item label="备份频率">
                <a-select v-model:value="backupSettings.frequency">
                  <a-select-option value="daily">每天</a-select-option>
                  <a-select-option value="weekly">每周</a-select-option>
                  <a-select-option value="monthly">每月</a-select-option>
                </a-select>
              </a-form-item>
              
              <a-form-item label="备份时间">
                <a-time-picker v-model:value="backupSettings.time" format="HH:mm" />
              </a-form-item>
              
              <a-form-item label="保留备份数量">
                <a-input-number v-model:value="backupSettings.keepCount" :min="1" :max="100" />
              </a-form-item>
              
              <a-form-item label="备份路径">
                <a-input v-model:value="backupSettings.path" placeholder="请输入备份存储路径" />
              </a-form-item>
            </a-form>
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

interface Backup {
  id: number;
  name: string;
  type: 'manual' | 'auto';
  status: 'success' | 'failure';
  timestamp: string;
  size: number;
  path: string;
  user: string | null;
  content: {
    tables: string[];
    configurations: boolean;
    attachments: boolean;
  };
}

interface FilterForm {
  type: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  keyword: string;
}

interface Pagination {
  current: number;
  pageSize: number;
}

interface BackupSettings {
  autoBackup: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: dayjs.Dayjs;
  keepCount: number;
  path: string;
}

const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;

// 生成随机备份数据
const generateRandomBackups = (): Backup[] => {
  const types: ('manual' | 'auto')[] = ['manual', 'auto'];
  const statuses: ('success' | 'failure')[] = ['success', 'failure'];
  const users = ['admin', 'user1', 'user2', 'system'];
  const contents = {
    tables: ['users', 'roles', 'permissions', 'departments', 'products', 'orders'],
    configurations: true,
    attachments: true
  };
  const backups: Backup[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
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
    
    // 生成随机文件大小（10MB - 1GB）
    const size = Math.floor(Math.random() * (1024 * 1024 * 1024 - 10 * 1024 * 1024)) + 10 * 1024 * 1024;
    
    backups.push({
      id: i,
      name: `${type === 'manual' ? '手动' : '自动'}备份_${formattedDate}`,
      type: type,
      status: status,
      timestamp: timestamp,
      size: size,
      path: `backup/${type === 'manual' ? 'manual' : 'auto'}/${formattedDate}_${i}.zip`,
      user: user === 'system' ? null : user,
      content: contents
    });
  }
  
  return backups;
};

// 加载状态
const loading = ref(false);

// 原始备份数据
const originalBackups = ref<Backup[]>(generateRandomBackups());

// 过滤表单数据
const filterForm = reactive<FilterForm>({
  type: '',
  dateRange: null,
  keyword: ''
});

// 选中的行 keys
const selectedRowKeys = ref<(string | number)[]>([]);

// 分页相关数据
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10
});

// 表格列定义
const columns = shallowRef([
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
  },
  {
    title: '操作人',
    dataIndex: 'user',
    key: 'user',
    width: 100,
    customRender: (text: any) => text || '系统'
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]);

// 详情模态框相关数据
const detailModalVisible = ref(false);
const currentBackup = ref<Backup | null>(null);

// 设置模态框相关数据
const settingsModalVisible = ref(false);
const backupSettings = reactive<BackupSettings>({
  autoBackup: true,
  frequency: 'daily',
  time: dayjs('02:00', 'HH:mm'),
  keepCount: 10,
  path: 'backup/'
});

// 过滤后的备份数据
const filteredBackups = computed(() => {
  let result = [...originalBackups.value];
  
  // 按类型过滤
  if (filterForm.type) {
    result = result.filter(backup => backup.type === filterForm.type);
  }
  
  // 按日期范围过滤
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const startDate = dayjs(filterForm.dateRange[0]).startOf('day');
    const endDate = dayjs(filterForm.dateRange[1]).endOf('day');
    result = result.filter(backup => {
      const backupDate = dayjs(backup.timestamp);
      return backupDate.isAfter(startDate.subtract(1, 'day')) && backupDate.isBefore(endDate.add(1, 'day'));
    });
  }
  
  // 按关键词过滤
  if (filterForm.keyword) {
    const lowerKeyword = filterForm.keyword.toLowerCase();
    result = result.filter(backup => 
      backup.name.toLowerCase().includes(lowerKeyword) ||
      (backup.user && backup.user.toLowerCase().includes(lowerKeyword)) ||
      backup.path.toLowerCase().includes(lowerKeyword)
    );
  }
  
  return result;
});

// 分页后的备份数据
const paginatedBackups = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredBackups.value.slice(start, end);
});

// 显示总数
const showTotal = (total: number) => `共 ${total} 条记录`;

// 组件挂载时初始化数据
onMounted(() => {
  // 初始化完成
});

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
  message.success(`搜索完成，共找到 ${filteredBackups.value.length} 条备份记录`);
};

/**
 * 重置按钮点击事件
 */
const handleReset = () => {
  // 重置表单
  Object.assign(filterForm, {
    type: '',
    dateRange: null,
    keyword: ''
  });
  
  // 重置到第一页
  pagination.current = 1;
  
  message.success('表单已重置，备份列表已恢复');
};

/**
 * 选择行变化事件
 * @param {Array} keys 选中的行 keys
 */
const onSelectChange = (keys: (string | number)[]) => {
  selectedRowKeys.value = keys;
};

/**
 * 查看备份详情
 * @param {Object} record 备份记录
 */
const handleDetail = (record: Backup) => {
  currentBackup.value = record;
  detailModalVisible.value = true;
};

/**
 * 关闭详情模态框
 */
const closeDetailModal = () => {
  detailModalVisible.value = false;
  currentBackup.value = null;
};

/**
 * 删除备份
 * @param {number} id 备份 ID
 */
const handleDelete = async (id: number) => {
  try {
    loading.value = true;
    originalBackups.value = originalBackups.value.filter(backup => backup.id !== id);
    message.success(`删除备份 ID: ${id}`);
  } catch (error) {
    console.error('删除备份失败:', error);
    message.error('删除备份失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 批量删除备份
 */
const handleDeleteSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的备份');
    return;
  }
  
  // 保存删除的数量
  const deleteCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    // 批量删除备份
    for (const id of selectedRowKeys.value) {
      originalBackups.value = originalBackups.value.filter(backup => backup.id !== id);
    }
    
    // 清空选中的行
    selectedRowKeys.value = [];
    
    // 显示成功提示
    message.success(`删除 ${deleteCount} 条备份记录`);
  } catch (error) {
    console.error('批量删除备份失败:', error);
    message.error('批量删除备份失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 手动备份
 */
const handleManualBackup = async () => {
  // 显示加载状态
  message.loading('正在执行备份操作...');
  
  try {
    loading.value = true;
    
    // 生成新的手动备份记录
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const timestamp = `${formattedDate} ${formattedTime}`;
    
    // 生成随机文件大小（10MB - 1GB）
    const size = Math.floor(Math.random() * (1024 * 1024 * 1024 - 10 * 1024 * 1024)) + 10 * 1024 * 1024;
    
    const newBackup: Backup = {
      id: originalBackups.value.length + 1,
      name: `手动备份_${formattedDate}`,
      type: 'manual',
      status: 'success',
      timestamp: timestamp,
      size: size,
      path: `backup/manual/${formattedDate}_${originalBackups.value.length + 1}.zip`,
      user: 'admin',
      content: {
        tables: ['users', 'roles', 'permissions', 'departments', 'products', 'orders'],
        configurations: true,
        attachments: true
      }
    };
    
    // 添加到备份列表
    originalBackups.value.unshift(newBackup);
    
    // 显示成功提示
    message.success('手动备份成功');
  } catch (error) {
    console.error('手动备份失败:', error);
    message.error('手动备份失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 下载备份
 * @param {number} id 备份 ID
 */
const handleDownload = async (id: number) => {
  try {
    loading.value = true;
    message.success(`开始下载备份 ID: ${id}`);
  } catch (error) {
    console.error('下载备份失败:', error);
    message.error('下载备份失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 批量下载备份
 */
const handleDownloadSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要下载的备份');
    return;
  }
  
  // 保存下载的数量
  const downloadCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    // 显示成功提示
    message.success(`开始下载 ${downloadCount} 条备份记录`);
  } catch (error) {
    console.error('批量下载备份失败:', error);
    message.error('批量下载备份失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 打开备份设置
 */
const handleBackupSettings = () => {
  settingsModalVisible.value = true;
};

/**
 * 关闭设置模态框
 */
const closeSettingsModal = () => {
  settingsModalVisible.value = false;
};

/**
 * 保存备份设置
 */
const handleSaveSettings = async () => {
  try {
    // 显示成功提示
    message.success('备份设置保存成功');
    
    // 关闭模态框
    settingsModalVisible.value = false;
  } catch (error) {
    console.error('保存备份设置失败:', error);
    message.error('保存备份设置失败，请稍后重试');
  }
};
</script>

<style scoped>
.backup-container {
  width: 100%;
  padding: 1.5%;
}

.backup-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.backup-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.backup-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.backup-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.backup-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.backup-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.backup-table {
  border-radius: 4px;
}

.backup-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.backup-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.backup-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.backup-detail-modal {
  border-radius: 8px;
}

.backup-detail {
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

.type-tag {
  font-size: 12px;
  padding: 2px 8px;
}

.settings-content {
  padding: 10px 0;
}

@media (max-width: 1200px) {
  .backup-page {
    padding: 20px;
  }
  
  .backup-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .backup-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .backup-page {
    padding: 12px;
  }
  
  .backup-filter {
    padding: 12px;
  }
  
  .backup-actions {
    flex-direction: column;
  }
  
  .backup-actions :deep(.ant-btn) {
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
  .backup-page {
    padding: 12px;
  }
  
  .backup-pagination {
    justify-content: center;
  }
  
  .backup-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .backup-detail-modal {
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