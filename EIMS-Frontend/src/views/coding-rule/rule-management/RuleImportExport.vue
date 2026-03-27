<template>
  <AppLayout>
    <a-config-provider :locale="zhCN">
      <div class="rule-import-export-container">
        <div class="rule-import-export-page">
          <h2 class="page-title">批量导入导出</h2>
          
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="import" tab="导入规则">
              <div class="import-content">
                <a-form layout="vertical">
                  <a-form-item label="选择导入类型">
                    <a-select v-model:value="importType" style="width: 100%;">
                      <a-select-option value="equipment">设备编码规则</a-select-option>
                      <a-select-option value="workorder">工单编码规则</a-select-option>
                      <a-select-option value="material">物料编码规则</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-upload-dragger
                    name="file"
                    :before-upload="beforeUpload"
                    :on-success="onUploadSuccess"
                    :on-error="onUploadError"
                    :show-file-list="false"
                    accept=".xlsx,.xls"
                  >
                    <div class="ant-upload-drag-icon">
                      <InboxOutlined />
                    </div>
                    <p class="ant-upload-text">点击或拖拽 Excel 文件到此区域上传</p>
                    <p class="ant-upload-hint">支持 .xlsx/.xls，最大 10MB</p>
                  </a-upload-dragger>

                  <a-form-item label="导入选项">
                    <a-checkbox-group v-model:value="importOptions">
                      <a-checkbox value="updateExisting">存在则更新</a-checkbox>
                      <a-checkbox value="overwriteEnabled">覆盖已启用规则</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>

                  <div class="button-group">
                    <a-button type="primary" @click="handleImport">开始导入</a-button>
                    <a-button @click="downloadTemplate">下载导入模板</a-button>
                  </div>
                </a-form>

                <div class="preview-section">
                  <h4 class="preview-title">导入预览（示例）</h4>
                  <a-table
                    :columns="previewColumns"
                    :data-source="previewData"
                    :pagination="false"
                    :bordered="true"
                  />
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="export" tab="导出规则">
              <div class="export-content">
                <a-form layout="vertical">
                  <a-form-item label="选择导出范围">
                    <a-select
                      v-model:value="exportScope"
                      mode="multiple"
                      style="width: 100%;"
                      :options="exportScopeOptions"
                    />
                  </a-form-item>

                  <a-form-item label="导出字段">
                    <a-checkbox-group v-model:value="exportFields">
                      <a-checkbox value="ruleCode">规则编码</a-checkbox>
                      <a-checkbox value="ruleName">规则名称</a-checkbox>
                      <a-checkbox value="ruleType">规则分类</a-checkbox>
                      <a-checkbox value="effectiveDate">生效日期</a-checkbox>
                      <a-checkbox value="priority">优先级</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>

                  <a-form-item label="导出格式">
                    <a-select v-model:value="exportFormat" style="width: 100%;">
                      <a-select-option value="xlsx">Excel (.xlsx)</a-select-option>
                      <a-select-option value="csv">CSV (.csv)</a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-button type="primary" @click="handleExport">导出并下载</a-button>
                </a-form>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-config-provider>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import AppLayout from '../layout/AppLayout.vue';

// 当前活动标签页
const activeTab = ref('import');

// 导入相关
const importType = ref('equipment');
const importOptions = ref<string[]>(['updateExisting']);

// 导出相关
const exportScope = ref<string[]>([]);
const exportFields = ref<string[]>(['ruleCode', 'ruleName', 'ruleType']);
const exportFormat = ref('xlsx');

// 导出范围选项
const exportScopeOptions = [
  { label: '设备编码规则（5条）', value: 'equipment' },
  { label: '工单编码规则（3条）', value: 'workorder' },
  { label: '物料编码规则（2条）', value: 'material' },
  { label: '库位编码规则（1条）', value: 'location' }
];

// 预览表格列
const previewColumns = [
  { title: '规则编码', dataIndex: 'ruleCode', key: 'ruleCode' },
  { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
  { title: '分类', dataIndex: 'category', key: 'category' },
  { title: '状态', dataIndex: 'status', key: 'status' }
];

// 预览表格数据
const previewData = [
  {
    key: '1',
    ruleCode: 'EQ-RULE-002',
    ruleName: '设备编码规则-装配车间',
    category: '设备编码',
    status: '启用'
  },
  {
    key: '2',
    ruleCode: 'WO-RULE-002',
    ruleName: '工单编码规则-检测线',
    category: '工单编码',
    status: '启用'
  }
];

// 上传前检查
const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                 file.type === 'application/vnd.ms-excel' ||
                 file.name.endsWith('.xlsx') ||
                 file.name.endsWith('.xls');
  
  if (!isExcel) {
    message.error('只能上传Excel文件');
    return false;
  }
  
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error('文件大小不能超过10MB');
    return false;
  }
  
  return false;
};

// 上传成功
const onUploadSuccess = () => {
  message.success('文件上传成功');
};

// 上传失败
const onUploadError = () => {
  message.error('文件上传失败');
};

// 开始导入
const handleImport = () => {
  message.success('开始导入');
};

// 下载导入模板
const downloadTemplate = () => {
  message.success('下载导入模板');
};

// 导出并下载
const handleExport = () => {
  if (exportScope.value.length === 0) {
    message.warning('请选择导出范围');
    return;
  }
  message.success('导出任务已提交，文件将下载');
};
</script>

<style scoped>
.rule-import-export-container {
  width: 100%;
  padding: 1.5%;
}

.rule-import-export-page {
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

.import-content,
.export-content {
  max-width: 800px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.preview-section {
  margin-top: 32px;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #262626;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .rule-import-export-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .rule-import-export-container {
    padding: 12px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .button-group :deep(.ant-btn) {
    width: 100%;
  }
}
</style>