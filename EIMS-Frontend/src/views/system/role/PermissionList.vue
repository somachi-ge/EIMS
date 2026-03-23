<template>
  <a-config-provider :locale="zhCN">
    <div class="permission-container">
      <div class="permission-page">
        <!-- 权限管理卡片 -->
        <a-card class="permission-card">
          <div class="card-header">
            <div class="header-right">
            </div>
          </div>
          
          <!-- 搜索过滤区域 -->
          <div class="permission-filter" style="overflow-x: auto;">
            <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.permissionCode" placeholder="请输入权限编码" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.name" placeholder="请输入权限名称" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.code" placeholder="请输入权限代码" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
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
          <div class="permission-actions">
            <a-button type="primary" @click="handleAddPermission">添加权限</a-button>
            <a-button type="primary" style="margin-left: 8px;" @click="handleRolePermission">角色赋权</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #52c41a; color: white;" @click="handleBatchActivate">批量激活</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #fa8c16; color: white;" @click="handleBatchDeactivate">批量停用</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f;" @click="handleDeleteSelected">批量删除</a-button>
          </div>
          
          <!-- 权限列表 -->
          <div class="permission-table-container">
            <a-table
              :columns="columns"
              :data-source="paginatedPermissions"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="false"
              size="small"
              class="permission-table"
              row-key="id"
              :scroll="{ x: 1000 }"
              :loading="loading"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === 'active' ? 'green' : 'orange'" :bordered="false" @click="togglePermissionStatus(record)" style="cursor: pointer;">
                    {{ record.status === 'active' ? '已激活' : '未激活' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <div style="display: flex; gap: 8px;">
                    <a-tag color="blue" :bordered="false" @click="handleEditPermission(record)" style="cursor: pointer;">编辑</a-tag>
                    <a-tag color="red" :bordered="false" @click="handleDeletePermission(record.id)" style="cursor: pointer;">删除</a-tag>
                  </div>
                </template>
              </template>
            </a-table>
            
            <a-pagination
              v-model:current="pagination.current"
              v-model:pageSize="pagination.pageSize"
              :total="filteredPermissions.length"
              :showSizeChanger="true"
              :pageSizeOptions="PAGE_SIZE_OPTIONS"
              :showTotal="showTotal"
              :showQuickJumper="true"
              class="permission-pagination"
              :locale="PAGINATION_LOCALE"
            />
          </div>
        </a-card>
        
        <!-- 添加/编辑权限模态框 -->
        <a-modal
          v-model:open="permissionModalVisible"
          :title="isEditMode ? '编辑权限' : '添加权限'"
          width="600px"
          :ok-text="'保存'"
          :cancel-text="'取消'"
          @ok="handleSavePermission"
          @cancel="closePermissionModal"
          class="permission-detail-modal"
          :body-style="{ maxHeight: '400px', overflowY: 'auto' }"
        >
          <div class="permission-form">
            <a-form :model="currentPermission" layout="vertical">
              <a-form-item label="权限编码">
                <a-input v-model:value="currentPermission.permissionCode" placeholder="权限编码" disabled />
              </a-form-item>
              <a-form-item label="权限名称">
                <a-input v-model:value="currentPermission.name" placeholder="请输入权限名称" @input="generatePermissionCodeFromInput" @keyup.enter="handleSavePermission" />
              </a-form-item>
              <a-form-item label="权限描述">
                <a-textarea v-model:value="currentPermission.description" placeholder="请输入权限描述" rows="3" @input="generatePermissionCodeFromInput" @keyup.enter="handleSavePermission" />
              </a-form-item>
              <a-form-item label="权限代码">
                <a-input v-model:value="currentPermission.code" placeholder="权限代码" disabled />
              </a-form-item>
              <a-form-item label="状态">
                <a-select v-model:value="currentPermission.status" placeholder="请选择状态">
                  <a-select-option value="active">已激活</a-select-option>
                  <a-select-option value="inactive">未激活</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
        </a-modal>
        
        <!-- 角色赋权模态框 -->
        <a-modal
          v-model:open="rolePermissionModalVisible"
          title="角色赋权"
          width="800px"
          :ok-text="'保存'"
          :cancel-text="'取消'"
          @ok="handleSaveRolePermission"
          @cancel="closeRolePermissionModal"
          class="permission-detail-modal"
          :body-style="{ maxHeight: '400px', overflowY: 'auto' }"
        >
          <div class="role-permission-form">
            <a-form :model="rolePermissionForm" layout="vertical">
              <a-form-item label="角色选择">
                <a-select v-model:value="rolePermissionForm.roleId" placeholder="请选择角色">
                  <a-select-option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="权限分配">
                <div class="permission-tree">
                  <a-checkbox-group v-model:value="rolePermissionForm.permissionIds">
                    <a-checkbox 
                      v-for="permission in filteredPermissions" 
                      :key="permission.id" 
                      :value="permission.id"
                    >
                      {{ permission.name }}
                    </a-checkbox>
                  </a-checkbox-group>
                </div>
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

interface Permission {
  id: number;
  code: string;
  permissionCode: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  roleCount: number;
  updateTime: string;
}

interface FilterForm {
  permissionCode: string;
  name: string;
  code: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  status: string;
}

interface Pagination {
  current: number;
  pageSize: number;
}

interface PermissionForm {
  id: number | null;
  code: string;
  permissionCode: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  roleCount: number;
}

interface RolePermissionForm {
  roleId: string;
  permissionIds: (string | number)[];
}

interface Role {
  id: string;
  name: string;
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

const PERMISSION_PREFIX = 'PER';

const generatePermissionCode = (prefix: string, index: number): string => {
  const number = String(index).padStart(3, '0');
  return prefix + number;
};

const generateRandomPermissions = (): Permission[] => {
  const permissionNames = ['用户管理', '组织管理', '角色管理', '权限管理', '数据备份', '数据恢复', '系统日志'];
  const permissionDescriptions = [
    '用户管理权限',
    '组织管理权限',
    '角色管理权限',
    '权限管理权限',
    '数据备份权限',
    '数据恢复权限',
    '系统日志权限'
  ];
  const permissionCodes = [
    'user:manage',
    'organization:manage',
    'role:manage',
    'permission:manage',
    'data:backup',
    'data:restore',
    'system:log'
  ];
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  const permissions: Permission[] = [];
  const totalPermissions = 20;
  
  for (let i = 1; i <= totalPermissions; i++) {
    const reverseIndex = totalPermissions - i + 1;
    const nameIndex = i % permissionNames.length;
    const descIndex = i % permissionDescriptions.length;
    const codeIndex = i % permissionCodes.length;
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const name = (permissionNames[nameIndex] || '权限') + (i > permissionNames.length ? i : '');
    const description = permissionDescriptions[descIndex] || '无描述';
    const code = (permissionCodes[codeIndex] || 'permission') + (i > permissionCodes.length ? ':' + i : '');
    const status = statuses[statusIndex];
    const permissionCode = generatePermissionCode(PERMISSION_PREFIX, reverseIndex);
    
    const roleCount = Math.floor(Math.random() * 10) + 1;
    
    permissions.push({
      id: i,
      code: code,
      permissionCode: permissionCode,
      name: name,
      description: description,
      status: status,
      roleCount: roleCount,
      updateTime: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
    });
  }
  
  return permissions;
};

const loading = ref(false);
const originalPermissions = ref<Permission[]>(generateRandomPermissions());
const selectedRowKeys = ref<(string | number)[]>([]);
const permissionModalVisible = ref(false);
const rolePermissionModalVisible = ref(false);
const isEditMode = ref(false);

const filterForm = reactive<FilterForm>({
  permissionCode: '',
  name: '',
  code: '',
  dateRange: null,
  status: ''
});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10
});

const currentPermission = reactive<PermissionForm>({
  id: null,
  code: '',
  permissionCode: '',
  name: '',
  description: '',
  status: 'active',
  roleCount: 0
});

const rolePermissionForm = reactive<RolePermissionForm>({
  roleId: '',
  permissionIds: []
});

const roles = ref<Role[]>([
  { id: 'ROL001', name: '管理员' },
  { id: 'ROL002', name: '运营人员' },
  { id: 'ROL003', name: '财务人员' },
  { id: 'ROL004', name: '客服人员' },
  { id: 'ROL005', name: '普通用户' }
]);

const columns = shallowRef([
  {
    title: '权限编码',
    dataIndex: 'permissionCode',
    key: 'permissionCode',
    width: 100
  },
  {
    title: '权限名称',
    dataIndex: 'name',
    key: 'name',
    width: 180
  },
  {
    title: '权限描述',
    dataIndex: 'description',
    key: 'description',
    width: 280
  },
  {
    title: '权限代码',
    dataIndex: 'code',
    key: 'code',
    width: 180
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 90
  },
  {
    title: '角色数量',
    dataIndex: 'roleCount',
    key: 'roleCount',
    width: 90
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
    width: 100,
    fixed: 'right'
  }
]);

const filteredPermissions = computed(() => {
  let result = [...originalPermissions.value];
  
  if (filterForm.permissionCode) {
    const permissionCodeKeyword = filterForm.permissionCode.toLowerCase();
    result = result.filter(permission => 
      permission.permissionCode.toLowerCase().includes(permissionCodeKeyword)
    );
  }
  
  if (filterForm.name) {
    const nameKeyword = filterForm.name.toLowerCase();
    result = result.filter(permission => 
      permission.name.toLowerCase().includes(nameKeyword)
    );
  }
  
  if (filterForm.code) {
    const codeKeyword = filterForm.code.toLowerCase();
    result = result.filter(permission => 
      permission.code.toLowerCase().includes(codeKeyword)
    );
  }
  
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const startDate = dayjs(filterForm.dateRange[0]);
    const endDate = dayjs(filterForm.dateRange[1]);
    result = result.filter(permission => {
      const permissionDate = dayjs(permission.updateTime.split(' ')[0]);
      return permissionDate.isAfter(startDate.subtract(1, 'day')) && permissionDate.isBefore(endDate.add(1, 'day'));
    });
  }
  
  if (filterForm.status) {
    result = result.filter(permission => permission.status === filterForm.status);
  }
  
  return result;
});

const paginatedPermissions = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredPermissions.value.slice(start, end);
});

const showTotal = (total: number) => `共 ${total} 条记录`;

const handleSearch = () => {
  pagination.current = 1;
  message.success(`搜索完成，共找到 ${filteredPermissions.value.length} 个权限`);
};

const handleReset = () => {
  Object.assign(filterForm, {
    permissionCode: '',
    name: '',
    code: '',
    dateRange: null,
    status: ''
  });
  pagination.current = 1;
  message.success('表单已重置，权限列表已恢复');
};

const onSelectChange = (keys: (string | number)[]) => {
  selectedRowKeys.value = keys;
};

const handleAddPermission = () => {
  isEditMode.value = false;
  
  let maxIndex = 0;
  originalPermissions.value.forEach(permission => {
    if (permission.permissionCode.startsWith(PERMISSION_PREFIX)) {
      const numberPart = permission.permissionCode.substring(PERMISSION_PREFIX.length);
      const index = parseInt(numberPart, 10);
      if (!isNaN(index) && index > maxIndex) {
        maxIndex = index;
      }
    }
  });
  
  const newIndex = maxIndex + 1;
  const newPermissionCode = generatePermissionCode(PERMISSION_PREFIX, newIndex);
  
  let defaultCode = 'permission:manage';
  let counter = 1;
  
  while (originalPermissions.value.some(permission => permission.code === defaultCode)) {
    defaultCode = `permission:manage_${counter}`;
    counter++;
  }
  
  Object.assign(currentPermission, {
    id: null,
    code: defaultCode,
    permissionCode: newPermissionCode,
    name: '',
    description: '',
    status: 'active',
    roleCount: 0
  });
  
  permissionModalVisible.value = true;
};

const handleEditPermission = (record: Permission) => {
  isEditMode.value = true;
  Object.assign(currentPermission, {
    id: record.id,
    code: record.code,
    permissionCode: record.permissionCode,
    name: record.name,
    description: record.description,
    status: record.status,
    roleCount: record.roleCount
  });
  permissionModalVisible.value = true;
};

const handleSavePermission = async () => {
  if (!currentPermission.name) {
    message.error('请输入权限名称');
    return;
  }
  
  try {
    if (isEditMode.value && currentPermission.id !== null) {
      await updatePermission(currentPermission.id, {
        code: currentPermission.code,
        permissionCode: currentPermission.permissionCode,
        name: currentPermission.name,
        description: currentPermission.description,
        status: currentPermission.status
      });
    } else {
      await createPermission({
        code: currentPermission.code,
        permissionCode: currentPermission.permissionCode,
        name: currentPermission.name,
        description: currentPermission.description,
        status: currentPermission.status
      });
    }
    
    closePermissionModal();
  } catch (error) {
    console.error('保存权限失败:', error);
    message.error('保存权限失败，请稍后重试');
  }
};

const closePermissionModal = () => {
  permissionModalVisible.value = false;
};

const handleDeletePermission = async (id: number) => {
  await deletePermission(id);
};

const handleDeleteSelected = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的权限');
    return;
  }
  
  const deleteCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      await deletePermission(id as number);
    }
    
    selectedRowKeys.value = [];
    message.success(`删除 ${deleteCount} 个权限`);
  } catch (error) {
    console.error('批量删除权限失败:', error);
    message.error('批量删除权限失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handleBatchActivate = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要激活的权限');
    return;
  }
  
  const activateCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      const permission = originalPermissions.value.find(p => p.id === id);
      if (permission) {
        await updatePermission(id as number, {
          ...permission,
          status: 'active'
        });
      }
    }
    
    selectedRowKeys.value = [];
    message.success(`激活 ${activateCount} 个权限`);
  } catch (error) {
    console.error('批量激活权限失败:', error);
    message.error('批量激活权限失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handleBatchDeactivate = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要停用的权限');
    return;
  }
  
  const deactivateCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    for (const id of selectedRowKeys.value) {
      const permission = originalPermissions.value.find(p => p.id === id);
      if (permission) {
        await updatePermission(id as number, {
          ...permission,
          status: 'inactive'
        });
      }
    }
    
    selectedRowKeys.value = [];
    message.success(`停用 ${deactivateCount} 个权限`);
  } catch (error) {
    console.error('批量停用权限失败:', error);
    message.error('批量停用权限失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const createPermission = async (permission: Omit<Permission, 'id' | 'roleCount' | 'updateTime'>) => {
  try {
    loading.value = true;
    const newPermission: Permission = {
      ...permission,
      id: originalPermissions.value.length + 1,
      roleCount: 0,
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    originalPermissions.value.push(newPermission);
    message.success('权限创建成功');
  } catch (error) {
    console.error('创建权限失败:', error);
    message.error('创建权限失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const updatePermission = async (id: number, permission: Partial<Permission>) => {
  try {
    loading.value = true;
    const index = originalPermissions.value.findIndex(p => p.id === id);
    if (index !== -1) {
      originalPermissions.value[index] = {
        ...originalPermissions.value[index],
        ...permission,
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      message.success('权限更新成功');
    }
  } catch (error) {
    console.error('更新权限失败:', error);
    message.error('更新权限失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const deletePermission = async (id: number) => {
  try {
    loading.value = true;
    originalPermissions.value = originalPermissions.value.filter(p => p.id !== id);
    message.success('权限删除成功');
  } catch (error) {
    console.error('删除权限失败:', error);
    message.error('删除权限失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const togglePermissionStatus = async (record: Permission) => {
  const newStatus = record.status === 'active' ? 'inactive' : 'active';
  
  try {
    await updatePermission(record.id, {
      ...record,
      status: newStatus
    });
  } catch (error) {
    console.error('切换权限状态失败:', error);
    message.error('切换权限状态失败，请稍后重试');
  }
};

const handleRolePermission = () => {
  Object.assign(rolePermissionForm, {
    roleId: '',
    permissionIds: []
  });
  rolePermissionModalVisible.value = true;
};

const closeRolePermissionModal = () => {
  rolePermissionModalVisible.value = false;
};

const handleSaveRolePermission = async () => {
  if (!rolePermissionForm.roleId) {
    message.error('请选择角色');
    return;
  }
  
  if (rolePermissionForm.permissionIds.length === 0) {
    message.error('请至少选择一个权限');
    return;
  }
  
  try {
    await assignRolePermissions(rolePermissionForm.roleId, rolePermissionForm.permissionIds);
    closeRolePermissionModal();
  } catch (error) {
    console.error('保存角色赋权失败:', error);
    message.error('保存角色赋权失败，请稍后重试');
  }
};

const assignRolePermissions = async (_roleId: string, _permissionIds: (string | number)[]) => {
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('角色赋权成功');
  } catch (error) {
    console.error('角色赋权失败:', error);
    message.error('角色赋权失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const generatePermissionCodeFromInput = () => {
  if (isEditMode.value) {
    return;
  }
  
  if (currentPermission.name) {
    let cleanedName = currentPermission.name.replace(/[^\w]/g, ' ');
    let words = cleanedName.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length > 0) {
      let codeParts = words.map(word => {
        if (/[\u4e00-\u9fa5]/.test(word)) {
          return '';
        } else {
          return word.toLowerCase();
        }
      }).filter(part => part.length > 0);
      
      let baseCode: string = codeParts.length > 0 ? (codeParts[0] || 'permission') : 'permission';
      if (codeParts.length > 1 && codeParts[1]) {
        baseCode += ':' + codeParts[1];
      } else {
        baseCode += ':manage';
      }
      
      let finalCode = baseCode;
      let counter = 1;
      
      while (originalPermissions.value.some(permission => permission.code === finalCode)) {
        finalCode = `${baseCode}_${counter}`;
        counter++;
      }
      
      currentPermission.code = finalCode;
    } else {
      let defaultCode = 'permission:manage';
      let counter = 1;
      
      while (originalPermissions.value.some(permission => permission.code === defaultCode)) {
        defaultCode = `permission:manage_${counter}`;
        counter++;
      }
      
      currentPermission.code = defaultCode;
    }
  } else {
    let defaultCode = 'permission:manage';
    let counter = 1;
    
    while (originalPermissions.value.some(permission => permission.code === defaultCode)) {
      defaultCode = `permission:manage_${counter}`;
      counter++;
    }
    
    currentPermission.code = defaultCode;
  }
};

onMounted(() => {
  // 初始化完成
});
</script>

<style scoped>
.permission-container {
  width: 100%;
  padding: 1.5%;
}

.permission-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.permission-card:hover {
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

.permission-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.permission-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.permission-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.permission-table {
  border-radius: 4px;
}

.permission-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.permission-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.permission-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.permission-detail-modal {
  border-radius: 8px;
}

.permission-form {
  padding: 20px 0;
}

.permission-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.role-permission-form {
  padding: 20px 0;
}

.role-permission-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.permission-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.permission-tree :deep(.ant-checkbox-group) {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px 16px;
}

.permission-tree :deep(.ant-checkbox) {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  word-break: break-word;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .permission-page {
    padding: 20px;
  }
  
  .permission-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .permission-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .permission-page {
    padding: 12px;
  }
  
  .permission-filter {
    padding: 12px;
  }
  
  .permission-actions {
    flex-direction: column;
  }
  
  .permission-actions :deep(.ant-btn) {
    width: 100%;
    margin-left: 0 !important;
  }
  
  .permission-tree :deep(.ant-checkbox-group) {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 576px) {
  .permission-page {
    padding: 12px;
  }
  
  .permission-pagination {
    justify-content: center;
  }
  
  .permission-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .permission-detail-modal {
    width: 90% !important;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .permission-tree :deep(.ant-checkbox-group) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>