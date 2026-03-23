<template>
  <a-config-provider :locale="zhCN">
    <div class="role-list-container">
      <div class="role-page">
        <!-- 角色管理卡片 -->
        <a-card class="role-card">
          <div class="card-header">
            <div class="header-right">
            </div>
          </div>
          
          <!-- 搜索过滤区域 -->
          <div class="role-filter" style="overflow-x: auto;">
            <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.code" placeholder="请输入角色编码" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.name" placeholder="请输入角色名称" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.permissionCount" placeholder="请输入权限数量" @keyup.enter="handleSearch" type="number" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.userCount" placeholder="请输入用户数量" @keyup.enter="handleSearch" type="number" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1.2; min-width: 180px;">
                <a-range-picker v-model:value="filterForm.dateRange" :placeholder="['开始日期', '结束日期']" format="YYYY年MM月DD日" :locale="zhCN" style="width: 100%;" />
              </div>
              <div style="flex: 0.6; min-width: 90px;">
                <a-select v-model:value="filterForm.status" placeholder="状态" allow-clear style="width: 100%;">
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="active">已激活</a-select-option>
                  <a-select-option value="inactive">未激活</a-select-option>
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
          <div class="role-actions">
            <a-button type="primary" @click="handleAddRole">添加角色</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #52c41a; color: white;" @click="handleBatchActivate">批量激活</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #fa8c16; color: white;" @click="handleBatchDeactivate">批量停用</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f; color: white;" @click="handleDeleteSelected">批量删除</a-button>
          </div>
          
          <!-- 角色列表 -->
          <div class="role-table-container">
            <a-table
              :columns="columns"
              :data-source="paginatedRoles"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="false"
              size="small"
              class="role-table"
              row-key="id"
              :scroll="{ x: 1000 }"
              :loading="loading"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === 'active' ? 'green' : 'red'" :bordered="false" @click="toggleRoleStatus(record)" style="cursor: pointer;">
                    {{ record.status === 'active' ? '已激活' : '未激活' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <div style="display: flex; gap: 8px;">
                    <a-tag color="blue" :bordered="false" @click="handleEditRole(record)" style="cursor: pointer;">编辑</a-tag>
                    <a-tag color="red" :bordered="false" @click="handleDeleteRole(record.id)" style="cursor: pointer;">删除</a-tag>
                  </div>
                </template>
              </template>
            </a-table>
            
            <a-pagination
              v-model:current="pagination.current"
              v-model:pageSize="pagination.pageSize"
              :total="filteredRoles.length"
              :showSizeChanger="true"
              :pageSizeOptions="PAGE_SIZE_OPTIONS"
              :showTotal="showTotal"
              :showQuickJumper="true"
              class="role-pagination"
              :locale="PAGINATION_LOCALE"
            />
          </div>
        </a-card>
        
        <!-- 添加/编辑角色模态框 -->
        <a-modal
          v-model:open="roleModalVisible"
          :title="isEditMode ? '编辑角色' : '添加角色'"
          width="600px"
          :ok-text="'保存'"
          :cancel-text="'取消'"
          @ok="handleSaveRole"
          @cancel="closeRoleModal"
          class="role-detail-modal"
          :body-style="{ maxHeight: '400px', overflowY: 'auto' }"
        >
          <div class="role-form">
            <a-form :model="currentRole" layout="vertical">
              <a-form-item label="角色编码">
                <a-input v-model:value="currentRole.id" placeholder="角色编码" disabled />
              </a-form-item>
              <a-form-item label="角色名称" :rules="[{ required: true, message: '请输入角色名称' }]">
                <a-input v-model:value="currentRole.name" placeholder="请输入角色名称" @keyup.enter="handleSaveRole" />
              </a-form-item>
              <a-form-item label="角色描述">
                <a-textarea v-model:value="currentRole.description" placeholder="请输入角色描述" rows="3" @keyup.enter="handleSaveRole" />
              </a-form-item>
              <a-form-item label="角色状态" :rules="[{ required: true, message: '请选择角色状态' }]">
                <a-radio-group v-model:value="currentRole.status">
                  <a-radio value="active">已激活</a-radio>
                  <a-radio value="inactive">未激活</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="权限设置" v-if="!isEditMode">
                <div class="permission-info">
                  <p>创建角色后，可在权限管理页面分配具体权限</p>
                </div>
              </a-form-item>
              <a-form-item label="权限数量" v-if="isEditMode">
                <a-input v-model:value="currentRole.permissionCount" placeholder="权限数量" disabled />
              </a-form-item>
              <a-form-item label="用户数量" v-if="isEditMode">
                <a-input v-model:value="currentRole.userCount" placeholder="用户数量" disabled />
              </a-form-item>
            </a-form>
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

dayjs.locale('zh-cn');

// 类型定义
interface Role {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  permissionCount: number;
  userCount: number;
  updateTime: string;
}

interface FilterForm {
  status: string;
  code: string;
  name: string;
  permissionCount: string;
  userCount: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
}

interface Pagination {
  current: number;
  pageSize: number;
}

interface RoleForm {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  permissionCount: number;
  userCount: number;
}

// 常量定义
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

const ROLE_PREFIX = 'ROL';

// 生成角色编码
const generateRoleCode = (prefix: string, index: number): string => {
  const number = String(index).padStart(3, '0');
  return prefix + number;
};

// 生成模拟角色数据
const generateMockRoles = (): Role[] => {
  const roles: Role[] = [];
  const roleNames = ['管理员', '普通用户', '审核员', '财务人员', '客服人员', '技术支持', '市场人员', '销售经理', 'HR管理员', '系统维护'];
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  
  for (let i = 1; i <= 10; i++) {
    const status = statuses[i % 2];
    const roleName = roleNames[i - 1];
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const updateTime = date.toISOString().replace('T', ' ').substring(0, 19);
    
    roles.push({
      id: generateRoleCode(ROLE_PREFIX, i),
      name: roleName,
      description: `${roleName}角色描述`,
      status: status,
      permissionCount: Math.floor(Math.random() * 20) + 1,
      userCount: Math.floor(Math.random() * 50) + 1,
      updateTime: updateTime
    });
  }
  
  return roles;
};

// 状态管理
const loading = ref(false);
const originalRoles = ref<Role[]>(generateMockRoles());
const selectedRowKeys = ref<(string | number)[]>([]);
const roleModalVisible = ref(false);
const isEditMode = ref(false);

// 表单数据
const filterForm = reactive<FilterForm>({
  status: '',
  code: '',
  name: '',
  permissionCount: '',
  userCount: '',
  dateRange: null
});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10
});

const currentRole = reactive<RoleForm>({
  id: '',
  name: '',
  description: '',
  status: 'active',
  permissionCount: 0,
  userCount: 0
});

// 表格列定义
const columns = shallowRef([
  {
    title: '角色编码',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: '角色描述',
    dataIndex: 'description',
    key: 'description',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80
  },
  {
    title: '权限数量',
    dataIndex: 'permissionCount',
    key: 'permissionCount',
    width: 100
  },
  {
    title: '用户数量',
    dataIndex: 'userCount',
    key: 'userCount',
    width: 120
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 160
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]);

// 计算属性：过滤后的角色列表
const filteredRoles = computed(() => {
  let result = [...originalRoles.value];
  
  // 按状态过滤
  if (filterForm.status) {
    result = result.filter(role => role.status === filterForm.status);
  }
  
  // 按角色编码过滤
  if (filterForm.code) {
    const codeKeyword = filterForm.code.toUpperCase();
    result = result.filter(role => role.id.toUpperCase().includes(codeKeyword));
  }
  
  // 按角色名称过滤
  if (filterForm.name) {
    const nameKeyword = filterForm.name.toLowerCase();
    result = result.filter(role => role.name.toLowerCase().includes(nameKeyword));
  }
  
  // 按日期范围过滤
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const startDate = dayjs(filterForm.dateRange[0]);
    const endDate = dayjs(filterForm.dateRange[1]);
    result = result.filter(role => {
      const roleDate = dayjs(role.updateTime.split(' ')[0]);
      return roleDate.isAfter(startDate.subtract(1, 'day')) && roleDate.isBefore(endDate.add(1, 'day'));
    });
  }
  
  // 按权限数量过滤
  if (filterForm.permissionCount) {
    const permissionCount = parseInt(filterForm.permissionCount, 10);
    if (!isNaN(permissionCount)) {
      result = result.filter(role => role.permissionCount === permissionCount);
    }
  }
  
  // 按用户数量过滤
  if (filterForm.userCount) {
    const userCount = parseInt(filterForm.userCount, 10);
    if (!isNaN(userCount)) {
      result = result.filter(role => role.userCount === userCount);
    }
  }
  
  return result;
});

// 计算属性：分页后的角色列表
const paginatedRoles = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredRoles.value.slice(start, end);
});

// 显示总数
const showTotal = (total: number) => `共 ${total} 条记录`;

// 搜索按钮点击事件
const handleSearch = () => {
  pagination.current = 1;
  message.success(`搜索完成，共找到 ${filteredRoles.value.length} 个角色`);
};

// 重置按钮点击事件
const handleReset = () => {
  Object.assign(filterForm, {
    status: '',
    code: '',
    name: '',
    permissionCount: '',
    userCount: '',
    dateRange: null
  });
  pagination.current = 1;
  message.success('表单已重置，角色列表已恢复');
};

// 选择行变化事件
const onSelectChange = (keys: (string | number)[]) => {
  selectedRowKeys.value = keys;
};

// 打开添加角色模态框
const handleAddRole = () => {
  isEditMode.value = false;
  
  // 生成新的角色编码
  let maxIndex = 0;
  originalRoles.value.forEach(role => {
    if (role.id.startsWith(ROLE_PREFIX)) {
      const numberPart = role.id.substring(ROLE_PREFIX.length);
      const index = parseInt(numberPart, 10);
      if (!isNaN(index) && index > maxIndex) {
        maxIndex = index;
      }
    }
  });
  
  const newIndex = maxIndex + 1;
  const newRoleCode = generateRoleCode(ROLE_PREFIX, newIndex);
  
  // 重置表单
  Object.assign(currentRole, {
    id: newRoleCode,
    name: '',
    description: '',
    status: 'active',
    permissionCount: 0,
    userCount: 0
  });
  
  roleModalVisible.value = true;
};

// 打开编辑角色模态框
const handleEditRole = (record: Role) => {
  isEditMode.value = true;
  // 填充表单数据
  Object.assign(currentRole, {
    id: record.id,
    name: record.name,
    description: record.description,
    status: record.status,
    permissionCount: record.permissionCount,
    userCount: record.userCount
  });
  roleModalVisible.value = true;
};

// 保存角色
const handleSaveRole = async () => {
  // 验证表单
  if (!currentRole.name) {
    message.error('请输入角色名称');
    return;
  }
  
  try {
    if (isEditMode.value) {
      // 编辑角色
      await updateRole(currentRole.id, {
        name: currentRole.name,
        description: currentRole.description,
        status: currentRole.status
      });
    } else {
      // 添加角色
      await createRole({
        id: currentRole.id,
        name: currentRole.name,
        description: currentRole.description,
        status: currentRole.status
      });
    }
    
    // 关闭模态框
    closeRoleModal();
  } catch (error) {
    console.error('保存角色失败:', error);
    message.error('保存角色失败，请稍后重试');
  }
};

// 关闭角色模态框
const closeRoleModal = () => {
  roleModalVisible.value = false;
};

// 删除角色
const handleDeleteRole = async (id: string) => {
  await deleteRole(id);
};

// 批量删除角色
const handleDeleteSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的角色');
    return;
  }
  
  const deleteCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      await deleteRole(id as string);
    }
    
    // 清空选中的行
    selectedRowKeys.value = [];
    message.success(`删除 ${deleteCount} 个角色`);
  } catch (error) {
    console.error('批量删除角色失败:', error);
    message.error('批量删除角色失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 批量激活角色
const handleBatchActivate = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要激活的角色');
    return;
  }
  
  const activateCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      const role = originalRoles.value.find(r => r.id === id);
      if (role) {
        await updateRole(id as string, {
          ...role,
          status: 'active'
        });
      }
    }
    
    // 清空选中的行
    selectedRowKeys.value = [];
    message.success(`激活 ${activateCount} 个角色`);
  } catch (error) {
    console.error('批量激活角色失败:', error);
    message.error('批量激活角色失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 批量停用角色
const handleBatchDeactivate = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要停用的角色');
    return;
  }
  
  const deactivateCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      const role = originalRoles.value.find(r => r.id === id);
      if (role) {
        await updateRole(id as string, {
          ...role,
          status: 'inactive'
        });
      }
    }
    
    // 清空选中的行
    selectedRowKeys.value = [];
    message.success(`停用 ${deactivateCount} 个角色`);
  } catch (error) {
    console.error('批量停用角色失败:', error);
    message.error('批量停用角色失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 创建角色
const createRole = async (role: Omit<Role, 'permissionCount' | 'userCount' | 'updateTime'>) => {
  try {
    loading.value = true;
    const newRole: Role = {
      ...role,
      permissionCount: 0,
      userCount: 0,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    originalRoles.value.push(newRole);
    message.success('角色创建成功');
  } catch (error) {
    console.error('创建角色失败:', error);
    message.error('创建角色失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 更新角色
const updateRole = async (id: string, role: Partial<Role>) => {
  try {
    loading.value = true;
    const index = originalRoles.value.findIndex(r => r.id === id);
    if (index !== -1) {
      originalRoles.value[index] = {
        ...originalRoles.value[index],
        ...role,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      message.success('角色更新成功');
    }
  } catch (error) {
    console.error('更新角色失败:', error);
    message.error('更新角色失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 删除角色
const deleteRole = async (id: string) => {
  try {
    loading.value = true;
    originalRoles.value = originalRoles.value.filter(r => r.id !== id);
    message.success('角色删除成功');
  } catch (error) {
    console.error('删除角色失败:', error);
    message.error('删除角色失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 切换角色状态
const toggleRoleStatus = async (record: Role) => {
  const newStatus = record.status === 'active' ? 'inactive' : 'active';
  
  try {
    await updateRole(record.id, {
      ...record,
      status: newStatus
    });
  } catch (error) {
    console.error('切换角色状态失败:', error);
    message.error('切换角色状态失败，请稍后重试');
  }
};

// 组件挂载时初始化
onMounted(() => {
  // 初始化完成
});
</script>

<style scoped>
.role-list-container {
  width: 100%;
  padding: 1.5%;
}

.role-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.role-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.role-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.role-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.role-table {
  border-radius: 4px;
}

.role-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.role-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.role-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.role-detail-modal {
  border-radius: 8px;
}

.role-form {
  padding: 20px 0;
}

.role-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.permission-info {
  padding: 12px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  color: #52c41a;
  font-size: 14px;
}

.permission-info p {
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .role-page {
    padding: 20px;
  }
  
  .role-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .role-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .role-page {
    padding: 12px;
  }
  
  .role-filter {
    padding: 12px;
  }
  
  .role-actions {
    flex-direction: column;
  }
  
  .role-actions :deep(.ant-btn) {
    width: 100%;
    margin-left: 0 !important;
  }
}

@media (max-width: 576px) {
  .role-page {
    padding: 12px;
  }
  
  .role-pagination {
    justify-content: center;
  }
  
  .role-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .role-detail-modal {
    width: 90% !important;
  }
  
  .card-title {
    font-size: 16px;
  }
}
</style>