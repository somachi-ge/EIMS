<template>
  <a-config-provider :locale="zhCN">
    <div class="user-container">
      <div class="user-page">
        <!-- 用户管理卡片 -->
        <a-card class="user-card">
          <div class="card-header">
            <div class="header-right">
            </div>
          </div>
          
          <!-- 搜索过滤区域 -->
          <div class="user-filter" style="overflow-x: auto;">
            <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.id" placeholder="请输入工号" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.username" placeholder="请输入用户名" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.name" placeholder="请输入姓名" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 140px;">
                <a-input v-model:value="filterForm.phone" placeholder="请输入手机号码" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1.5; min-width: 180px;">
                <a-input v-model:value="filterForm.email" placeholder="请输入电子邮箱地址" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 0.8; min-width: 100px;">
                <a-select v-model:value="filterForm.status" placeholder="全部状态" allow-clear style="width: 100%;">
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
          <div class="user-actions">
            <a-button type="primary" @click="handleAdd">
              添加用户
            </a-button>
            <a-button type="primary" style="margin-left: 8px;" @click="handleBatchExport">批量导出</a-button>
            <a-button type="primary" style="margin-left: 8px;" @click="handleBatchImport">批量导入</a-button>
            <a-button type="primary" style="margin-left: 8px;" @click="handleTemplateDownload">模板下载</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #52c41a; color: white;" @click="handleBatchActivate">批量激活</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #fa8c16; color: white;" @click="handleBatchDeactivate">批量停用</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f; color: white;" @click="handleBatchDelete">批量删除</a-button>
          </div>
          
          <!-- 用户列表 -->
          <div class="user-table-container">
            <a-table
              :columns="columns"
              :data-source="paginatedUsers"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="false"
              size="small"
              class="user-table"
              row-key="dbId"
              :scroll="{ x: 900 }"
              :loading="loading"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === 'active' ? 'green' : 'orange'" :bordered="false" @click="toggleUserStatus(record)" style="cursor: pointer;">
                    {{ record.status === 'active' ? '已激活' : '未激活' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <div style="display: flex; gap: 8px;">
                    <a-tag color="blue" :bordered="false" @click="handleEdit(record)" style="cursor: pointer;">编辑</a-tag>
                    <a-tag color="red" :bordered="false" @click="handleDelete(record.dbId)" style="cursor: pointer;">删除</a-tag>
                  </div>
                </template>
              </template>
            </a-table>
            
            <a-pagination
              v-model:current="pagination.current"
              v-model:pageSize="pagination.pageSize"
              :total="filteredUsers.length"
              :showSizeChanger="true"
              :pageSizeOptions="PAGE_SIZE_OPTIONS"
              :showTotal="showTotal"
              :showQuickJumper="true"
              class="user-pagination"
              :locale="PAGINATION_LOCALE"
            />
          </div>
        </a-card>
        
        <!-- 添加/编辑用户模态框 -->
        <a-modal
          v-model:open="userModalVisible"
          :title="isEditMode ? '编辑用户' : '添加用户'"
          width="600px"
          :ok-text="'保存'"
          :cancel-text="'取消'"
          @ok="handleSaveUser"
          @cancel="closeUserModal"
          :body-style="{ maxHeight: '400px', overflowY: 'auto' }"
          class="user-detail-modal"
        >
          <a-form :model="userForm" layout="vertical">
            <a-form-item label="员工工号" :rules="[{ required: true, message: '请输入员工工号' }]">
              <a-input v-model:value="userForm.id" placeholder="请输入员工工号" style="height: 40px;" @keyup.enter="handleSaveUser">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="用户名" :rules="[{ required: true, message: '请输入您的用户名' }]">
              <a-input v-model:value="userForm.username" placeholder="请输入您的用户名" style="height: 40px;" @keyup.enter="handleSaveUser">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="姓名" :rules="[{ required: true, message: '请输入您的姓名' }]">
              <a-input v-model:value="userForm.name" placeholder="请输入您的姓名" style="height: 40px;" @keyup.enter="handleSaveUser">
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="手机号码" :rules="[{ required: true, message: '请输入您的手机号码' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }]">
              <a-input v-model:value="userForm.phone" placeholder="请输入您的手机号码" style="height: 40px;" @keyup.enter="handleSaveUser">
                <template #prefix>
                  <PhoneOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="电子邮箱" :rules="[{ required: true, message: '请输入您的电子邮箱地址' }, { type: 'email', message: '请输入有效的电子邮箱地址' }]">
              <a-input v-model:value="userForm.email" placeholder="请输入您的电子邮箱地址" style="height: 40px;" @keyup.enter="handleSaveUser">
                <template #prefix>
                  <MailOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="登录密码" :rules="[{ required: true, message: '请输入登录密码（8-20位，包含字母和数字并区分大小写）' }]">
              <a-input-password v-model:value="userForm.password" placeholder="请输入登录密码（8-20位，包含字母和数字并区分大小写）" style="height: 40px;" @keyup.enter="handleSaveUser">
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item label="状态" :rules="[{ required: true, message: '请选择状态' }]">
              <a-radio-group v-model:value="userForm.status">
                <a-radio value="inactive">未激活</a-radio>
                <a-radio value="active">已激活</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, shallowRef } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined, PhoneOutlined, MailOutlined, LockOutlined } from '@ant-design/icons-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

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

// 类型定义
interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  created?: string;
  dbId: number;
}

interface FilterForm {
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  status: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

interface UserForm {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  password: string;
}

// 状态管理
const loading = ref(false);
const users = ref<User[]>([]);
const selectedRowKeys = ref<(string | number)[]>([]);
const userModalVisible = ref(false);
const isEditMode = ref(false);
const currentUserId = ref<number | null>(null);

// 表单数据
const filterForm = reactive<FilterForm>({
  id: '',
  username: '',
  name: '',
  phone: '',
  email: '',
  status: ''
});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0
});

const userForm = reactive<UserForm>({
  id: '',
  username: '',
  name: '',
  email: '',
  phone: '',
  status: 'inactive',
  password: ''
});

// 表格列定义（使用 shallowRef 优化性能）
const columns = shallowRef([
  {
    title: '员工工号',
    dataIndex: 'id',
    key: 'id',
    width: 150
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 150
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    width: 150
  },
  {
    title: '电子邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'created',
    key: 'created',
    width: 140
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right'
  }
]);

// 生成随机模拟数据
const generateMockUsers = (): User[] => {
  const users: User[] = [];
  const names = ['管理员', '张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '王十一'];
  
  for (let i = 1; i <= 10; i++) {
    const name = names[i - 1];
    const username = i === 1 ? 'admin' : `user${i - 1}`;
    const status = i % 2 === 0 ? 'inactive' : 'active' as 'active' | 'inactive';
    const phone = `1380013800${i}`;
    const email = `${username}@example.com`;
    
    // 生成随机日期，范围为过去30天
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const created = date.toISOString().replace('T', ' ').substring(0, 19);
    
    users.push({
      dbId: i,
      id: `EMP${i.toString().padStart(3, '0')}`,
      username,
      name,
      phone,
      email,
      status,
      created
    });
  }
  
  return users;
};

// 模拟用户数据
const mockUsers: User[] = generateMockUsers();
// 原始用户数据（用于重置）
const originalUsers = ref<User[]>([...mockUsers]);

// 计算属性：过滤后的用户列表
const filteredUsers = computed(() => {
  let result = [...originalUsers.value];
  
  // 按工号过滤
  if (filterForm.id) {
    const keyword = filterForm.id.toLowerCase();
    result = result.filter(user => 
      user.id.toLowerCase().includes(keyword)
    );
  }
  
  // 按用户名过滤
  if (filterForm.username) {
    const keyword = filterForm.username.toLowerCase();
    result = result.filter(user => 
      user.username.toLowerCase().includes(keyword)
    );
  }
  
  // 按姓名过滤
  if (filterForm.name) {
    const keyword = filterForm.name.toLowerCase();
    result = result.filter(user => 
      user.name.toLowerCase().includes(keyword)
    );
  }
  
  // 按手机号码过滤
  if (filterForm.phone) {
    const keyword = filterForm.phone.toLowerCase();
    result = result.filter(user => 
      user.phone.toLowerCase().includes(keyword)
    );
  }
  
  // 按邮箱过滤
  if (filterForm.email) {
    const email = filterForm.email.toLowerCase();
    result = result.filter(user => 
      user.email.toLowerCase().includes(email)
    );
  }
  
  // 按状态过滤
  if (filterForm.status) {
    result = result.filter(user => 
      user.status === filterForm.status
    );
  }
  
  return result;
});

// 计算属性：分页后的用户列表
const paginatedUsers = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredUsers.value.slice(start, end);
});

// 显示总数
const showTotal = (total: number) => `共 ${total} 条记录`;

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true;
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    // 使用模拟数据
    users.value = [...originalUsers.value];
    pagination.total = users.value.length;
  } catch (error) {
    message.error('获取用户列表失败');
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取用户列表
onMounted(() => {
  fetchUsers();
});

/**
 * 搜索按钮点击事件
 */
const handleSearch = async () => {
  try {
    loading.value = true;
    // 重置到第一页
    pagination.current = 1;
    // 过滤数据会通过计算属性自动更新
    message.success(`搜索完成，共找到 ${filteredUsers.value.length} 条用户记录`);
  } catch (error) {
    message.error('搜索失败');
    console.error('Error searching users:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 重置按钮点击事件
 */
const handleReset = async () => {
  // 重置表单
  Object.assign(filterForm, {
    id: '',
    username: '',
    name: '',
    phone: '',
    email: '',
    status: ''
  });
  
  // 重置到第一页
  pagination.current = 1;
  
  message.success('表单已重置，用户列表已恢复');
};

/**
 * 选择行变化事件
 * @param {Array} keys 选中的行 keys
 */
const onSelectChange = (keys: (string | number)[]) => {
  selectedRowKeys.value = keys;
};

/**
 * 打开添加用户模态框
 */
const handleAdd = () => {
  isEditMode.value = false;
  currentUserId.value = null;
  
  // 重置表单
  Object.assign(userForm, {
    id: '',
    username: '',
    name: '',
    email: '',
    phone: '',
    status: 'inactive',
    password: ''
  });
  
  userModalVisible.value = true;
};

/**
 * 打开编辑用户模态框
 * @param {Object} record 用户记录
 */
const handleEdit = (record: User) => {
  isEditMode.value = true;
  currentUserId.value = record.dbId;
  
  // 填充表单数据
  Object.assign(userForm, {
    id: record.id,
    username: record.username,
    name: record.name,
    email: record.email,
    phone: record.phone,
    status: record.status,
    password: ''
  });
  
  userModalVisible.value = true;
};

/**
 * 关闭用户模态框
 */
const closeUserModal = () => {
  userModalVisible.value = false;
  currentUserId.value = null;
};

/**
 * 验证用户表单
 * @returns {boolean} 是否验证通过
 */
const validateUserForm = (): boolean => {
  // 验证必选项
  if (!userForm.id) {
    message.error('请输入员工工号');
    return false;
  }
  
  if (!userForm.username) {
    message.error('请输入用户名');
    return false;
  }
  
  if (!userForm.name) {
    message.error('请输入姓名');
    return false;
  }
  
  if (!userForm.phone) {
    message.error('请输入手机号码');
    return false;
  }
  
  // 验证手机号码格式
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(userForm.phone)) {
    message.error('请输入有效的手机号码');
    return false;
  }
  
  if (!userForm.email) {
    message.error('请输入电子邮箱地址');
    return false;
  }
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userForm.email)) {
    message.error('请输入有效的电子邮箱地址');
    return false;
  }
  
  if (!userForm.status) {
    message.error('请选择状态');
    return false;
  }
  
  // 验证密码（新增和编辑用户时都需要）
  if (!userForm.password) {
    message.error('请输入登录密码');
    return false;
  }
  
  // 验证密码格式
  if (userForm.password.length < 8) {
    message.error('密码长度不能少于8位');
    return false;
  }
  
  // 验证密码复杂度（包含至少一个字母和一个数字）
  if (!/[a-zA-Z]/.test(userForm.password) || !/\d/.test(userForm.password)) {
    message.error('密码应包含至少一个字母和一个数字');
    return false;
  }
  
  return true;
};

/**
 * 保存用户
 */
const handleSaveUser = async () => {
  // 验证表单
  if (!validateUserForm()) {
    return;
  }
  
  try {
    loading.value = true;
    
    if (isEditMode.value && currentUserId.value !== null) {
      // 编辑用户
      const index = originalUsers.value.findIndex(user => user.dbId === currentUserId.value);
      if (index !== -1) {
        originalUsers.value[index] = {
          ...originalUsers.value[index],
          id: userForm.id,
          username: userForm.username,
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          status: userForm.status
        };
        message.success('用户编辑成功');
      }
    } else {
      // 添加用户
      const newUser: User = {
        dbId: originalUsers.value.length + 1,
        id: userForm.id,
        username: userForm.username,
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        status: userForm.status,
        created: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      originalUsers.value.push(newUser);
      message.success('用户添加成功');
    }
    
    // 关闭模态框
    userModalVisible.value = false;
    currentUserId.value = null;
  } catch (error) {
    message.error('保存用户失败');
    console.error('Error saving user:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 删除用户
 * @param {number} id 用户 ID
 */
const handleDelete = async (id: number) => {
  try {
    loading.value = true;
    // 从原始数据中删除用户
    originalUsers.value = originalUsers.value.filter(user => user.dbId !== id);
    message.success(`删除用户 ID: ${id}`);
  } catch (error) {
    message.error('删除用户失败');
    console.error('Error deleting user:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 批量删除用户
 */
const handleBatchDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的用户');
    return;
  }
  
  // 保存删除的数量
  const deleteCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    // 从原始数据中删除用户
    originalUsers.value = originalUsers.value.filter(user => !selectedRowKeys.value.includes(user.dbId));
    
    // 清空选中的行
    selectedRowKeys.value = [];
    
    // 显示成功提示
    message.success(`删除 ${deleteCount} 个用户`);
  } catch (error) {
    message.error('删除用户失败');
    console.error('Error deleting users:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 批量激活用户
 */
const handleBatchActivate = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要激活的用户');
    return;
  }
  
  // 保存激活的数量
  const activateCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    // 更新用户状态
    originalUsers.value = originalUsers.value.map(user => {
      if (selectedRowKeys.value.includes(user.dbId)) {
        return { ...user, status: 'active' };
      }
      return user;
    });
    
    // 清空选中的行
    selectedRowKeys.value = [];
    
    // 显示成功提示
    message.success(`激活 ${activateCount} 个用户`);
  } catch (error) {
    message.error('激活用户失败');
    console.error('Error activating users:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 批量停用用户
 */
const handleBatchDeactivate = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要停用的用户');
    return;
  }
  
  // 保存停用的数量
  const deactivateCount = selectedRowKeys.value.length;
  
  try {
    loading.value = true;
    // 更新用户状态
    originalUsers.value = originalUsers.value.map(user => {
      if (selectedRowKeys.value.includes(user.dbId)) {
        return { ...user, status: 'inactive' };
      }
      return user;
    });
    
    // 清空选中的行
    selectedRowKeys.value = [];
    
    // 显示成功提示
    message.success(`停用 ${deactivateCount} 个用户`);
  } catch (error) {
    message.error('停用用户失败');
    console.error('Error deactivating users:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 批量导入用户
 */
const handleBatchImport = () => {
  // 创建文件输入元素
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  
  // 监听文件选择事件
  input.onchange = async (e) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    const reader = new FileReader();
    
    // 读取文件内容
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (!result) return;
      
      try {
        loading.value = true;
        // 解析CSV内容
        const lines = result.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
          message.error('CSV文件格式错误，至少需要包含表头和一行数据');
          return;
        }
        
        // 跳过表头，从第二行开始处理数据
        const dataLines = lines.slice(1);
        const importedUsers: User[] = [];
        const errors: string[] = [];
        
        // 处理每一行数据
        dataLines.forEach((line, index) => {
          const fields = line.split(',');
          if (fields.length < 6) {
            errors.push(`第${index + 2}行：数据字段不足`);
            return;
          }
          
          const [username, name, phone, email, password, status] = fields;
          
          // 验证必填字段
          if (!username || !name || !phone || !email || !password || !status) {
            errors.push(`第${index + 2}行：存在空字段`);
            return;
          }
          
          // 验证手机号码格式
          const phoneRegex = /^1[3-9]\d{9}$/;
          if (!phoneRegex.test(phone)) {
            errors.push(`第${index + 2}行：手机号码格式错误`);
            return;
          }
          
          // 验证邮箱格式
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            errors.push(`第${index + 2}行：邮箱格式错误`);
            return;
          }
          
          // 验证密码格式
          if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
            errors.push(`第${index + 2}行：密码格式错误（至少8位，包含字母和数字）`);
            return;
          }
          
          // 验证状态值
          if (!['active', 'inactive'].includes(status)) {
            errors.push(`第${index + 2}行：状态值错误（应为active或inactive）`);
            return;
          }
          
          // 生成新工号
          const maxId = Math.max(...originalUsers.value.map(user => {
            const numPart = parseInt(user.id.toString().replace('EMP', ''));
            return isNaN(numPart) ? 0 : numPart;
          }));
          const newIdNum = maxId + 1 + importedUsers.length;
          const newId = `EMP${newIdNum.toString().padStart(3, '0')}`;
          
          // 生成创建时间
          const now = new Date();
          const formattedDate = now.toISOString().slice(0, 10);
          const formattedTime = now.toTimeString().slice(0, 5);
          const created = `${formattedDate} ${formattedTime}`;
          
          // 添加到导入用户列表
          importedUsers.push({
            dbId: originalUsers.value.length + 1 + importedUsers.length,
            id: newId,
            username,
            name,
            phone,
            email,
            status: status as 'active' | 'inactive',
            created
          });
        });
        
        // 显示错误信息
        if (errors.length > 0) {
          message.error(`导入失败，发现${errors.length}个错误：\n${errors.join('\n')}`);
          return;
        }
        
        // 导入成功，添加到用户列表
        if (importedUsers.length > 0) {
          try {
            // 添加到原始数据
            originalUsers.value.push(...importedUsers);
            
            // 显示成功提示
            message.success(`批量导入成功，共导入${importedUsers.length}个用户`);
          } catch (error) {
            message.error('导入用户失败');
            console.error('Error importing users:', error);
          }
        } else {
          message.warning('没有可导入的有效数据');
        }
        
      } catch (error) {
        message.error('导入失败：' + (error as Error).message);
      } finally {
        loading.value = false;
      }
    };
    
    // 读取文件为文本
    reader.readAsText(file as Blob, 'utf-8');
  };
  
  // 触发文件选择对话框
  input.click();
};

/**
 * 下载导入模板
 */
const handleTemplateDownload = () => {
  // 定义CSV头部字段
  const headers = ['用户名', '姓名', '手机号码', '电子邮箱', '登录密码', '状态'];
  
  // 定义CSV内容
  const csvContent = [
    headers.join(','), // 头部
    ['user1', '张三', '13800138001', 'user1@example.com', 'Password123', 'active'], // 示例数据
    ['user2', '李四', '13800138002', 'user2@example.com', 'Password123', 'inactive'] // 示例数据
  ].join('\n');
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // 设置链接属性
  link.setAttribute('href', url);
  link.setAttribute('download', `用户导入模板_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  // 添加到DOM并触发点击
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 显示成功提示
  message.success('模板下载成功');
};

/**
 * 批量导出用户
 */
const handleBatchExport = () => {
  // 定义CSV头部字段
  const headers = ['员工工号', '用户名', '姓名', '手机号码', '电子邮箱', '状态', '创建时间'];
  
  // 准备导出数据
  const exportData = filteredUsers.value.map(user => [
    user.id,
    user.username,
    user.name,
    user.phone,
    user.email,
    user.status === 'active' ? '已激活' : '未激活',
    user.created
  ]);
  
  // 生成CSV内容
  const csvContent = [
    headers.join(','), // 头部
    ...exportData.map(row => row.join(',')) // 数据行
  ].join('\n');
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // 设置链接属性
  link.setAttribute('href', url);
  link.setAttribute('download', `用户列表导出_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  // 添加到DOM并触发点击
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 显示成功提示
  message.success(`导出成功，共导出 ${exportData.length} 条用户记录`);
};

/**
 * 切换用户状态
 * @param {Object} record 用户记录
 */
const toggleUserStatus = async (record: User) => {
  try {
    loading.value = true;
    // 切换状态
    const newStatus = record.status === 'active' ? 'inactive' : 'active';
    
    // 更新用户状态
    const index = originalUsers.value.findIndex(user => user.dbId === record.dbId);
    if (index !== -1) {
      originalUsers.value[index].status = newStatus;
    }
    
    // 显示成功提示
    message.success(`用户状态已切换为${newStatus === 'active' ? '已激活' : '未激活'}`);
  } catch (error) {
    message.error('切换用户状态失败');
    console.error('Error toggling user status:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.user-container {
  width: 100%;
  padding: 1.5%;
}

.user-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.user-card:hover {
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

.user-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.user-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.user-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.user-table {
  border-radius: 4px;
}

.user-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.user-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.user-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.user-detail-modal {
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .user-page {
    padding: 20px;
  }
  
  .user-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .user-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .user-page {
    padding: 12px;
  }
  
  .user-filter {
    padding: 12px;
  }
  
  .user-actions {
    flex-direction: column;
  }
  
  .user-actions :deep(.ant-btn) {
    width: 100%;
    margin-left: 0 !important;
  }
}

@media (max-width: 576px) {
  .user-page {
    padding: 12px;
  }
  
  .user-pagination {
    justify-content: center;
  }
  
  .user-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .user-detail-modal {
    width: 90% !important;
  }
  
  .card-title {
    font-size: 16px;
  }
}
</style>