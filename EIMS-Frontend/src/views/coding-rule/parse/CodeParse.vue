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
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppLayout from '../layout/AppLayout.vue';

// 表单状态
const formState = ref({
  code: 'EQ-CN01-2602-0045'
});

// 解析结果
const parseResult = ref<any>(null);

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
</style>
