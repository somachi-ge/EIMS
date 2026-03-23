<template>
  <MainLayout>
    <a-config-provider :locale="zhCN">
      <div class="contacts-container">
        <a-card class="contacts-card">
          
          <div class="contacts-filter">
            <a-form layout="inline" :model="filterForm" @keyup.enter="handleSearch">
              <a-form-item style="width: 190px;">
                <a-input v-model:value="filterForm.id" placeholder="请输入工号" allow-clear />
              </a-form-item>
              <a-form-item style="width: 190px;">
                <a-input v-model:value="filterForm.name" placeholder="请输入姓名" allow-clear />
              </a-form-item>
              <a-form-item style="width: 216px;">
                <a-input v-model:value="filterForm.phone" placeholder="请输入手机号码" allow-clear />
              </a-form-item>
              <a-form-item style="width: 120px;">
                <a-select v-model:value="filterForm.company" placeholder="请选择公司" allow-clear>
                  <a-select-option v-for="company in OPTIONS.companies" :key="company" :value="company">{{ company }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 120px;">
                <a-select v-model:value="filterForm.department" placeholder="请选择部门" allow-clear>
                  <a-select-option v-for="dept in OPTIONS.departments" :key="dept" :value="dept">{{ dept }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item style="width: 120px;">
                <a-select v-model:value="filterForm.position" placeholder="请选择岗位" allow-clear>
                  <a-select-option v-for="pos in OPTIONS.positions" :key="pos" :value="pos">{{ pos }}</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item>
                <a-button type="primary" @click="handleSearch" style="width: 80px;">搜索</a-button>
              </a-form-item>
              <a-form-item>
                <a-button @click="handleReset" style="width: 80px;">重置</a-button>
              </a-form-item>
            </a-form>
          </div>
          
          <div class="divider"></div>
          
          <div class="contacts-list">
            <a-table
              :columns="columns"
              :data-source="paginatedContacts"
              :pagination="false"
              size="small"
              class="contacts-table"
              row-key="id"
              :loading="loading"
            >
            </a-table>
            
            <div class="pagination-container">
              <a-pagination
                v-model:current="pagination.current"
                v-model:pageSize="pagination.pageSize"
                :total="pagination.total"
                :showSizeChanger="true"
                :pageSizeOptions="['10', '30', '50']"
                :showTotal="(total: number) => `共 ${total} 条记录`"
                showQuickJumper
                size="default"
              />
            </div>
          </div>
        </a-card>
      </div>
    </a-config-provider>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import MainLayout from '../../components/layout/MainLayout.vue';

const OPTIONS = {
  companies: ['全部公司', '科技有限公司', '贸易公司', '制造企业', '金融服务公司', '互联网公司'],
  departments: ['全部部门', '技术部', '市场部', '销售部', '人力资源部', '财务部', '运营部'],
  positions: ['全部岗位', '工程师', '经理', '主管', '专员', '顾问', '分析师'],
  names: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
};

const MOCK_DATA_COUNT = 80;

interface Contact {
  id: number;
  username: string;
  employeeId?: string;
  employee_id?: string;
  name: string;
  email: string;
  phone: string;
  status?: number;
  enterprise_id?: number;
  department_id?: number;
  position_id?: number;
  created_at?: string;
  updated_at?: string;
  company?: string;
  department?: string;
  position?: string;
}

interface FilterForm {
  id: string;
  name: string;
  company: string;
  department: string;
  position: string;
  phone: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

const loading = ref(false);
const allContacts = ref<Contact[]>([]);
const filteredContacts = ref<Contact[]>([]);

const generateMockContacts = (): Contact[] => {
  const contacts: Contact[] = [];
  
  for (let i = 1; i <= MOCK_DATA_COUNT; i++) {
    // 从索引1开始，跳过第一个元素（全部公司、全部部门、全部岗位）
    const company = OPTIONS.companies[Math.floor(Math.random() * (OPTIONS.companies.length - 1)) + 1];
    const department = OPTIONS.departments[Math.floor(Math.random() * (OPTIONS.departments.length - 1)) + 1];
    const position = OPTIONS.positions[Math.floor(Math.random() * (OPTIONS.positions.length - 1)) + 1];
    const name = OPTIONS.names[Math.floor(Math.random() * OPTIONS.names.length)] + i;
    const username = `user${i}`;
    const employeeId = `EMP${String(i).padStart(4, '0')}`;
    const phone = `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
    const email = `${name.toLowerCase()}@example.com`;
    
    contacts.push({
      id: i,
      username,
      employeeId,
      name,
      email,
      phone,
      company,
      department,
      position
    });
  }
  
  return contacts;
};

const filterForm = reactive<FilterForm>({
  id: '',
  name: '',
  company: '全部公司',
  department: '全部部门',
  position: '全部岗位',
  phone: ''
});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0
});

const columns = [
  {
    title: '员工工号',
    key: 'employeeId',
    width: 100,
    customRender: ({ record }: { record: Contact }) => {
      return record.employeeId || record.employee_id || record.username;
    }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: '公司',
    dataIndex: 'company',
    key: 'company',
    width: 150
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 120
  },
  {
    title: '岗位',
    dataIndex: 'position',
    key: 'position',
    width: 120
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
  }
];

const paginatedContacts = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredContacts.value.slice(start, end);
});

const fetchContacts = async () => {
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    allContacts.value = generateMockContacts();
    filteredContacts.value = [...allContacts.value];
    pagination.total = filteredContacts.value.length;
  } catch (error) {
    message.error('获取联系人列表失败');
    console.error('Error fetching contacts:', error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = (contacts: Contact[]): Contact[] => {
  return contacts.filter(contact => {
    if (filterForm.id) {
      const keyword = filterForm.id.toLowerCase();
      const employeeId = (contact.employeeId || contact.employee_id || contact.username || '').toLowerCase();
      if (!employeeId.includes(keyword)) return false;
    }
    
    if (filterForm.name) {
      const keyword = filterForm.name.toLowerCase();
      if (!contact.name.toLowerCase().includes(keyword)) return false;
    }
    
    if (filterForm.phone) {
      const keyword = filterForm.phone.toLowerCase();
      if (!contact.phone.toLowerCase().includes(keyword)) return false;
    }
    
    if (filterForm.company && filterForm.company !== '全部公司' && contact.company !== filterForm.company) {
      return false;
    }
    
    if (filterForm.department && filterForm.department !== '全部部门' && contact.department !== filterForm.department) {
      return false;
    }
    
    if (filterForm.position && filterForm.position !== '全部岗位' && contact.position !== filterForm.position) {
      return false;
    }
    
    return true;
  });
};

const handleSearch = async () => {
  loading.value = true;
  try {
    const results = applyFilters(allContacts.value);
    filteredContacts.value = results;
    pagination.total = results.length;
    pagination.current = 1;
    message.success(`搜索完成，共找到 ${results.length} 条联系人记录`);
  } catch (error) {
    message.error('搜索失败');
    console.error('Error searching contacts:', error);
  } finally {
    loading.value = false;
  }
};

const handleReset = async () => {
  Object.assign(filterForm, {
    id: '',
    name: '',
    company: '全部公司',
    department: '全部部门',
    position: '全部岗位',
    phone: ''
  });
  
  pagination.current = 1;
  filteredContacts.value = [...allContacts.value];
  pagination.total = filteredContacts.value.length;
  message.success('表单已重置，联系人列表已恢复');
};

onMounted(() => {
  fetchContacts();
});
</script>

<style scoped>
.contacts-container {
  width: 100%;
  padding: 1.5%;
}

.contacts-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.contacts-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.divider {
  height: 1px;
  background-color: #d9d9d9;
  margin-bottom: 20px;
}

.contacts-list {
  min-height: 400px;
}

.contacts-table {
  border-radius: 4px;
}

.contacts-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.contacts-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}

@media (max-width: 1200px) {
  .contacts-filter :deep(.ant-form-item) {
    margin-bottom: 8px;
  }
  
  .contacts-filter {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .contacts-container {
    padding: 16px;
  }
  
  .contacts-filter {
    padding: 12px;
  }
  
  .contacts-filter :deep(.ant-form-inline) {
    flex-wrap: wrap;
  }
  
  .contacts-filter :deep(.ant-form-item) {
    margin-right: 8px;
    margin-bottom: 8px;
    width: calc(50% - 8px);
  }
  
  .contacts-filter :deep(.ant-form-item:nth-child(7)),
  .contacts-filter :deep(.ant-form-item:nth-child(8)) {
    width: auto;
  }
}

@media (max-width: 576px) {
  .contacts-container {
    padding: 12px;
  }
  
  .contacts-filter :deep(.ant-form-item) {
    width: 100%;
    margin-right: 0;
  }
  
  .pagination-container {
    justify-content: center;
  }
  
  .pagination-container :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>