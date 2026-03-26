<template>
  <AppLayout>
    <a-config-provider :locale="zhCN">
      <div class="code-generate-container">
        
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
            <template #action="{ record }">
              <a-button size="small" @click="handleCopyCode(record.code)">复制</a-button>
            </template>
          </a-table>
            
            <!-- 分页 -->
            <div class="rule-pagination-container">
              <a-pagination
                v-model:current="pagination.current"
                v-model:pageSize="pagination.pageSize"
                :total="generatedResults.length"
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
    </a-config-provider>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import AppLayout from '../layout/AppLayout.vue';

// 常量定义
const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;

// 表单数据
const formData = ref({
  ruleId: '1',
  generateType: 'single',
  batchCount: 10
});

// 分页数据
const pagination = ref({
  current: 1,
  pageSize: 10
});

// 生成结果列定义
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

// 生成结果数据
const generatedResults = ref([
  {
    id: '1',
    code: 'EQ-CN01-2602-0045',
    ruleName: '设备编码规则',
    generateTime: '2026-02-23 10:00:00'
  }
]);

// 分页后的结果
const paginatedResults = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return generatedResults.value.slice(start, end);
});

// 显示总数
const showTotal = (total: number) => `共 ${total} 条记录`;

// 生成编码
const handleGenerateCode = () => {
  // 模拟生成编码
  const newCodes = [];
  const count = formData.value.generateType === 'batch' ? formData.value.batchCount : 1;
  
  for (let i = 0; i < count; i++) {
    // 生成时间戳部分
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // 生成序号部分
    const sequence = String(generatedResults.value.length + i + 1).padStart(4, '0');
    
    // 根据选择的规则生成编码
    let code = '';
    if (formData.value.ruleId === '1') {
      code = `EQ-CN01-${year}${month}-${sequence}`;
    } else if (formData.value.ruleId === '2') {
      code = `PR-${year}${month}-${sequence}`;
    } else if (formData.value.ruleId === '3') {
      code = `ORD-${year}${month}-${sequence}`;
    }
    
    // 添加到结果中
    newCodes.push({
      id: String(generatedResults.value.length + i + 1),
      code: code,
      ruleName: formData.value.ruleId === '1' ? '设备编码规则' : 
                formData.value.ruleId === '2' ? '产品编码规则' : '订单编码规则',
      generateTime: now.toLocaleString('zh-CN')
    });
  }
  
  // 添加到生成结果中
  generatedResults.value = [...generatedResults.value, ...newCodes];
  console.log('生成编码成功:', newCodes);
};

// 导出结果
const handleExportResult = () => {
  if (generatedResults.value.length === 0) {
    console.log('没有可导出的数据');
    return;
  }
  
  // 准备CSV内容
  const headers = ['编码', '规则名称', '生成时间'];
  const csvContent = [
    headers.join(','),
    ...generatedResults.value.map(item => [
      item.code,
      item.ruleName,
      item.generateTime
    ].join(','))
  ].join('\n');
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // 设置下载属性
  link.setAttribute('href', url);
  link.setAttribute('download', `编码生成结果_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('导出结果成功:', generatedResults.value.length, '条记录');
};

// 清空
const handleClear = () => {
  generatedResults.value = [];
  pagination.value.current = 1;
};

// 复制编码
const handleCopyCode = (code: string) => {
  navigator.clipboard.writeText(code).then(() => {
    console.log('复制成功:', code);
  });
};
</script>

<style scoped>
.code-generate-container {
  width: 100%;
  padding: 1.5%;
}

.page-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.generate-card {
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
