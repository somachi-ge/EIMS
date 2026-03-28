<template>
  <AppLayout>
    <div class="parse-container">
      <div class="parse-page">
        <!-- 页面标题 -->
        <h2 class="page-title">编码解析</h2>
        
        <a-card class="parse-card">
        <div class="parse-input-section">
          <a-input
            v-model:value="formState.code"
            placeholder="请输入要解析的编码"
            allow-clear
            class="parse-input"
          />
          <a-button type="primary" @click="handleParse" class="parse-button">
            解析
          </a-button>
        </div>
        
        <!-- 解析结果 -->
        <div v-if="parseResult" class="parse-result">
          <div class="parse-success">解析成功</div>
          <div class="parse-info">
            <div class="info-item">
              <span class="info-label">编码：</span>
              <span class="info-value">{{ parseResult.code }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">规则名称：</span>
              <span class="info-value">{{ parseResult.ruleName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">固定段：</span>
              <span class="info-value">{{ parseResult.fixedSegment }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">车间产线：</span>
              <span class="info-value">{{ parseResult.workshopLine }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">日期段：</span>
              <span class="info-value">{{ parseResult.dateSegment }} ({{ parseResult.dateFull }})</span>
            </div>
            <div class="info-item">
              <span class="info-label">流水号：</span>
              <span class="info-value">{{ parseResult.serialNumber }}</span>
            </div>
          </div>
        </div>
        </a-card>

        <!-- 最近解析历史 -->
        <a-card class="history-card" v-if="parseHistory.length > 0">
          <div class="history-title">最近解析历史</div>
          <div class="history-list">
            <div
              v-for="item in parseHistory"
              :key="item.id"
              class="history-item"
              @click="handleHistoryClick(item.code)"
            >
              <span class="history-code">{{ item.code }}</span>
              <span class="history-time">{{ item.parseTime }}</span>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppLayout from '../layout/AppLayout.vue';

// 历史记录类型定义
interface ParseHistoryItem {
  id: string;
  code: string;
  parseTime: string;
}

// 表单状态
const formState = ref({
  code: 'EQ-CN01-2602-0045'
});

// 解析结果
const parseResult = ref<any>(null);

// 解析历史记录
const parseHistory = ref<ParseHistoryItem[]>([
  { id: '1', code: 'M-20260303-000001', parseTime: '2026-03-03 15:20' },
  { id: '2', code: 'EQ-20260302-00045', parseTime: '2026-03-03 10:11' },
  { id: '3', code: 'WO-20260301-00123', parseTime: '2026-03-02 17:40' }
]);

// 生成唯一ID
const generateId = () => Date.now().toString();

// 格式化时间
const formatTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 添加历史记录
const addToHistory = (code: string) => {
  // 检查是否已存在相同编码
  const existingIndex = parseHistory.value.findIndex(item => item.code === code);
  if (existingIndex !== -1) {
    // 移除已存在的记录
    parseHistory.value.splice(existingIndex, 1);
  }
  
  // 添加新记录到开头
  parseHistory.value.unshift({
    id: generateId(),
    code: code,
    parseTime: formatTime(new Date())
  });
  
  // 限制历史记录数量为10条
  if (parseHistory.value.length > 10) {
    parseHistory.value = parseHistory.value.slice(0, 10);
  }
};

// 解析编码
const handleParse = () => {
  if (!formState.value.code) {
    return;
  }
  
  // 模拟解析结果
  parseResult.value = {
    code: formState.value.code,
    ruleName: '设备编码规则-生产车间',
    fixedSegment: 'EQ-',
    workshopLine: 'CN01',
    dateSegment: '2602',
    dateFull: '2026年02月',
    serialNumber: '0045'
  };
  
  // 添加到历史记录
  addToHistory(formState.value.code);
};

// 点击历史记录
const handleHistoryClick = (code: string) => {
  formState.value.code = code;
  handleParse();
};
</script>

<style scoped>
.parse-container {
  width: 100%;
  padding: 1.5%;
}

.parse-page {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.parse-card {
  border-radius: 8px;
  box-shadow: none;
  border: none;
  margin-bottom: 24px;
}

.parse-input-section {
  display: flex;
  margin-bottom: 20px;
}

.parse-input {
  flex: 1;
  margin-right: 10px;
}

.parse-button {
  white-space: nowrap;
}

.parse-result {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #fafafa;
}

.parse-success {
  color: #52c41a;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.parse-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  width: 80px;
  font-weight: 500;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

/* 历史记录样式 */
.history-card {
  border-radius: 8px;
  box-shadow: none;
  border: none;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item:hover {
  background-color: #f5f5f5;
  margin: 0 -12px;
  padding: 12px;
}

.history-code {
  font-size: 14px;
  color: #262626;
}

.history-time {
  font-size: 13px;
  color: #8c8c8c;
}
</style>
