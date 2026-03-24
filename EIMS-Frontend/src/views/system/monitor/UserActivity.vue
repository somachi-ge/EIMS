<template>
  <div class="user-activity-monitor">
    <a-config-provider :locale="zhCN">
      <div class="monitor-page-wrapper">
        <a-card class="monitor-content-card">
          <div class="filter-section" style="overflow-x: auto;">
            <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
              <div style="flex: 1.5; min-width: 200px;">
                <a-input 
                  v-model:value="queryParams.keyword" 
                  placeholder="请输入搜索关键词" 
                  @keyup.enter="onSearch" 
                  allow-clear 
                  style="width: 100%;" 
                />
              </div>
              <div style="flex: 1.2; min-width: 180px;">
                <a-range-picker 
                  v-model:value="queryParams.dateRange" 
                  :placeholder="['开始日期', '结束日期']" 
                  format="YYYY年MM月DD日" 
                  style="width: 100%;" 
                />
              </div>
              <div style="flex: 1; min-width: 120px;">
                <a-select 
                  v-model:value="queryParams.status" 
                  placeholder="全部状态" 
                  allow-clear 
                  style="width: 100%;"
                >
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="success">成功</a-select-option>
                  <a-select-option value="failed">失败</a-select-option>
                </a-select>
              </div>
              <div style="flex: 0.4; min-width: 70px;">
                <a-button type="primary" @click="onSearch" style="width: 100%;">搜索</a-button>
              </div>
              <div style="flex: 0.4; min-width: 70px;">
                <a-button @click="onReset" style="width: 100%;">重置</a-button>
              </div>
            </div>
          </div>
          
          <div class="toolbar-section">
            <a-button type="primary" @click="onExport">导出日志</a-button>
          </div>
          
          <div class="table-section">
            <a-table
              :columns="tableColumns"
              :data-source="displayedActivityLogs"
              :pagination="false"
              row-key="id"
              size="small"
              class="activity-log-table"
              :scroll="{ x: 1000 }"
            >
              <template #operationStatus="{ record }">
                <a-tag 
                  :color="record.operationStatus === 'success' ? 'green' : 'red'" 
                  :bordered="false"
                >
                  {{ record.operationStatus === 'success' ? '成功' : '失败' }}
                </a-tag>
              </template>
            </a-table>
            
            <a-pagination
              v-model:current="pageConfig.current"
              v-model:pageSize="pageConfig.pageSize"
              :total="filteredActivityLogs.length"
              :showSizeChanger="true"
              :pageSizeOptions="['10', '30', '50']"
              :showTotal="renderTotalText"
              :showQuickJumper="true"
              class="table-pagination"
            />
          </div>
        </a-card>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

/**
 * 用户活动日志记录接口
 */
interface UserActivityLog {
  /** 记录ID */
  id: number;
  /** 操作用户 */
  operator: string;
  /** 操作内容描述 */
  operationContent: string;
  /** 操作模块 */
  operationModule: string;
  /** 操作类型 */
  operationType: string;
  /** 操作者IP地址 */
  clientIp: string;
  /** 操作状态 */
  operationStatus: 'success' | 'failed';
  /** 操作耗时(毫秒) */
  executionTime: number;
  /** 操作时间 */
  operationTime: string;
}

/**
 * 查询参数接口
 */
interface QueryParams {
  /** 搜索关键词 */
  keyword: string;
  /** 日期范围 */
  dateRange: any;
  /** 操作状态 */
  status: string;
}

/**
 * 分页配置接口
 */
interface PageConfig {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
}

/**
 * 生成模拟用户活动日志数据
 */
const generateMockActivityLogs = (): UserActivityLog[] => {
  const operatorList = ['admin', 'user1', 'user2', 'manager', 'operator'];
  const moduleList = ['系统管理', '用户管理', '角色管理', '部门管理', '岗位管理', '菜单管理', '权限管理', '字典管理', '配置管理', '日志管理'];
  const typeList = ['查询', '新增', '修改', '删除', '导出', '导入', '登录', '登出'];
  const operationList = [
    '登录系统', '查看用户列表', '修改用户信息', '删除用户', '添加角色', '查看角色列表',
    '修改角色权限', '删除角色', '添加部门', '查看部门列表', '修改部门信息', '删除部门',
    '添加岗位', '查看岗位列表', '修改岗位信息', '删除岗位', '添加菜单', '查看菜单列表',
    '修改菜单信息', '删除菜单', '添加权限', '查看权限列表', '修改权限信息', '删除权限',
    '添加字典', '查看字典列表', '修改字典信息', '删除字典', '添加配置', '查看配置列表',
    '修改配置信息', '删除配置', '添加日志', '查看日志列表', '修改日志信息', '删除日志',
    '添加通知', '查看通知列表', '修改通知信息', '删除通知', '添加任务', '查看任务列表',
    '修改任务信息', '删除任务', '添加项目', '查看项目列表', '修改项目信息', '删除项目',
    '添加文档', '查看文档列表', '修改文档信息', '删除文档', '添加报表', '查看报表列表',
    '修改报表信息', '删除报表', '添加仪表盘', '查看仪表盘列表', '修改仪表盘信息', '删除仪表盘',
    '添加数据源', '查看数据源列表', '修改数据源信息', '删除数据源', '添加API', '查看API列表',
    '修改API信息', '删除API', '添加服务', '查看服务列表', '修改服务信息', '删除服务',
    '添加应用', '查看应用列表', '修改应用信息', '删除应用', '添加插件', '查看插件列表',
    '修改插件信息', '删除插件'
  ];
  const ipPrefixList = ['192.168.1.', '10.0.0.', '172.16.0.'];
  
  const activityLogs: UserActivityLog[] = [];
  
  for (let i = 1; i <= 80; i++) {
    const operator = operatorList[Math.floor(Math.random() * operatorList.length)];
    const operationContent = operationList[(i - 1) % operationList.length];
    const operationModule = moduleList[Math.floor(Math.random() * moduleList.length)];
    const operationType = typeList[Math.floor(Math.random() * typeList.length)];
    const clientIp = `${ipPrefixList[Math.floor(Math.random() * ipPrefixList.length)]}${Math.floor(Math.random() * 255)}`;
    const operationStatus = operationContent.includes('删除') || operationContent.includes('失败') ? 'failed' : 'success';
    const executionTime = Math.floor(Math.random() * 500) + 50;
    
    const hour = 10 + Math.floor((i - 1) / 4);
    const minute = ((i - 1) % 4) * 15;
    const operationTime = `2024-01-01 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    
    activityLogs.push({
      id: i,
      operator,
      operationContent,
      operationModule,
      operationType,
      clientIp,
      operationStatus: operationStatus as 'success' | 'failed',
      executionTime,
      operationTime
    });
  }
  
  return activityLogs;
};

// 活动日志数据列表
const activityLogList = ref<UserActivityLog[]>(generateMockActivityLogs());

// 查询参数
const queryParams = reactive<QueryParams>({
  keyword: '',
  dateRange: null,
  status: ''
});

// 分页配置
const pageConfig = reactive<PageConfig>({
  current: 1,
  pageSize: 10
});

// 表格列配置
const tableColumns = [
  {
    title: '操作用户',
    dataIndex: 'operator',
    key: 'operator',
    width: 100
  },
  {
    title: '操作模块',
    dataIndex: 'operationModule',
    key: 'operationModule',
    width: 120
  },
  {
    title: '操作类型',
    dataIndex: 'operationType',
    key: 'operationType',
    width: 100
  },
  {
    title: '操作内容',
    dataIndex: 'operationContent',
    key: 'operationContent',
    width: 150
  },
  {
    title: '客户端IP',
    dataIndex: 'clientIp',
    key: 'clientIp',
    width: 120
  },
  {
    title: '操作状态',
    key: 'operationStatus',
    width: 80,
    slots: {
      customRender: 'operationStatus'
    }
  },
  {
    title: '执行耗时(ms)',
    dataIndex: 'executionTime',
    key: 'executionTime',
    width: 100
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    key: 'operationTime',
    width: 160
  }
];

/**
 * 根据查询参数过滤后的活动日志列表
 */
const filteredActivityLogs = computed(() => {
  let result = [...activityLogList.value];
  
  if (queryParams.keyword) {
    const lowerKeyword = queryParams.keyword.toLowerCase();
    result = result.filter(log => 
      log.operationContent.toLowerCase().includes(lowerKeyword) ||
      log.operator.toLowerCase().includes(lowerKeyword) ||
      log.clientIp.includes(queryParams.keyword) ||
      log.operationModule.toLowerCase().includes(lowerKeyword) ||
      log.operationType.toLowerCase().includes(lowerKeyword)
    );
  }
  
  if (queryParams.status) {
    result = result.filter(log => log.operationStatus === queryParams.status);
  }
  
  return result;
});

/**
 * 当前页显示的活动日志列表
 */
const displayedActivityLogs = computed(() => {
  const startIndex = (pageConfig.current - 1) * pageConfig.pageSize;
  const endIndex = startIndex + pageConfig.pageSize;
  return filteredActivityLogs.value.slice(startIndex, endIndex);
});

/**
 * 渲染分页总条数文本
 */
const renderTotalText = (total: number) => `共 ${total} 条记录`;

/**
 * 执行搜索操作
 */
const onSearch = () => {
  pageConfig.current = 1;
  message.success(`搜索完成，共找到 ${filteredActivityLogs.value.length} 条用户活动记录`);
};

/**
 * 重置查询条件和分页
 */
const onReset = () => {
  Object.assign(queryParams, {
    keyword: '',
    dateRange: null,
    status: ''
  });
  pageConfig.current = 1;
  message.success('表单已重置，用户活动列表已恢复');
};

/**
 * 导出活动日志
 */
const onExport = async () => {
  try {
    message.success('用户活动记录导出成功');
  } catch (error) {
    console.error('导出用户活动记录失败:', error);
    message.error('导出用户活动记录失败，请稍后重试');
  }
};

/**
 * 加载用户活动数据
 */
const loadActivityData = () => {
  // 这里应该调用实际的API接口
  // const response = await monitorApi.getUserActivity({ 
  //   page: pageConfig.current, 
  //   page_size: pageConfig.pageSize 
  // });
  // activityLogList.value = response.data.list;
  // pageConfig.total = response.data.total;
};

onMounted(() => {
  loadActivityData();
});
</script>

<style scoped>
.user-activity-monitor {
  width: 100%;
  padding: 1.5%;
}

.monitor-content-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.monitor-content-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.filter-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.toolbar-section {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-section :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.toolbar-section :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.activity-log-table {
  border-radius: 4px;
}

.activity-log-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.activity-log-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1200px) {
  .monitor-page-wrapper {
    padding: 20px;
  }
  
  .filter-section {
    padding: 12px;
  }
}

@media (max-width: 992px) {
  .monitor-page-wrapper {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .monitor-page-wrapper {
    padding: 12px;
  }
  
  .filter-section {
    padding: 12px;
  }
  
  .toolbar-section {
    flex-direction: column;
  }
  
  .toolbar-section :deep(.ant-btn) {
    width: 100%;
    margin-left: 0 !important;
  }
}

@media (max-width: 576px) {
  .monitor-page-wrapper {
    padding: 12px;
  }
  
  .table-pagination {
    justify-content: center;
  }
  
  .table-pagination :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
