<template>
  <a-config-provider :locale="zhCN">
    <AppLayout>
      <div class="integration-setting">
        <div class="integration-page">
          <!-- 页面标题 -->
          <h2 class="page-title">系统集成</h2>

          <a-card>
            <a-tabs default-active-key="erp" class="integration-tabs">
              <!-- ERP集成 -->
              <a-tab-pane key="erp" tab="ERP集成">
                <div class="section-content">
                  <div class="integration-list">
                    <div class="integration-item">
                      <div class="integration-header">
                        <div class="integration-info">
                          <h4 class="integration-name">SAP集成</h4>
                          <p class="integration-desc">与SAP系统进行数据同步和交互</p>
                        </div>
                        <a-switch
                          v-model:checked="integrationConfig.erp.sap.enabled"
                          :checked-children="'启用'"
                          :un-checked-children="'停用'"
                        />
                      </div>
                      <div v-if="integrationConfig.erp.sap.enabled" class="integration-config">
                        <a-form layout="vertical">
                          <a-row :gutter="16">
                            <a-col :span="12">
                              <a-form-item label="服务器地址">
                                <a-input
                                  v-model:value="integrationConfig.erp.sap.host"
                                  placeholder="请输入SAP服务器地址"
                                />
                              </a-form-item>
                            </a-col>
                            <a-col :span="12">
                              <a-form-item label="端口号">
                                <a-input
                                  v-model:value="integrationConfig.erp.sap.port"
                                  placeholder="请输入端口号"
                                />
                              </a-form-item>
                            </a-col>
                          </a-row>
                          <a-row :gutter="16">
                            <a-col :span="12">
                              <a-form-item label="系统编号">
                                <a-input
                                  v-model:value="integrationConfig.erp.sap.systemId"
                                  placeholder="请输入系统编号"
                                />
                              </a-form-item>
                            </a-col>
                            <a-col :span="12">
                              <a-form-item label="客户端">
                                <a-input
                                  v-model:value="integrationConfig.erp.sap.client"
                                  placeholder="请输入客户端编号"
                                />
                              </a-form-item>
                            </a-col>
                          </a-row>
                        </a-form>
                      </div>
                    </div>

                    <div class="integration-item">
                      <div class="integration-header">
                        <div class="integration-info">
                          <h4 class="integration-name">用友U8集成</h4>
                          <p class="integration-desc">与用友U8系统进行数据对接</p>
                        </div>
                        <a-switch
                          v-model:checked="integrationConfig.erp.yonyou.enabled"
                          :checked-children="'启用'"
                          :un-checked-children="'停用'"
                        />
                      </div>
                      <div v-if="integrationConfig.erp.yonyou.enabled" class="integration-config">
                        <a-form layout="vertical">
                          <a-row :gutter="16">
                            <a-col :span="12">
                              <a-form-item label="服务器地址">
                                <a-input
                                  v-model:value="integrationConfig.erp.yonyou.host"
                                  placeholder="请输入服务器地址"
                                />
                              </a-form-item>
                            </a-col>
                            <a-col :span="12">
                              <a-form-item label="端口号">
                                <a-input
                                  v-model:value="integrationConfig.erp.yonyou.port"
                                  placeholder="请输入端口号"
                                />
                              </a-form-item>
                            </a-col>
                          </a-row>
                        </a-form>
                      </div>
                    </div>
                  </div>
                </div>
              </a-tab-pane>

              <!-- MES集成 -->
              <a-tab-pane key="mes" tab="MES集成">
                <div class="section-content">
                  <div class="integration-list">
                    <div class="integration-item">
                      <div class="integration-header">
                        <div class="integration-info">
                          <h4 class="integration-name">西门子MES</h4>
                          <p class="integration-desc">与西门子Opcenter进行生产数据集成</p>
                        </div>
                        <a-switch
                          v-model:checked="integrationConfig.mes.siemens.enabled"
                          :checked-children="'启用'"
                          :un-checked-children="'停用'"
                        />
                      </div>
                      <div v-if="integrationConfig.mes.siemens.enabled" class="integration-config">
                        <a-form layout="vertical">
                          <a-row :gutter="16">
                            <a-col :span="12">
                              <a-form-item label="服务器地址">
                                <a-input
                                  v-model:value="integrationConfig.mes.siemens.host"
                                  placeholder="请输入服务器地址"
                                />
                              </a-form-item>
                            </a-col>
                            <a-col :span="12">
                              <a-form-item label="API密钥">
                                <a-input-password
                                  v-model:value="integrationConfig.mes.siemens.apiKey"
                                  placeholder="请输入API密钥"
                                />
                              </a-form-item>
                            </a-col>
                          </a-row>
                        </a-form>
                      </div>
                    </div>
                  </div>
                </div>
              </a-tab-pane>

              <!-- WMS集成 -->
              <a-tab-pane key="wms" tab="WMS集成">
                <div class="section-content">
                  <div class="integration-list">
                    <div class="integration-item">
                      <div class="integration-header">
                        <div class="integration-info">
                          <h4 class="integration-name">仓库管理系统</h4>
                          <p class="integration-desc">与WMS系统进行库存数据同步</p>
                        </div>
                        <a-switch
                          v-model:checked="integrationConfig.wms.standard.enabled"
                          :checked-children="'启用'"
                          :un-checked-children="'停用'"
                        />
                      </div>
                      <div v-if="integrationConfig.wms.standard.enabled" class="integration-config">
                        <a-form layout="vertical">
                          <a-row :gutter="16">
                            <a-col :span="12">
                              <a-form-item label="服务器地址">
                                <a-input
                                  v-model:value="integrationConfig.wms.standard.host"
                                  placeholder="请输入服务器地址"
                                />
                              </a-form-item>
                            </a-col>
                            <a-col :span="12">
                              <a-form-item label="仓库编码">
                                <a-input
                                  v-model:value="integrationConfig.wms.standard.warehouseCode"
                                  placeholder="请输入仓库编码"
                                />
                              </a-form-item>
                            </a-col>
                          </a-row>
                        </a-form>
                      </div>
                    </div>
                  </div>
                </div>
              </a-tab-pane>

              <!-- 数据同步 -->
              <a-tab-pane key="sync" tab="数据同步">
                <div class="section-content">
                  <div class="sync-config">
                    <h4 class="config-section-title">同步任务配置</h4>
                    <a-table
                      :columns="syncTaskColumns"
                      :data-source="syncTaskList"
                      row-key="id"
                      :pagination="false"
                    >
                      <template #status="{ record }">
                        <a-switch
                          :checked="record.enabled"
                          :checked-children="'启用'"
                          :un-checked-children="'停用'"
                          @change="() => toggleSyncTask(record)"
                        />
                      </template>
                      <template #frequency="{ record }">
                        <a-select
                          v-model:value="record.frequency"
                          style="width: 120px"
                        >
                          <a-select-option value="realtime">实时</a-select-option>
                          <a-select-option value="5min">5分钟</a-select-option>
                          <a-select-option value="15min">15分钟</a-select-option>
                          <a-select-option value="30min">30分钟</a-select-option>
                          <a-select-option value="1hour">1小时</a-select-option>
                          <a-select-option value="daily">每天</a-select-option>
                        </a-select>
                      </template>
                      <template #action="{ record }">
                        <a-button type="link" @click="handleRunSync(record)">
                          立即执行
                        </a-button>
                      </template>
                    </a-table>
                  </div>

                  <div class="sync-log">
                    <h4 class="config-section-title">最近同步记录</h4>
                    <a-table
                      :columns="syncLogColumns"
                      :data-source="syncLogList"
                      row-key="id"
                      :pagination="{ pageSize: 5 }"
                    >
                      <template #status="{ record }">
                        <a-tag :color="getSyncStatusColor(record.status)">
                          {{ getSyncStatusText(record.status) }}
                        </a-tag>
                      </template>
                    </a-table>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>

            <!-- 保存按钮 -->
            <div class="form-actions">
              <a-button type="primary" @click="handleSave">保存配置</a-button>
              <a-button style="margin-left: 8px" @click="handleTestConnection">测试连接</a-button>
            </div>
          </a-card>
        </div>
      </div>
    </AppLayout>
  </a-config-provider>
</template>

<script setup lang="ts">
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

// 集成配置数据
const integrationConfig = reactive({
  erp: {
    sap: {
      enabled: false,
      host: '',
      port: '',
      systemId: '',
      client: ''
    },
    yonyou: {
      enabled: false,
      host: '',
      port: ''
    }
  },
  mes: {
    siemens: {
      enabled: false,
      host: '',
      apiKey: ''
    }
  },
  wms: {
    standard: {
      enabled: false,
      host: '',
      warehouseCode: ''
    }
  }
});

// 同步任务列配置
const syncTaskColumns = [
  { title: '任务名称', dataIndex: 'name', key: 'name' },
  { title: '同步方向', dataIndex: 'direction', key: 'direction' },
  { title: '数据类型', dataIndex: 'dataType', key: 'dataType' },
  { title: '同步频率', key: 'frequency', slots: { customRender: 'frequency' } },
  { title: '状态', key: 'status', slots: { customRender: 'status' } },
  { title: '操作', key: 'action', slots: { customRender: 'action' } }
];

// 同步任务列表
const syncTaskList = ref([
  { id: 1, name: '物料主数据同步', direction: 'ERP→EIMS', dataType: '物料', frequency: 'daily', enabled: true },
  { id: 2, name: '生产订单同步', direction: 'ERP→EIMS', dataType: '订单', frequency: '15min', enabled: true },
  { id: 3, name: '库存数据同步', direction: 'WMS→EIMS', dataType: '库存', frequency: '5min', enabled: false },
  { id: 4, name: '生产报工同步', direction: 'MES→EIMS', dataType: '报工', frequency: 'realtime', enabled: true }
]);

// 同步日志列配置
const syncLogColumns = [
  { title: '同步时间', dataIndex: 'syncTime', key: 'syncTime' },
  { title: '任务名称', dataIndex: 'taskName', key: 'taskName' },
  { title: '数据量', dataIndex: 'dataCount', key: 'dataCount' },
  { title: '状态', key: 'status', slots: { customRender: 'status' } },
  { title: '耗时', dataIndex: 'duration', key: 'duration' }
];

// 同步日志列表
const syncLogList = ref([
  { id: 1, syncTime: '2026-03-28 15:30:25', taskName: '物料主数据同步', dataCount: 1250, status: 'success', duration: '12s' },
  { id: 2, syncTime: '2026-03-28 15:15:10', taskName: '生产订单同步', dataCount: 45, status: 'success', duration: '3s' },
  { id: 3, syncTime: '2026-03-28 15:00:05', taskName: '库存数据同步', dataCount: 8900, status: 'failed', duration: '45s' },
  { id: 4, syncTime: '2026-03-28 14:45:20', taskName: '生产报工同步', dataCount: 320, status: 'success', duration: '5s' },
  { id: 5, syncTime: '2026-03-28 14:30:15', taskName: '物料主数据同步', dataCount: 1200, status: 'success', duration: '10s' }
]);

// 获取同步状态颜色
const getSyncStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    success: 'success',
    failed: 'error',
    running: 'processing'
  };
  return colorMap[status] || 'default';
};

// 获取同步状态文本
const getSyncStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    success: '成功',
    failed: '失败',
    running: '进行中'
  };
  return textMap[status] || status;
};

// 切换同步任务状态
const toggleSyncTask = (record: any) => {
  record.enabled = !record.enabled;
  message.success(`同步任务"${record.name}"已${record.enabled ? '启用' : '停用'}`);
};

// 立即执行同步
const handleRunSync = (record: any) => {
  message.info(`正在执行"${record.name}"...`);
  // 模拟执行
  setTimeout(() => {
    message.success(`"${record.name}"执行完成`);
  }, 1500);
};

// 保存配置
const handleSave = () => {
  message.success('系统集成配置保存成功');
};

// 测试连接
const handleTestConnection = () => {
  message.info('正在测试连接...');
  // 模拟测试
  setTimeout(() => {
    message.success('连接测试成功');
  }, 2000);
};
</script>

<style scoped>
.integration-setting {
  width: 100%;
  padding: 1.5%;
}

.integration-page {
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

.integration-tabs {
  margin-top: 0;
}

/* 卡片样式 */
.integration-page :deep(.ant-card) {
  border-radius: 8px;
  box-shadow: none;
  border: none;
  margin-bottom: 24px;
}

.section-content {
  padding: 20px 0;
}

/* 集成项样式 */
.integration-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.integration-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
}

.integration-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.integration-info {
  flex: 1;
}

.integration-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.integration-desc {
  font-size: 13px;
  color: #8c8c8c;
  margin: 0;
}

.integration-config {
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

/* 同步配置样式 */
.sync-config {
  margin-bottom: 32px;
}

.config-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.sync-log {
  margin-top: 24px;
}

/* 表单操作按钮 */
.form-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-start;
}
</style>
