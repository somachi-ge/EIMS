<template>
  <div class="organization-admin-container">
    <a-config-provider :locale="zhCN">
      <div class="organization-admin-page">
        <a-card class="organization-admin-card">
          <div class="organization-admin-filter" style="overflow-x: auto;">
            <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.code" placeholder="请输入组织编码" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.name" placeholder="请输入组织名称" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.leader" placeholder="请输入负责人" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-input v-model:value="filterForm.leaderPhone" placeholder="请输入负责人电话" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-select v-model:value="filterForm.organizationType" placeholder="组织类型" allow-clear style="width: 100%;">
                  <a-select-option value="">全部类型</a-select-option>
                  <a-select-option v-for="type in organizationTypes" :key="type.id" :value="type.name">
                    {{ type.name }}
                  </a-select-option>
                </a-select>
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-select v-model:value="filterForm.status" placeholder="状态" allow-clear style="width: 100%;">
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="active">已激活</a-select-option>
                  <a-select-option value="inactive">未激活</a-select-option>
                </a-select>
              </div>
              <div style="flex: 0.6; min-width: 90px;">
                <a-button type="primary" @click="handleSearch" style="width: 100%;">搜索</a-button>
              </div>
              <div style="flex: 0.6; min-width: 90px;">
                <a-button @click="handleReset" style="width: 100%;">重置</a-button>
              </div>
            </div>
          </div>
          
          <div class="organization-admin-actions">
            <a-button type="primary" @click="handleAdd">添加组织</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #52c41a;" @click="handleOrganizationType">组织类型</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #1890ff;" @click="handleOrganizationStructure">组织架构</a-button>
          </div>
          
          <div class="organization-admin-table-container">
            <a-table
              :columns="columns"
              :data-source="paginatedOrganizations"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :pagination="false"
              size="small"
              class="organization-admin-table"
              row-key="id"
              :loading="loading"
              :expanded-row-keys="expandedRowKeys"
              @expand="handleExpand"
              :expandable="{
                expandedRowRender: (record: Organization) => {
                  if (!record.children?.length) {
                    return null;
                  }
                  return h('div', {
                    style: {
                      padding: '16px'
                    }
                  }, [
                    h('a-table', {
                      columns: columns,
                      dataSource: record.children,
                      size: 'small',
                      rowKey: 'id',
                      pagination: false,
                      expandable: {
                        expandedRowRender: (childRecord: Organization) => {
                          if (!childRecord.children?.length) {
                            return null;
                          }
                          return h('div', {
                            style: {
                              padding: '16px',
                              marginLeft: '24px'
                            }
                          }, [
                            h('a-table', {
                              columns: columns,
                              dataSource: childRecord.children,
                              size: 'small',
                              rowKey: 'id',
                              pagination: false
                            }, {
                              bodyCell: (scope: any) => {
                                if (scope.column.key === 'status') {
                                  return h('a-tag', {
                                    color: scope.record.status === 'active' ? 'green' : 'red',
                                    bordered: false,
                                    style: {
                                      cursor: 'pointer'
                                    },
                                    onClick: () => handleToggleStatus(scope.record)
                                  }, scope.record.status === 'active' ? '已激活' : '未激活');
                                }
                                if (scope.column.key === 'action') {
                                  return h('div', {
                                    style: {
                                      display: 'flex',
                                      gap: '8px'
                                    }
                                  }, [
                                    h('a-tag', {
                                      color: 'green',
                                      bordered: false,
                                      style: {
                                        cursor: 'pointer'
                                      },
                                      onClick: () => handleAddChild(scope.record)
                                    }, '新增'),
                                    h('a-tag', {
                                      color: 'blue',
                                      bordered: false,
                                      style: {
                                        cursor: 'pointer'
                                      },
                                      onClick: () => handleEdit(scope.record)
                                    }, '编辑'),
                                    h('a-tag', {
                                      color: 'red',
                                      bordered: false,
                                      style: {
                                        cursor: 'pointer'
                                      },
                                      onClick: () => handleDelete(scope.record.id)
                                    }, '删除')
                                  ]);
                                }
                                return null;
                              }
                            })
                          ]);
                        },
                        rowExpandable: (childRecord: Organization) => {
                          return !!childRecord.children?.length;
                        }
                      }
                    }, {
                      bodyCell: (scope: any) => {
                        if (scope.column.key === 'status') {
                          return h('a-tag', {
                            color: scope.record.status === 'active' ? 'green' : 'red',
                            bordered: false,
                            style: {
                              cursor: 'pointer'
                            },
                            onClick: () => handleToggleStatus(scope.record)
                          }, scope.record.status === 'active' ? '已激活' : '未激活');
                        }
                        if (scope.column.key === 'action') {
                          return h('div', {
                            style: {
                              display: 'flex',
                              gap: '8px'
                            }
                          }, [
                            h('a-tag', {
                              color: 'green',
                              bordered: false,
                              style: {
                                cursor: 'pointer'
                              },
                              onClick: () => handleAddChild(scope.record)
                            }, '新增'),
                            h('a-tag', {
                              color: 'blue',
                              bordered: false,
                              style: {
                                cursor: 'pointer'
                              },
                              onClick: () => handleEdit(scope.record)
                            }, '编辑'),
                            h('a-tag', {
                              color: 'red',
                              bordered: false,
                              style: {
                                cursor: 'pointer'
                              },
                              onClick: () => handleDelete(scope.record.id)
                            }, '删除')
                          ]);
                        }
                        return null;
                      }
                    })
                  ]);
                },
                rowExpandable: (record: Organization) => {
                  return !!record.children?.length;
                }
              }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === 'active' ? 'green' : 'red'" :bordered="false" style="cursor: pointer;" @click="handleToggleStatus(record)">
                    {{ record.status === 'active' ? '已激活' : '未激活' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <div style="display: flex; gap: 8px;">
                    <a-tag color="green" :bordered="false" @click="handleAddChild(record)" style="cursor: pointer;">新增</a-tag>
                    <a-tag color="blue" :bordered="false" @click="handleEdit(record)" style="cursor: pointer;">编辑</a-tag>
                    <a-tag color="red" :bordered="false" @click="handleDelete(record.id)" style="cursor: pointer;">删除</a-tag>
                  </div>
                </template>
              </template>
            </a-table>
            
            <a-pagination
              v-model:current="pagination.current"
              v-model:pageSize="pagination.pageSize"
              :total="filteredOrganizations.length"
              :showSizeChanger="true"
              :pageSizeOptions="PAGE_SIZE_OPTIONS"
              :showTotal="showTotal"
              :showQuickJumper="true"
              class="organization-admin-pagination"
            />
          </div>
        </a-card>
        
        <!-- 添加/编辑组织模态框 -->
        <a-modal
          v-model:open="organizationModalVisible"
          :title="isEditMode ? '编辑组织' : '添加组织'"
          width="600px"
          :ok-text="'保存'"
          :cancel-text="'取消'"
          @ok="handleSaveOrganization"
          @cancel="closeOrganizationModal"
          class="organization-admin-detail-modal"
          :body-style="{ maxHeight: '400px', overflowY: 'auto' }"
        >
          <div class="organization-form">
            <a-form :model="currentOrganization" layout="vertical">
              <a-form-item label="组织编码">
                <a-input v-model:value="currentOrganization.code" placeholder="组织编码" disabled />
              </a-form-item>
              <a-form-item label="组织名称" :rules="[{ required: true, message: '请输入组织名称' }]">
                <a-input v-model:value="currentOrganization.name" placeholder="请输入组织名称" @keyup.enter="handleSaveOrganization" />
              </a-form-item>
              <a-form-item label="负责人" :rules="[{ required: true, message: '请输入负责人' }]">
                <a-input v-model:value="currentOrganization.leader" placeholder="请输入负责人" @keyup.enter="handleSaveOrganization" />
              </a-form-item>
              <a-form-item label="负责人电话" :rules="[{ required: true, message: '请输入负责人电话' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式' }]">
                <a-input v-model:value="currentOrganization.leaderPhone" placeholder="请输入负责人电话" @keyup.enter="handleSaveOrganization" />
              </a-form-item>
              <a-form-item label="组织类型" :rules="[{ required: true, message: '请选择组织类型' }]">
                <a-select v-model:value="currentOrganization.organizationType" placeholder="请选择组织类型">
                  <a-select-option v-for="type in organizationTypes" :key="type.id" :value="type.name">
                    {{ type.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="状态" :rules="[{ required: true, message: '请选择状态' }]">
                <a-radio-group v-model:value="currentOrganization.status">
                  <a-radio value="active">已激活</a-radio>
                  <a-radio value="inactive">未激活</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-form>
          </div>
        </a-modal>
        
        <!-- 组织类型管理模态框 -->
        <a-modal
          v-model:open="organizationTypeModalVisible"
          title="组织类型管理"
          width="600px"
          :ok-text="'关闭'"
          :cancel-button-props="{ style: { display: 'none' } }"
          @ok="closeOrganizationTypeModal"
          @cancel="closeOrganizationTypeModal"
          class="organization-type-modal"
        >
          <div class="organization-type-content">
            <!-- 操作按钮 -->
            <div class="type-actions" style="margin-bottom: 16px;">
              <a-button type="primary" @click="handleAddOrganizationType">
                添加组织类型
              </a-button>
            </div>
            
            <!-- 组织类型列表 -->
            <a-table
              :columns="typeColumns"
              :data-source="organizationTypes"
              size="small"
              row-key="id"
              :pagination="false"
              class="organization-type-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div style="display: flex; gap: 8px;">
                    <a-tag color="blue" :bordered="false" @click="handleEditOrganizationType(record)" style="cursor: pointer;">编辑</a-tag>
                    <a-tag color="red" :bordered="false" @click="handleDeleteOrganizationType(record.id)" style="cursor: pointer;">删除</a-tag>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </a-modal>
        
        <!-- 添加/编辑组织类型模态框 -->
        <a-modal
          v-model:open="typeFormModalVisible"
          :title="isEditTypeMode ? '编辑组织类型' : '添加组织类型'"
          width="500px"
          :ok-text="'保存'"
          :cancel-text="'取消'"
          @ok="handleSaveOrganizationType"
          @cancel="closeTypeFormModal"
          class="type-form-modal"
        >
          <div class="type-form">
            <a-form :model="currentOrganizationType" layout="vertical">
              <a-form-item label="组织类型编码">
                <a-input v-model:value="currentOrganizationType.code" placeholder="组织类型编码" disabled />
              </a-form-item>
              <a-form-item label="组织类型名称" :rules="[{ required: true, message: '请输入组织类型名称' }]">
                <a-input v-model:value="currentOrganizationType.name" placeholder="请输入组织类型名称" @keyup.enter="handleSaveOrganizationType" />
              </a-form-item>
            </a-form>
          </div>
        </a-modal>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, shallowRef, h } from 'vue';
import { message } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useRouter } from 'vue-router';

interface Organization {
  id: string;
  code: string;
  name: string;
  leader: string;
  leaderPhone: string;
  organizationType: string;
  status: 'active' | 'inactive';
  created: string;
  parentId?: string;
  children?: Organization[];
}

interface OrganizationType {
  id: string;
  code: string;
  name: string;
}

interface FilterForm {
  code: string;
  name: string;
  leader: string;
  leaderPhone: string;
  organizationType: string;
  status: string;
}

interface Pagination {
  current: number;
  pageSize: number;
}

interface OrganizationFormData {
  id: string;
  code: string;
  name: string;
  leader: string;
  leaderPhone: string;
  organizationType: string;
  status: 'active' | 'inactive';
  parentId?: string;
}

interface OrganizationTypeFormData {
  id: string;
  code: string;
  name: string;
}

const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;



const ORG_PREFIX = 'YHG';
const TYPE_PREFIX = 'TYPE';

const router = useRouter();
const loading = ref(false);
const selectedRowKeys = ref<(string | number)[]>([]);
const organizationModalVisible = ref(false);
const isEditMode = ref(false);
const organizationTypeModalVisible = ref(false);
const typeFormModalVisible = ref(false);
const isEditTypeMode = ref(false);
const expandedRowKeys = ref<string[]>([]);

const filterForm = reactive<FilterForm>({
  code: '',
  name: '',
  leader: '',
  leaderPhone: '',
  organizationType: '',
  status: ''
});

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10
});

const currentOrganization = reactive<OrganizationFormData>({
  id: '',
  code: '',
  name: '',
  leader: '',
  leaderPhone: '',
  organizationType: '',
  status: 'active',
  parentId: ''
});

const currentOrganizationType = reactive<OrganizationTypeFormData>({
  id: '',
  code: '',
  name: ''
});

const generateOrganizationCode = (prefix: string, index: number): string => {
  const number = String(index).padStart(3, '0');
  return prefix + number;
};

const generateTypeCode = (prefix: string, index: number): string => {
  const number = String(index).padStart(3, '0');
  return prefix + number;
};

const generateMockOrganizationTypes = (): OrganizationType[] => {
  const types: OrganizationType[] = [
    { id: '1', code: 'TYPE001', name: '总公司' },
    { id: '2', code: 'TYPE002', name: '分公司' },
    { id: '3', code: 'TYPE003', name: '事业部' },
    { id: '4', code: 'TYPE004', name: '项目组' },
    { id: '5', code: 'TYPE005', name: '部门' }
  ];
  return types;
};

const generateMockOrganizations = (): Organization[] => {
  const orgs: Organization[] = [];
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive'];
  const leaderNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  
  // 生成总公司
  const headOffice: Organization = {
    id: '1',
    code: generateOrganizationCode(ORG_PREFIX, 1),
    name: '总公司',
    leader: leaderNames[0],
    leaderPhone: `1380013800${Math.floor(Math.random() * 10)}`,
    organizationType: '总公司',
    status: 'active',
    created: new Date().toISOString().replace('T', ' ').substring(0, 19),
    children: []
  };
  
  // 生成分公司
  for (let i = 1; i <= 3; i++) {
    const branchOffice: Organization = {
      id: `${i + 1}`,
      code: `${headOffice.code}-${String(i).padStart(2, '0')}`,
      name: `分公司${i}`,
      leader: leaderNames[i],
      leaderPhone: `138001380${i}${Math.floor(Math.random() * 10)}`,
      organizationType: '分公司',
      status: statuses[i % 2],
      created: new Date(Date.now() - i * 86400000).toISOString().replace('T', ' ').substring(0, 19),
      parentId: headOffice.id,
      children: []
    };
    
    // 为分公司生成部门
    for (let j = 1; j <= 2; j++) {
      const department: Organization = {
        id: `${i + 10 + j}`,
        code: `${branchOffice.code}-${String(j).padStart(2, '0')}`,
        name: `部门${j}`,
        leader: leaderNames[i + j],
        leaderPhone: `13800138${i}${j}${Math.floor(Math.random() * 10)}`,
        organizationType: '部门',
        status: statuses[(i + j) % 2],
        created: new Date(Date.now() - (i + j) * 86400000).toISOString().replace('T', ' ').substring(0, 19),
        parentId: branchOffice.id
      };
      branchOffice.children?.push(department);
    }
    
    headOffice.children?.push(branchOffice);
  }
  
  orgs.push(headOffice);
  return orgs;
};

const originalOrganizations = ref<Organization[]>(generateMockOrganizations());
const organizationTypes = ref<OrganizationType[]>(generateMockOrganizationTypes());

const columns = shallowRef([
  {
    title: '组织编码',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '组织名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '负责人',
    dataIndex: 'leader',
    key: 'leader'
  },
  {
    title: '负责人电话',
    dataIndex: 'leaderPhone',
    key: 'leaderPhone'
  },
  {
    title: '组织类型',
    dataIndex: 'organizationType',
    key: 'organizationType'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'created',
    key: 'created'
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right'
  }
]);

const typeColumns = shallowRef([
  {
    title: '组织类型编码',
    dataIndex: 'code',
    key: 'code',
    width: 120
  },
  {
    title: '组织类型名称',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right'
  }
]);

const flattenOrganizations = (orgs: Organization[]): Organization[] => {
  let result: Organization[] = [];
  orgs.forEach(org => {
    result.push(org);
    if (org.children?.length) {
      result = [...result, ...flattenOrganizations(org.children!)];
    }
  });
  return result;
};

const filteredOrganizations = computed(() => {
  const flattened = flattenOrganizations(originalOrganizations.value);
  return flattened.filter(org => {
    let match = true;
    
    if (filterForm.code) {
      match = match && org.code.toLowerCase().includes(filterForm.code.toLowerCase());
    }
    if (filterForm.name) {
      match = match && org.name.toLowerCase().includes(filterForm.name.toLowerCase());
    }
    if (filterForm.leader) {
      match = match && org.leader.toLowerCase().includes(filterForm.leader.toLowerCase());
    }
    if (filterForm.leaderPhone) {
      match = match && org.leaderPhone.includes(filterForm.leaderPhone);
    }
    if (filterForm.organizationType) {
      match = match && org.organizationType === filterForm.organizationType;
    }
    if (filterForm.status) {
      match = match && org.status === filterForm.status;
    }
    
    return match;
  });
});

const paginatedOrganizations = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredOrganizations.value.slice(start, end);
});

const showTotal = (total: number) => `共 ${total} 条记录`;

const onSelectChange = (keys: (string | number)[]) => {
  selectedRowKeys.value = keys;
};

const handleSearch = () => {
  pagination.current = 1;
  message.success(`搜索完成，共找到 ${filteredOrganizations.value.length} 个组织`);
};

const handleReset = () => {
  Object.assign(filterForm, {
    code: '',
    name: '',
    leader: '',
    leaderPhone: '',
    organizationType: '',
    status: ''
  });
  pagination.current = 1;
  expandedRowKeys.value = [];
  message.success('表单已重置，组织列表已恢复');
};

const handleExpand = (expanded: boolean, record: Organization) => {
  if (expanded) {
    if (!expandedRowKeys.value.includes(record.id)) {
      expandedRowKeys.value.push(record.id);
    }
  } else {
    expandedRowKeys.value = expandedRowKeys.value.filter(key => key !== record.id);
  }
};

const handleAdd = () => {
  isEditMode.value = false;
  
  let maxIndex = 0;
  const allOrgs = flattenOrganizations(originalOrganizations.value);
  allOrgs.forEach(org => {
    if (org.code.startsWith(ORG_PREFIX)) {
      const numberPart = org.code.substring(ORG_PREFIX.length);
      const index = parseInt(numberPart, 10);
      if (!isNaN(index) && index > maxIndex) {
        maxIndex = index;
      }
    }
  });
  
  const newIndex = maxIndex + 1;
  const newOrgCode = generateOrganizationCode(ORG_PREFIX, newIndex);
  
  Object.assign(currentOrganization, {
    id: '',
    code: newOrgCode,
    name: '',
    leader: '',
    leaderPhone: '',
    organizationType: '总公司',
    status: 'active',
    parentId: ''
  });
  
  organizationModalVisible.value = true;
};

const handleAddChild = (parentOrg: Organization) => {
  isEditMode.value = false;
  
  const parentCode = parentOrg.code;
  let maxSubCode = 0;
  
  if (parentOrg.children?.length) {
    parentOrg.children.forEach(child => {
      if (child.code.startsWith(parentCode + '-')) {
        const subCodePart = child.code.split('-').pop();
        if (subCodePart) {
          const subCode = parseInt(subCodePart, 10);
          if (!isNaN(subCode) && subCode > maxSubCode) {
            maxSubCode = subCode;
          }
        }
      }
    });
  }
  
  const newSubCode = String(maxSubCode + 1).padStart(2, '0');
  const childCode = `${parentCode}-${newSubCode}`;
  
  let recommendedType = '部门';
  switch (parentOrg.organizationType) {
    case '总公司':
      recommendedType = '分公司';
      break;
    case '分公司':
      recommendedType = '事业部';
      break;
    case '事业部':
      recommendedType = '项目组';
      break;
    case '项目组':
      recommendedType = '部门';
      break;
    default:
      recommendedType = '部门';
  }
  
  Object.assign(currentOrganization, {
    id: '',
    code: childCode,
    name: '',
    leader: '',
    leaderPhone: '',
    organizationType: recommendedType,
    status: 'active',
    parentId: parentOrg.id
  });
  
  organizationModalVisible.value = true;
};

const handleEdit = (record: Organization) => {
  isEditMode.value = true;
  Object.assign(currentOrganization, {
    id: record.id,
    code: record.code,
    name: record.name,
    leader: record.leader,
    leaderPhone: record.leaderPhone,
    organizationType: record.organizationType,
    status: record.status,
    parentId: record.parentId
  });
  
  organizationModalVisible.value = true;
};

const closeOrganizationModal = () => {
  organizationModalVisible.value = false;
};

const handleSaveOrganization = async () => {
  if (!currentOrganization.name) {
    message.error('请输入组织名称');
    return;
  }
  
  if (!currentOrganization.leader) {
    message.error('请输入负责人');
    return;
  }
  
  if (!currentOrganization.leaderPhone) {
    message.error('请输入负责人电话');
    return;
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(currentOrganization.leaderPhone)) {
    message.error('请输入正确的手机号码格式');
    return;
  }
  
  if (!currentOrganization.organizationType) {
    message.error('请选择组织类型');
    return;
  }
  
  try {
    loading.value = true;
    if (isEditMode.value && currentOrganization.id) {
      // 编辑组织
      await updateOrganization(currentOrganization.id, {
        name: currentOrganization.name,
        leader: currentOrganization.leader,
        leaderPhone: currentOrganization.leaderPhone,
        organizationType: currentOrganization.organizationType,
        status: currentOrganization.status
      });
    } else {
      // 添加组织
      await createOrganization({
        code: currentOrganization.code,
        name: currentOrganization.name,
        leader: currentOrganization.leader,
        leaderPhone: currentOrganization.leaderPhone,
        organizationType: currentOrganization.organizationType,
        status: currentOrganization.status,
        parentId: currentOrganization.parentId
      });
    }
    
    closeOrganizationModal();
  } catch (error) {
    console.error('保存组织失败:', error);
    message.error('保存组织失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const createOrganization = async (org: Omit<Organization, 'id' | 'created' | 'children'>) => {
  try {
    loading.value = true;
    const newOrg: Organization = {
      ...org,
      id: String(Date.now()),
      created: new Date().toISOString().replace('T', ' ').substring(0, 19),
      children: []
    };
    
    if (org.parentId) {
      // 添加为子组织
      const addChildToParent = (orgs: Organization[]): boolean => {
        for (const organization of orgs) {
          if (organization.id === org.parentId) {
            if (!organization.children) {
              organization.children = [];
            }
            organization.children.push(newOrg);
            return true;
          }
          if (organization.children?.length) {
            if (addChildToParent(organization.children!)) {
              return true;
            }
          }
        }
        return false;
      };
      
      addChildToParent(originalOrganizations.value);
    } else {
      // 添加为根组织
      originalOrganizations.value.push(newOrg);
    }
    
    message.success('组织创建成功');
  } catch (error) {
    console.error('创建组织失败:', error);
    message.error('创建组织失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const updateOrganization = async (id: string, org: Partial<Organization>) => {
  try {
    loading.value = true;
    const updateOrg = (orgs: Organization[]): boolean => {
      for (let i = 0; i < orgs.length; i++) {
        if (orgs[i].id === id) {
          orgs[i] = {
            ...orgs[i],
            ...org
          };
          return true;
        }
        const children = orgs[i].children;
        if (children && children.length > 0) {
          if (updateOrg(children)) {
            return true;
          }
        }
      }
      return false;
    };
    
    updateOrg(originalOrganizations.value);
    message.success('组织更新成功');
  } catch (error) {
    console.error('更新组织失败:', error);
    message.error('更新组织失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const deleteOrganization = async (id: string) => {
  try {
    loading.value = true;
    const deleteOrg = (orgs: Organization[]): boolean => {
      for (let i = 0; i < orgs.length; i++) {
        if (orgs[i].id === id) {
          orgs.splice(i, 1);
          return true;
        }
        if (orgs[i].children?.length) {
          if (deleteOrg(orgs[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };
    
    deleteOrg(originalOrganizations.value);
    message.success('组织删除成功');
  } catch (error) {
    console.error('删除组织失败:', error);
    message.error('删除组织失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id: string) => {
  await deleteOrganization(id);
};

const handleToggleStatus = async (record: Organization) => {
  const newStatus = record.status === 'active' ? 'inactive' : 'active';
  
  try {
    await updateOrganization(record.id, {
      status: newStatus
    });
  } catch (error) {
    console.error('切换组织状态失败:', error);
    message.error('切换组织状态失败，请稍后重试');
  }
};

const handleOrganizationType = () => {
  organizationTypeModalVisible.value = true;
};

const closeOrganizationTypeModal = () => {
  organizationTypeModalVisible.value = false;
};

const handleOrganizationStructure = () => {
  router.push('/system/organization/organizationchart');
};

const handleAddOrganizationType = () => {
  isEditTypeMode.value = false;
  
  let maxIndex = 0;
  organizationTypes.value.forEach(type => {
    if (type.code.startsWith(TYPE_PREFIX)) {
      const numberPart = type.code.substring(TYPE_PREFIX.length);
      const index = parseInt(numberPart, 10);
      if (!isNaN(index) && index > maxIndex) {
        maxIndex = index;
      }
    }
  });
  
  const newIndex = maxIndex + 1;
  const newTypeCode = generateTypeCode(TYPE_PREFIX, newIndex);
  
  Object.assign(currentOrganizationType, {
    id: '',
    code: newTypeCode,
    name: ''
  });
  
  typeFormModalVisible.value = true;
};

const handleEditOrganizationType = (record: OrganizationType) => {
  isEditTypeMode.value = true;
  Object.assign(currentOrganizationType, {
    id: record.id,
    code: record.code,
    name: record.name
  });
  
  typeFormModalVisible.value = true;
};

const closeTypeFormModal = () => {
  typeFormModalVisible.value = false;
};

const handleSaveOrganizationType = async () => {
  if (!currentOrganizationType.name) {
    message.error('请输入组织类型名称');
    return;
  }
  
  try {
    if (isEditTypeMode.value && currentOrganizationType.id) {
      // 编辑组织类型
      await updateOrganizationType(currentOrganizationType.id, {
        name: currentOrganizationType.name
      });
    } else {
      // 添加组织类型
      await createOrganizationType({
        code: currentOrganizationType.code,
        name: currentOrganizationType.name
      });
    }
    
    closeTypeFormModal();
  } catch (error) {
    console.error('保存组织类型失败:', error);
    message.error('保存组织类型失败，请稍后重试');
  }
};

const createOrganizationType = async (type: Omit<OrganizationType, 'id'>) => {
  try {
    const newType: OrganizationType = {
      ...type,
      id: String(Date.now())
    };
    organizationTypes.value.push(newType);
    message.success('组织类型创建成功');
  } catch (error) {
    console.error('创建组织类型失败:', error);
    message.error('创建组织类型失败，请稍后重试');
  }
};

const updateOrganizationType = async (id: string, type: Partial<OrganizationType>) => {
  try {
    const index = organizationTypes.value.findIndex(t => t.id === id);
    if (index !== -1) {
      organizationTypes.value[index] = {
        ...organizationTypes.value[index],
        ...type
      };
      message.success('组织类型更新成功');
    }
  } catch (error) {
    console.error('更新组织类型失败:', error);
    message.error('更新组织类型失败，请稍后重试');
  }
};

const deleteOrganizationType = async (id: string) => {
  try {
    organizationTypes.value = organizationTypes.value.filter(t => t.id !== id);
    message.success('组织类型删除成功');
  } catch (error) {
    console.error('删除组织类型失败:', error);
    message.error('删除组织类型失败，请稍后重试');
  }
};

const handleDeleteOrganizationType = async (id: string) => {
  await deleteOrganizationType(id);
};

onMounted(() => {
  // 初始化完成
});
</script>

<style scoped>
.organization-admin-container {
  width: 100%;
  padding: 1.5%;
}

.organization-admin-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.organization-admin-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.organization-admin-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.organization-admin-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.organization-admin-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.organization-admin-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.organization-admin-table {
  border-radius: 4px;
}

.organization-admin-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.organization-admin-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.organization-admin-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.organization-admin-detail-modal {
  border-radius: 8px;
}

.organization-form {
  padding: 20px 0;
}

.organization-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.organization-type-table {
  border-radius: 4px;
}

.organization-type-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.organization-type-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.type-form {
  padding: 20px 0;
}

.type-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

@media (max-width: 1200px) {
  .organization-admin-page {
    padding: 20px;
  }
  
  .organization-admin-filter {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .organization-admin-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .organization-admin-page {
    padding: 12px;
  }
  
  .organization-admin-filter {
    padding: 12px;
  }
  
  .organization-admin-actions {
    flex-direction: column;
  }
  
  .organization-admin-actions :deep(.ant-btn) {
    width: 100%;
    margin-left: 0 !important;
  }
}

@media (max-width: 576px) {
  .organization-admin-page {
    padding: 12px;
  }
  
  .organization-admin-pagination {
    justify-content: center;
  }
  
  .organization-admin-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .organization-admin-detail-modal,
  .organization-type-modal,
  .type-form-modal {
    width: 90% !important;
  }
}
</style>