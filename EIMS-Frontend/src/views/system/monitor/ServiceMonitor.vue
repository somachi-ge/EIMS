<template>
  <div class="service-monitor-page">
    <a-config-provider :locale="zhCN">
      <div class="monitor-page-wrapper">
        <a-card class="monitor-content-card">
          <div class="card-content">
            <!-- 搜索区域 -->
            <div class="filter-section" style="overflow-x: auto;">
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
                    <a-select-option value="running">运行中</a-select-option>
                    <a-select-option value="stopped">已停止</a-select-option>
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

            <!-- 工具栏 -->
            <div class="toolbar-section">
              <a-button type="primary" @click="handleRefresh">
                <template #icon><reload-outlined /></template>
                刷新
              </a-button>
            </div>
          
            <!-- 表格区域 -->
            <div class="table-section">
              <a-table
                :columns="columns"
                :data-source="displayedServices"
                :pagination="false"
                row-key="id"
                size="small"
                class="service-table"
                :scroll="{ x: 800 }"
              >
                <template #serviceStatus="{ record }">
                  <a-tag 
                    :color="record.serviceStatus === 'running' ? 'green' : 'red'"
                    :bordered="false"
                  >
                    {{ record.serviceStatus === 'running' ? '运行中' : '已停止' }}
                  </a-tag>
                </template>

                <template #serviceAction="{ record }">
                  <a-space>
                    <a-button 
                      type="primary" 
                      size="small"
                      class="start-btn"
                      :disabled="record.serviceStatus === 'running'"
                      @click="handleStartService(record)"
                    >
                      启动
                    </a-button>
                    <a-button 
                      type="primary" 
                      size="small"
                      danger
                      :disabled="record.serviceStatus === 'stopped'"
                      @click="handleStopService(record)"
                    >
                      停止
                    </a-button>
                    <a-button 
                      size="small"
                      @click="handleViewDetails(record)"
                    >
                      详情
                    </a-button>
                  </a-space>
                </template>
              </a-table>

              <a-pagination
                v-model:current="paginationConfig.current"
                v-model:pageSize="paginationConfig.pageSize"
                :total="filteredServices.length"
                :showSizeChanger="true"
                :pageSizeOptions="['10', '20', '50']"
                :showTotal="renderTotalText"
                :showQuickJumper="true"
                class="table-pagination"
              />
            </div>
          </div>
        </a-card>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

/**
 * 服务信息接口
 */
interface ServiceInfo {
  /** 服务ID */
  id: number;
  /** 服务名称 */
  serviceName: string;
  /** 服务状态 */
  serviceStatus: 'running' | 'stopped';
  /** 服务版本 */
  serviceVersion: string;
  /** 运行时间(小时) */
  uptimeHours: number;
  /** 服务描述 */
  description: string;
  /** 服务端口 */
  port: number;
  /** 最后启动时间 */
  lastStartTime: string;
}

/**
 * 分页配置接口
 */
interface PaginationConfig {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
}

/**
 * 过滤表单接口
 */
interface FilterForm {
  keyword: string;
  dateRange: [string, string] | null;
  status: string;
}

// 服务列表数据
const services = ref<ServiceInfo[]>([
  {
    id: 1,
    serviceName: 'API网关服务',
    serviceStatus: 'running',
    serviceVersion: '2.1.0',
    uptimeHours: 168,
    description: '统一API网关，负责请求路由和鉴权',
    port: 8080,
    lastStartTime: '2024-01-15 08:00:00'
  },
  {
    id: 2,
    serviceName: '用户认证服务',
    serviceStatus: 'running',
    serviceVersion: '1.5.2',
    uptimeHours: 168,
    description: '用户登录认证和权限管理',
    port: 8081,
    lastStartTime: '2024-01-15 08:00:00'
  },
  {
    id: 3,
    serviceName: '数据库服务',
    serviceStatus: 'running',
    serviceVersion: '14.2',
    uptimeHours: 720,
    description: 'PostgreSQL主数据库服务',
    port: 5432,
    lastStartTime: '2024-01-01 00:00:00'
  },
  {
    id: 4,
    serviceName: '缓存服务',
    serviceStatus: 'running',
    serviceVersion: '7.0.8',
    uptimeHours: 720,
    description: 'Redis缓存服务',
    port: 6379,
    lastStartTime: '2024-01-01 00:00:00'
  },
  {
    id: 5,
    serviceName: '消息队列服务',
    serviceStatus: 'stopped',
    serviceVersion: '3.11.0',
    uptimeHours: 0,
    description: 'RabbitMQ消息队列服务',
    port: 5672,
    lastStartTime: '2024-01-10 14:30:00'
  },
  {
    id: 6,
    serviceName: '文件存储服务',
    serviceStatus: 'running',
    serviceVersion: '1.2.0',
    uptimeHours: 168,
    description: '分布式文件存储服务',
    port: 9000,
    lastStartTime: '2024-01-15 08:00:00'
  },
  {
    id: 7,
    serviceName: '日志收集服务',
    serviceStatus: 'running',
    serviceVersion: '8.11.0',
    uptimeHours: 720,
    description: 'ELK日志收集与分析服务',
    port: 9200,
    lastStartTime: '2024-01-01 00:00:00'
  },
  {
    id: 8,
    serviceName: '定时任务服务',
    serviceStatus: 'stopped',
    serviceVersion: '1.0.5',
    uptimeHours: 0,
    description: '定时任务调度服务',
    port: 8085,
    lastStartTime: '2024-01-12 09:15:00'
  },
  {
    id: 9,
    serviceName: '邮件通知服务',
    serviceStatus: 'running',
    serviceVersion: '2.3.1',
    uptimeHours: 168,
    description: '邮件发送与通知服务',
    port: 8086,
    lastStartTime: '2024-01-15 08:00:00'
  },
  {
    id: 10,
    serviceName: '短信推送服务',
    serviceStatus: 'running',
    serviceVersion: '1.8.0',
    uptimeHours: 168,
    description: '短信验证码及推送服务',
    port: 8087,
    lastStartTime: '2024-01-15 08:00:00'
  }
]);

// 过滤表单
const filterForm = reactive<FilterForm>({
  keyword: '',
  dateRange: null,
  status: ''
});

// 分页配置
const paginationConfig = reactive<PaginationConfig>({
  current: 1,
  pageSize: 10
});

// 表格列配置
const columns = [
  {
    title: '服务名称',
    dataIndex: 'serviceName',
    key: 'serviceName',
    width: 150
  },
  {
    title: '服务状态',
    key: 'serviceStatus',
    width: 100,
    slots: {
      customRender: 'serviceStatus'
    }
  },
  {
    title: '版本',
    dataIndex: 'serviceVersion',
    key: 'serviceVersion',
    width: 100
  },
  {
    title: '运行时间',
    key: 'uptimeHours',
    width: 120,
    customRender: ({ text }: { text: number }) => {
      return text > 0 ? `${text}小时` : '-';
    }
  },
  {
    title: '服务端口',
    dataIndex: 'port',
    key: 'port',
    width: 100
  },
  {
    title: '服务描述',
    dataIndex: 'description',
    key: 'description',
    width: 250
  },
  {
    title: '操作',
    key: 'serviceAction',
    width: 200,
    fixed: 'right',
    slots: {
      customRender: 'serviceAction'
    }
  }
];

/**
 * 过滤后的服务列表
 */
const filteredServices = computed(() => {
  let result = [...services.value];
  
  if (filterForm.keyword) {
    const lowerKeyword = filterForm.keyword.toLowerCase();
    result = result.filter(service => 
      service.serviceName.toLowerCase().includes(lowerKeyword) ||
      service.description.toLowerCase().includes(lowerKeyword) ||
      service.serviceVersion.toLowerCase().includes(lowerKeyword)
    );
  }
  
  if (filterForm.status) {
    result = result.filter(service => service.serviceStatus === filterForm.status);
  }
  
  return result;
});

/**
 * 当前页显示的服务列表
 */
const displayedServices = computed(() => {
  const startIndex = (paginationConfig.current - 1) * paginationConfig.pageSize;
  const endIndex = startIndex + paginationConfig.pageSize;
  return filteredServices.value.slice(startIndex, endIndex);
});

/**
 * 渲染分页总条数文本
 */
const renderTotalText = (total: number) => `共 ${total} 条记录`;

/**
 * 处理搜索
 */
const handleSearch = () => {
  paginationConfig.current = 1;
  message.success(`搜索完成，共找到 ${filteredServices.value.length} 个服务`);
};

/**
 * 处理重置
 */
const handleReset = () => {
  Object.assign(filterForm, {
    keyword: '',
    dateRange: null,
    status: ''
  });
  paginationConfig.current = 1;
  message.success('表单已重置，服务列表已恢复');
};

/**
 * 刷新服务列表
 */
const handleRefresh = () => {
  message.success('服务列表已刷新');
  loadServiceData();
};

/**
 * 启动服务
 */
const handleStartService = (record: ServiceInfo) => {
  message.success(`正在启动服务: ${record.serviceName}`);
  // 实际应调用API启动服务
  setTimeout(() => {
    record.serviceStatus = 'running';
    record.uptimeHours = 0;
    record.lastStartTime = new Date().toLocaleString();
    message.success(`服务 ${record.serviceName} 启动成功`);
  }, 1000);
};

/**
 * 停止服务
 */
const handleStopService = (record: ServiceInfo) => {
  message.warning(`正在停止服务: ${record.serviceName}`);
  // 实际应调用API停止服务
  setTimeout(() => {
    record.serviceStatus = 'stopped';
    record.uptimeHours = 0;
    message.success(`服务 ${record.serviceName} 已停止`);
  }, 1000);
};

/**
 * 查看服务详情
 */
const handleViewDetails = (record: ServiceInfo) => {
  message.info(`查看服务详情: ${record.serviceName}`);
  // 实际应打开详情弹窗或跳转详情页
};

/**
 * 加载服务监控数据
 */
const loadServiceData = () => {
  // 这里应该调用实际的API接口
  // const response = await monitorApi.getServiceList({
  //   page: paginationConfig.current,
  //   page_size: paginationConfig.pageSize
  // });
  // services.value = response.data.list;
};

onMounted(() => {
  loadServiceData();
});
</script>

<style scoped>
.service-monitor-page {
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

.start-btn:not(:disabled) {
  background-color: #52c41a;
  border-color: #52c41a;
}

.start-btn:not(:disabled):hover {
  background-color: #73d13d;
  border-color: #73d13d;
}

.service-table {
  border-radius: 4px;
}

.service-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.service-table :deep(.ant-table-tbody > tr > td) {
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
