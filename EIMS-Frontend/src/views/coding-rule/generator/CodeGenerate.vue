<template>
  <AppLayout>
    <a-config-provider :locale="zhCN">
      <div class="code-generate-container">
        <div class="code-generate-page">
          <!-- 页面标题 -->
          <h2 class="page-title">编码生成</h2>
          
          <!-- 状态筛选标签 -->
          <div class="status-filter">
            <a-radio-group v-model:value="statusFilter" button-style="solid" @change="handleStatusFilterChange">
              <a-radio-button value="all">全部</a-radio-button>
              <a-radio-button value="bound">已绑定</a-radio-button>
              <a-radio-button value="unbound">未绑定</a-radio-button>
              <a-radio-button value="invalid">已作废</a-radio-button>
            </a-radio-group>
            <span class="filter-count">共 {{ filteredResults.length }} 条记录</span>
          </div>

          <a-card class="generate-card">
          <a-form layout="vertical">
            <!-- 选择编码规则 -->
            <a-form-item label="选择编码规则">
              <a-select v-model:value="formData.ruleId" style="width: 100%">
                <a-select-option value="1">设备编码规则-生产车间</a-select-option>
                <a-select-option value="2">产品编码规则</a-select-option>
                <a-select-option value="3">订单编码规则</a-select-option>
              </a-select>
            </a-form-item>
            
            <!-- 规则预览 -->
            <a-form-item label="规则预览：">
              <div class="rule-preview">EQ-CN01-2602-0045</div>
            </a-form-item>
            
            <!-- 生成方式 -->
            <a-form-item label="生成方式">
              <a-radio-group v-model:value="formData.generateType">
                <a-radio value="single">单条生成</a-radio>
                <a-radio value="batch">批量生成</a-radio>
              </a-radio-group>
            </a-form-item>
            
            <!-- 批量生成数量 -->
            <a-form-item label="批量生成数量" v-if="formData.generateType === 'batch'">
              <a-input-number v-model:value="formData.batchCount" :min="1" :max="100" style="width: 200px" />
            </a-form-item>
            
            <!-- 操作按钮 -->
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleGenerateCode">生成编码</a-button>
                <a-button @click="handleExportResult">导出结果</a-button>
                <a-button @click="handleClear">清空</a-button>
              </a-space>
            </a-form-item>
          </a-form>
          
          <!-- 生成结果 -->
          <div class="result-section">
            <h3 class="result-title">生成结果</h3>
            <a-table :columns="columns" :data-source="paginatedResults" row-key="id" size="small" :pagination="false">
            <template #status="{ record }">
              <a-tag :color="getStatusColor(record.status)" :bordered="false">{{ getStatusText(record.status) }}</a-tag>
            </template>
            <template #action="{ record }">
              <a-button size="small" @click="handleCopyCode(record.code)">复制</a-button>
            </template>
          </a-table>
            
            <!-- 分页 -->
            <div class="rule-pagination-container">
              <a-pagination
                v-model:current="pagination.current"
                v-model:pageSize="pagination.pageSize"
                :total="filteredResults.length"
                :showSizeChanger="true"
                :pageSizeOptions="PAGE_SIZE_OPTIONS"
                :showTotal="showTotal"
                showQuickJumper
                size="default"
              />
            </div>
          </div>
        </a-card>
        </div>
      </div>
    </a-config-provider>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import AppLayout from '../layout/AppLayout.vue';

const route = useRoute();

const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;

const formData = ref({
  ruleId: '1',
  generateType: 'single',
  batchCount: 10
});

const statusFilter = ref('all');

const pagination = ref({
  current: 1,
  pageSize: 10
});

const columns = [
  {
    title: '编码',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '规则名称',
    dataIndex: 'ruleName',
    key: 'ruleName'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    slots: { customRender: 'status' }
  },
  {
    title: '生成时间',
    dataIndex: 'generateTime',
    key: 'generateTime'
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' }
  }
];

const generatedResults = ref([
  {
    id: '1',
    code: 'EQ-CN01-2602-0045',
    ruleName: '设备编码规则',
    status: 'bound',
    generateTime: '2026-02-23 10:00:00'
  }
]);

const filteredResults = computed(() => {
  if (statusFilter.value === 'all') {
    return generatedResults.value;
  }
  return generatedResults.value.filter(item => item.status === statusFilter.value);
});

const paginatedResults = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredResults.value.slice(start, end);
});

const showTotal = (total: number) => `共 ${total} 条记录`;

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    bound: 'green',
    unbound: 'blue',
    invalid: 'red'
  };
  return colorMap[status] || 'default';
};

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    bound: '已绑定',
    unbound: '未绑定',
    invalid: '已作废'
  };
  return textMap[status] || status;
};

const handleStatusFilterChange = () => {
  pagination.value.current = 1;
};

const handleGenerateCode = () => {
  const newCodes = [];
  const count = formData.value.generateType === 'batch' ? formData.value.batchCount : 1;
  
  for (let i = 0; i < count; i++) {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const sequence = String(generatedResults.value.length + i + 1).padStart(4, '0');
    
    let code = '';
    if (formData.value.ruleId === '1') {
      code = `EQ-CN01-${year}${month}-${sequence}`;
    } else if (formData.value.ruleId === '2') {
      code = `PR-${year}${month}-${sequence}`;
    } else if (formData.value.ruleId === '3') {
      code = `ORD-${year}${month}-${sequence}`;
    }
    
    newCodes.push({
      id: String(generatedResults.value.length + i + 1),
      code: code,
      ruleName: formData.value.ruleId === '1' ? '设备编码规则' : 
                formData.value.ruleId === '2' ? '产品编码规则' : '订单编码规则',
      status: 'unbound',
      generateTime: now.toLocaleString('zh-CN')
    });
  }
  
  generatedResults.value = [...generatedResults.value, ...newCodes];
  console.log('生成编码成功:', newCodes);
};

const handleExportResult = () => {
  if (filteredResults.value.length === 0) {
    console.log('没有可导出的数据');
    return;
  }
  
  const headers = ['编码', '规则名称', '状态', '生成时间'];
  const csvContent = [
    headers.join(','),
    ...filteredResults.value.map(item => [
      item.code,
      item.ruleName,
      getStatusText(item.status),
      item.generateTime
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `编码生成结果_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('导出结果成功:', filteredResults.value.length, '条记录');
};

const handleClear = () => {
  generatedResults.value = [];
  pagination.value.current = 1;
};

const handleCopyCode = (code: string) => {
  navigator.clipboard.writeText(code).then(() => {
    console.log('复制成功:', code);
  });
};

onMounted(() => {
  const status = route.query.status as string;
  if (status && ['bound', 'unbound', 'invalid'].includes(status)) {
    statusFilter.value = status;
  }
});
</script>

<style scoped>
.code-generate-container {
  width: 100%;
  padding: 1.5%;
}

.code-generate-page {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background-color: #fafafa;
  border-radius: 8px;
}

.filter-count {
  font-size: 14px;
  color: #8c8c8c;
}

.generate-card {
  border-radius: 8px;
  box-shadow: none;
  border: none;
  margin-bottom: 24px;
}

.rule-preview {
  padding: 8px 12px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  font-weight: 500;
  color: #1890ff;
}

.result-section {
  margin-top: 32px;
}

.result-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.rule-pagination-container {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}

/* 表格样式 */
.generate-card :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.generate-card :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}
</style>
