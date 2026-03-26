<template>
  <a-config-provider :locale="zhCN">
    <AppLayout>
      <div class="log-container">
        <a-card class="log-card">
        <!-- 搜索和筛选 -->
        <div class="log-filter" style="overflow-x: auto;">
          <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
            <div style="flex: 2; min-width: 200px;">
              <a-input
                v-model:value="searchKeyword"
                placeholder="搜索操作人或操作内容"
                allow-clear
                style="width: 100%;"
              />
            </div>
            <div style="flex: 1.5; min-width: 200px;">
              <a-date-picker
                v-model:value="dateRange"
                range-picker
                placeholder="选择操作时间"
                style="width: 100%;"
              />
            </div>
            <div style="flex: 1; min-width: 120px;">
              <a-select
                v-model:value="operationType"
                placeholder="操作类型"
                allow-clear
                style="width: 100%;"
              >
                <a-select-option value="create">创建</a-select-option>
                <a-select-option value="update">更新</a-select-option>
                <a-select-option value="delete">删除</a-select-option>
                <a-select-option value="generate">生成编码</a-select-option>
                <a-select-option value="parse">解析编码</a-select-option>
              </a-select>
            </div>
            <div style="flex: 0.5; min-width: 70px;">
              <a-button type="primary" @click="handleSearch" style="width: 100%;">
                搜索
              </a-button>
            </div>
            <div style="flex: 0.5; min-width: 70px;">
              <a-button @click="handleReset" style="width: 100%;">
                重置
              </a-button>
            </div>
          </div>
        </div>
        
        <!-- 日志列表 -->
        <a-table
          :columns="columns"
          :data-source="logData"
          :pagination="pagination"
          row-key="id"
          class="log-table"
        >
          <template #bodyCell="{ record, column }">
            <template v-if="column.key === 'operationTime'">
              {{ formatDate(record.operationTime) }}
            </template>
            <template v-else-if="column.key === 'operationType'">
              <a-tag :color="getTypeColor(record.operationType)">
                {{ getTypeText(record.operationType) }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </AppLayout>
</a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

// 搜索条件
const searchKeyword = ref('');
const dateRange = ref<any>(null);
const operationType = ref('');

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 95,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
  pageSizeOptions: ['10', '20', '50', '100']
});

// 生成模拟数据
const generateMockData = () => {
  const operators = ['管理员', '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const operationTypes = ['create', 'update', 'delete', 'generate', 'parse'];
  const ruleNames = ['设备编码规则-生产车间', '产品编码规则-成品库', '原材料编码规则-采购', '资产编码规则-财务部', '员工编码规则-人力资源'];
  
  const data = [];
  
  // 生成95条数据
  for (let i = 1; i <= 95; i++) {
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const operationType = operationTypes[Math.floor(Math.random() * operationTypes.length)];
    const ruleName = ruleNames[Math.floor(Math.random() * ruleNames.length)];
    
    // 生成随机时间（最近7天内）
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7);
    const randomDate = new Date(now);
    randomDate.setDate(now.getDate() - daysAgo);
    randomDate.setHours(Math.floor(Math.random() * 24));
    randomDate.setMinutes(Math.floor(Math.random() * 60));
    randomDate.setSeconds(Math.floor(Math.random() * 60));
    
    const formattedDate = randomDate.toISOString().slice(0, 19).replace('T', ' ');
    
    // 生成随机IP地址
    const ipAddress = `192.168.1.${Math.floor(Math.random() * 200) + 1}`;
    
    // 根据操作类型生成不同的操作内容
    let operationContent = '';
    switch (operationType) {
      case 'create':
        operationContent = `创建了编码规则：${ruleName}`;
        break;
      case 'update':
        operationContent = `更新了编码规则：${ruleName}`;
        break;
      case 'delete':
        operationContent = `删除了编码规则：${ruleName}`;
        break;
      case 'generate':
        const code = `EQ-CN0${Math.floor(Math.random() * 9) + 1}-260${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        operationContent = `生成了编码：${code}`;
        break;
      case 'parse':
        const parseCode = `EQ-CN0${Math.floor(Math.random() * 9) + 1}-260${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        operationContent = `解析了编码：${parseCode}`;
        break;
    }
    
    data.push({
      id: i,
      operator,
      operationType,
      operationContent,
      operationTime: formattedDate,
      ipAddress
    });
  }
  
  return data;
};

// 日志数据
const logData = ref(generateMockData());

// 表格列配置
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    width: 120
  },
  {
    title: '操作类型',
    dataIndex: 'operationType',
    key: 'operationType',
    width: 120
  },
  {
    title: '操作内容',
    dataIndex: 'operationContent',
    key: 'operationContent'
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    key: 'operationTime',
    width: 180
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 150
  }
];

// 格式化日期
const formatDate = (date: string) => {
  return date;
};

// 获取操作类型颜色
const getTypeColor = (type: string) => {
  switch (type) {
    case 'create': return 'green';
    case 'update': return 'blue';
    case 'delete': return 'red';
    case 'generate': return 'orange';
    case 'parse': return 'purple';
    default: return 'default';
  }
};

// 获取操作类型文本
const getTypeText = (type: string) => {
  switch (type) {
    case 'create': return '创建';
    case 'update': return '更新';
    case 'delete': return '删除';
    case 'generate': return '生成编码';
    case 'parse': return '解析编码';
    default: return type;
  }
};

// 处理搜索
const handleSearch = () => {
  // 这里可以添加搜索逻辑
  console.log('搜索条件：', {
    searchKeyword: searchKeyword.value,
    dateRange: dateRange.value,
    operationType: operationType.value
  });
};

// 处理重置
const handleReset = () => {
  searchKeyword.value = '';
  dateRange.value = null;
  operationType.value = '';
};
</script>

<style scoped>
.log-container {
  padding: 20px;
}

.log-card {
  margin-bottom: 20px;
}

.log-filter {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.log-table {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .log-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .date-picker,
  .type-select {
    width: 100%;
    max-width: none;
  }
}
</style>
