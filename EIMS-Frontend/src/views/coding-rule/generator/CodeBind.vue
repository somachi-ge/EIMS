<template>
  <AppLayout>
    <a-config-provider :locale="zhCN">
      <div class="code-bind-container">
        <div class="rule-page">
          <!-- 页面标题 -->
          <div class="page-header">
            <h2 class="page-title">编码绑定与解绑</h2>
          </div>
          
          <!-- 标签页 -->
          <a-tabs v-model:activeKey="activeTab" style="margin-bottom: 24px;">
            <a-tab-pane key="bind" tab="编码绑定"></a-tab-pane>
            <a-tab-pane key="unbind" tab="编码解绑"></a-tab-pane>
            <a-tab-pane key="bindRecord" tab="记录查询"></a-tab-pane>
          </a-tabs>
          
          <!-- 编码绑定面板 -->
          <div v-if="activeTab === 'bind'">
            <div class="section-title" style="font-size:15px;margin-bottom:12px">1. 选择编码</div>
            <div class="search-bar" style="overflow-x: auto;">
              <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
                <div style="flex: 1; min-width: 120px;">
                  <a-input v-model:value="bindSearchForm.keyword" placeholder="输入编码或流水号" @keyup.enter="handleBindSearch" allow-clear style="width: 100%;" />
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-select v-model:value="bindSearchForm.ruleId" placeholder="请选择编码规则" allow-clear style="width: 100%;">
                    <a-select-option value="">全部规则</a-select-option>
                    <a-select-option value="1">设备编码规则-生产车间</a-select-option>
                    <a-select-option value="2">工单编码规则-装配线</a-select-option>
                    <a-select-option value="3">物料编码规则-成品</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-select v-model:value="bindSearchForm.status" placeholder="请选择状态" allow-clear style="width: 100%;">
                    <a-select-option value="all">全部状态</a-select-option>
                    <a-select-option value="unbound">未绑定</a-select-option>
                    <a-select-option value="bound">已绑定</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button type="primary" @click="handleBindSearch" style="width: 100%;">搜索</a-button>
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button @click="handleBindReset" style="width: 100%;">重置</a-button>
                </div>
              </div>
            </div>
            
            <a-table
              :columns="bindColumns"
              :data-source="bindCodes"
              :pagination="false"
              @change="handleBindPaginationChange"
              row-key="code"
            >
              <template #headerCell="{ column }">
                <template v-if="column.key === 'check'">
                  <a-checkbox v-model:checked="bindCheckAll" @change="handleBindCheckAll"></a-checkbox>
                </template>
              </template>
              <template #bodyCell="{ record, column }">
                <template v-if="column.key === 'check'">
                  <a-checkbox v-model:checked="record.checked" @change="handleBindCheckChange()" :disabled="record.status !== 'unbound'"></a-checkbox>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="record.status === 'unbound' ? 'success' : 'red'">
                    {{ record.status === 'unbound' ? '未绑定' : '已绑定' }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-tooltip v-if="record.status === 'bound'" title="当前编码已绑定，无法重复绑定">
                    <a-tag 
                      :color="'default'"
                      style="cursor: not-allowed; opacity: 0.6;"
                    >
                      选择绑定
                    </a-tag>
                  </a-tooltip>
                  <a-tag 
                    v-else
                    :color="'default'"
                    @click="prepareBind(record.code)"
                    style="cursor: pointer;"
                  >
                    选择绑定
                  </a-tag>
                </template>
              </template>
            </a-table>
            
            <div style="margin:12px 0;display:flex;justify-content:space-between;align-items:center">
              <a-pagination 
                v-model:current="bindPagination.current"
                v-model:page-size="bindPagination.pageSize"
                :total="bindPagination.total"
                :show-size-changer="bindPagination.showSizeChanger"
                :show-quick-jumper="bindPagination.showQuickJumper"
                :show-total="bindPagination.showTotal"
                :size="bindPagination.size"
                @change="handleBindPaginationChange"
              />
              <a-button type="primary" @click="batchBind">批量绑定选中项</a-button>
            </div>
            
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
            
            <div class="section-title" style="font-size:15px;margin-bottom:12px">2. 绑定实体对象</div>
            <a-form :model="bindForm" layout="vertical">
              <a-form-item label="待绑定编码" required>
                <a-input v-model:value="bindForm.code" placeholder="请选择或输入要绑定的编码" readonly />
              </a-form-item>
              <a-form-item label="绑定对象类型" required>
                <a-select v-model:value="bindForm.objectType" placeholder="请选择绑定对象类型">
                  <a-select-option value="设备">设备</a-select-option>
                  <a-select-option value="生产工单">生产工单</a-select-option>
                  <a-select-option value="成品物料">成品物料</a-select-option>
                  <a-select-option value="库位">库位</a-select-option>
                  <a-select-option value="工装夹具">工装夹具</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="实体对象编号" required>
                <a-input v-model:value="bindForm.objectCode" placeholder="输入实体对象唯一编号（如设备SN、工单ID）" />
              </a-form-item>
              <a-form-item label="实体对象名称" required>
                <a-input v-model:value="bindForm.objectName" placeholder="输入实体对象名称" />
              </a-form-item>
              <a-form-item label="绑定说明（可选）">
                <a-textarea
                  v-model:value="bindForm.description"
                  :rows="3"
                  placeholder="请描述绑定场景（如：绑定车间1号线数控车床）"
                ></a-textarea>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="submitBind" :loading="loading">
                  提交
                </a-button>
                <a-button @click="resetBindForm" style="margin-left: 8px">
                  重置
                </a-button>
              </a-form-item>
            </a-form>
          </div>
          
          <!-- 编码解绑面板 -->
          <div v-if="activeTab === 'unbind'">
            <div class="section-title" style="font-size:15px;margin-bottom:12px">1. 选择已绑定编码</div>
            <div class="search-bar" style="overflow-x: auto;">
              <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
                <div style="flex: 1; min-width: 120px;">
                  <a-input v-model:value="unbindSearchForm.keyword" placeholder="输入编码或实体对象编号" @keyup.enter="handleUnbindSearch" allow-clear style="width: 100%;" />
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-select v-model:value="unbindSearchForm.ruleId" placeholder="请选择编码规则" allow-clear style="width: 100%;">
                    <a-select-option value="">全部规则</a-select-option>
                    <a-select-option value="1">设备编码规则-生产车间</a-select-option>
                    <a-select-option value="2">工单编码规则-装配线</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-select v-model:value="unbindSearchForm.objectType" placeholder="请选择绑定对象类型" allow-clear style="width: 100%;">
                    <a-select-option value="all">全部类型</a-select-option>
                    <a-select-option value="设备">设备</a-select-option>
                    <a-select-option value="生产工单">生产工单</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button type="primary" @click="handleUnbindSearch" style="width: 100%;">搜索</a-button>
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button @click="handleUnbindReset" style="width: 100%;">重置</a-button>
                </div>
              </div>
            </div>
            
            <a-table
              :columns="unbindColumns"
              :data-source="unbindCodes"
              :pagination="false"
              @change="handleUnbindPaginationChange"
              row-key="code"
            >
              <template #headerCell="{ column }">
                <template v-if="column.key === 'check'">
                  <a-checkbox v-model:checked="unbindCheckAll" @change="handleUnbindCheckAll"></a-checkbox>
                </template>
              </template>
              <template #bodyCell="{ record, column }">
                <template v-if="column.key === 'check'">
                  <a-checkbox v-model:checked="record.checked" @change="handleUnbindCheckChange()"></a-checkbox>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-tag :color="'default'" @click="prepareUnbind(record)" style="cursor: pointer;">
                    选择解绑
                  </a-tag>
                </template>
              </template>
            </a-table>
            
            <div style="margin:12px 0;display:flex;justify-content:space-between;align-items:center">
              <a-pagination 
                v-model:current="unbindPagination.current"
                v-model:page-size="unbindPagination.pageSize"
                :total="unbindPagination.total"
                :show-size-changer="unbindPagination.showSizeChanger"
                :show-quick-jumper="unbindPagination.showQuickJumper"
                :show-total="unbindPagination.showTotal"
                :size="unbindPagination.size"
                @change="handleUnbindPaginationChange"
              />
              <a-button type="primary" @click="batchUnbind">批量解绑选中项</a-button>
            </div>
            
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
            
            <div class="section-title" style="font-size:15px;margin-bottom:12px">2. 解绑原因填写</div>
            <a-form :model="unbindForm" layout="vertical">
              <a-form-item label="待解绑编码" required>
                <a-input v-model:value="unbindForm.code" placeholder="请选择要解绑的编码" readonly />
              </a-form-item>
              
              <!-- 绑定信息预览 -->
              <div class="bind-card" v-if="selectedBindInfo">
                <div class="bind-item">
                  <span class="label">绑定对象类型</span>
                  <span class="value">{{ selectedBindInfo.objectType }}</span>
                </div>
                <div class="bind-item">
                  <span class="label">实体编号</span>
                  <span class="value">{{ selectedBindInfo.objectCode }}</span>
                </div>
                <div class="bind-item">
                  <span class="label">实体名称</span>
                  <span class="value">{{ selectedBindInfo.objectName }}</span>
                </div>
                <div class="bind-item">
                  <span class="label">绑定时间</span>
                  <span class="value">{{ selectedBindInfo.bindTime }}</span>
                </div>
              </div>
              
              <a-form-item label="解绑原因" required>
                <a-select v-model:value="unbindForm.reason" placeholder="请选择解绑原因">
                  <a-select-option value="绑定错误（编码与实体不匹配）">绑定错误（编码与实体不匹配）</a-select-option>
                  <a-select-option value="实体报废/停用">实体报废/停用</a-select-option>
                  <a-select-option value="编码作废，需解绑">编码作废，需解绑</a-select-option>
                  <a-select-option value="其他原因">其他原因</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="解绑说明" required>
                <a-textarea
                  v-model:value="unbindForm.description"
                  :rows="3"
                  placeholder="请详细描述解绑原因，便于后续追溯..."
                ></a-textarea>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="submitUnbind" :loading="loading">
                  提交
                </a-button>
                <a-button @click="resetUnbindForm" style="margin-left: 8px">
                  重置
                </a-button>
              </a-form-item>
            </a-form>
          </div>
          
          <!-- 记录查询面板 -->
          <div v-if="activeTab === 'bindRecord'">
            <div class="search-bar" style="overflow-x: auto;">
              <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
                <div style="flex: 1; min-width: 120px;">
                  <a-input v-model:value="recordSearchForm.keyword" placeholder="输入编码或实体对象编号" @keyup.enter="handleRecordSearch" allow-clear style="width: 100%;" />
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-select v-model:value="recordSearchForm.operationType" placeholder="请选择操作类型" allow-clear style="width: 100%;">
                    <a-select-option value="all">全部类型</a-select-option>
                    <a-select-option value="bind">绑定</a-select-option>
                    <a-select-option value="unbind">解绑</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-date-picker v-model:value="recordSearchForm.startDate" format="YYYY-MM-DD" style="width: 100%;" />
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-date-picker v-model:value="recordSearchForm.endDate" format="YYYY-MM-DD" style="width: 100%;" />
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button type="primary" @click="handleRecordSearch" style="width: 100%;">搜索</a-button>
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button @click="handleRecordReset" style="width: 100%;">重置</a-button>
                </div>
              </div>
            </div>
            
            <a-table
              :columns="recordColumns"
              :data-source="bindRecords"
              :pagination="false"
              @change="handleRecordPaginationChange"
              row-key="id"
            >
              <template #bodyCell="{ record, column }">
                <template v-if="column.key === 'operationType'">
                  <a-tag :color="record.operationType === 'bind' ? 'success' : 'default'">
                    {{ record.operationType === 'bind' ? '绑定' : '解绑' }}
                  </a-tag>
                </template>
              </template>
            </a-table>
            
            <div style="margin:12px 0;display:flex;justify-content:flex-end;align-items:center">
              <a-pagination 
                v-model:current="recordPagination.current"
                v-model:page-size="recordPagination.pageSize"
                :total="recordPagination.total"
                :show-size-changer="recordPagination.showSizeChanger"
                :show-quick-jumper="recordPagination.showQuickJumper"
                :show-total="recordPagination.showTotal"
                :size="recordPagination.size"
                @change="handleRecordPaginationChange"
              />
            </div>
          </div>
        </div>
      </div>
    </a-config-provider>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 注册中文语言包
dayjs.locale('zh-cn');

// 状态管理
const loading = ref(false);
const activeTab = ref('bind');

// 分页相关
const bindPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
  size: 'small'
});

const unbindPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
  size: 'small'
});

const recordPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
  size: 'small'
});

// 绑定相关
const bindCheckAll = ref(false);
const bindSearchForm = ref({
  ruleId: '',
  keyword: '',
  status: 'all'
});
const bindForm = ref({
  code: '',
  objectType: '设备',
  objectCode: '',
  objectName: '',
  description: ''
});

// 解绑相关
const unbindCheckAll = ref(false);
const unbindSearchForm = ref({
  ruleId: '',
  keyword: '',
  objectType: 'all'
});
const unbindForm = ref({
  code: '',
  reason: '',
  description: ''
});
const selectedBindInfo = ref<any>(null);

// 记录查询相关
const recordSearchForm = ref({
  keyword: '',
  operationType: 'all',
  startDate: null,
  endDate: null
});

// 表格数据类型定义
interface BindCode {
  code: string;
  ruleName: string;
  generatedTime: string;
  status: string;
  checked: boolean;
  ruleId?: string;
}

interface UnbindCode {
  code: string;
  objectType: string;
  objectCode: string;
  objectName: string;
  bindTime: string;
  checked: boolean;
}

interface BindRecord {
  id: number;
  operationTime: string;
  operator: string;
  operationType: string;
  code: string;
  objectType: string;
  objectCode: string;
  remark: string;
}

// 表格数据
const bindCodes = ref<BindCode[]>([]);
const unbindCodes = ref<UnbindCode[]>([]);
const bindRecords = ref<BindRecord[]>([]);

// 表格列定义
const bindColumns = [
  { key: 'check', width: 60 },
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
  { title: '生成时间', dataIndex: 'generatedTime', key: 'generatedTime' },
  { title: '绑定状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 120 }
];

const unbindColumns = [
  { key: 'check', width: 60 },
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '绑定对象类型', dataIndex: 'objectType', key: 'objectType' },
  { title: '实体编号', dataIndex: 'objectCode', key: 'objectCode' },
  { title: '实体名称', dataIndex: 'objectName', key: 'objectName' },
  { title: '绑定时间', dataIndex: 'bindTime', key: 'bindTime' },
  { title: '操作', key: 'action', width: 120 }
];

const recordColumns = [
  { title: '操作时间', dataIndex: 'operationTime', key: 'operationTime' },
  { title: '操作人', dataIndex: 'operator', key: 'operator' },
  { title: '操作类型', dataIndex: 'operationType', key: 'operationType' },
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '绑定对象', dataIndex: 'objectType', key: 'objectType' },
  { title: '实体编号', dataIndex: 'objectCode', key: 'objectCode' },
  { title: '备注', dataIndex: 'remark', key: 'remark' }
];

// 分页相关方法
const handleBindPaginationChange = (pagination: any) => {
  bindPagination.value = pagination;
  handleBindSearch();
};

const handleUnbindPaginationChange = (pagination: any) => {
  unbindPagination.value = pagination;
  handleUnbindSearch();
};

const handleRecordPaginationChange = (pagination: any) => {
  recordPagination.value = pagination;
  handleRecordSearch();
};

// 绑定相关方法
const handleBindSearch = () => {
  // 生成模拟数据
  const generateMockData = () => {
    const mockData: BindCode[] = [];
    const status = bindSearchForm.value.status || 'all';
    
    // 生成10条模拟数据
    for (let i = 1; i <= 10; i++) {
      const mockItem: BindCode = {
        code: `EQ-CN01-2602-${String(i).padStart(4, '0')}`,
        ruleName: '设备编码规则-生产车间',
        generatedTime: `2026-02-23 09:${String(i * 5).padStart(2, '0')}:00`,
        status: status === 'all' ? (i % 3 === 0 ? 'bound' : 'unbound') : status,
        checked: false
      };
      mockData.push(mockItem);
    }
    
    // 根据关键字过滤
    if (bindSearchForm.value.keyword) {
      const keyword = bindSearchForm.value.keyword.toLowerCase();
      return mockData.filter(item => 
        item.code.toLowerCase().includes(keyword) || 
        item.ruleName.toLowerCase().includes(keyword)
      );
    }
    
    return mockData;
  };
  
  // 生成并设置数据
  const mockData = generateMockData();
  bindCodes.value = mockData;
  
  const total = mockData.length;
  bindPagination.value.total = total;
};

const handleBindReset = () => {
  bindSearchForm.value = {
    ruleId: '',
    keyword: '',
    status: 'unbound'
  };
  message.success('表单已重置');
};

const handleBindCheckAll = (e: any) => {
  bindCodes.value.forEach(item => {
    if (item.status === 'unbound') {
      item.checked = e.target.checked;
    } else {
      item.checked = false;
    }
  });
};

const handleBindCheckChange = () => {
  const unboundItems = bindCodes.value.filter(item => item.status === 'unbound');
  const allChecked = unboundItems.length > 0 && unboundItems.every(item => item.checked);
  bindCheckAll.value = allChecked;
};

const prepareBind = (code: string) => {
  bindForm.value.code = code;
  message.info(`已绑定编码：${code}`);
};

const batchBind = () => {
  const checkedItems = bindCodes.value.filter(item => item.checked);
  if (checkedItems.length === 0) {
    message.warning('请至少选择一条编码');
    return;
  }
  
  // 过滤出未绑定的编码
  const unboundItems = checkedItems.filter(item => item.status === 'unbound');
  if (unboundItems.length === 0) {
    message.warning('所选编码均已绑定，无需重复操作');
    return;
  }
  
  const codes = unboundItems.map(item => item.code).join(', ');
  bindForm.value.code = codes;
  message.success(`已选择批量绑定：${codes}`);
};

const submitBind = async () => {
  if (!bindForm.value.code) {
    message.warning('请选择绑定编码');
    return;
  }
  if (!bindForm.value.objectCode) {
    message.warning('请输入实体对象编号');
    return;
  }
  if (!bindForm.value.objectName) {
    message.warning('请输入实体对象名称');
    return;
  }
  
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 处理批量绑定的情况
    const codes = bindForm.value.code.split(', ');
    const boundCount = codes.length;
    
    message.success(`绑定成功！\n共绑定 ${boundCount} 条编码\n绑定对象：${bindForm.value.objectType}（${bindForm.value.objectName}）`);
    
    // 更新表格状态
    bindCodes.value.forEach(item => {
      if (codes.includes(item.code)) {
        item.status = 'bound';
        item.checked = false;
      }
    });
    bindCheckAll.value = false;
    resetBindForm();
  } catch (error) {
    message.error('绑定失败');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

const resetBindForm = () => {
  bindForm.value = {
    code: '',
    objectType: '设备',
    objectCode: '',
    objectName: '',
    description: ''
  };
};

// 解绑相关方法
const handleUnbindSearch = () => {
  // 生成模拟数据
  const generateMockData = () => {
    const mockData: UnbindCode[] = [];
    
    // 生成10条模拟数据
    for (let i = 1; i <= 10; i++) {
      const mockItem: UnbindCode = {
        code: `EQ-CN01-2602-${String(i).padStart(4, '0')}`,
        objectType: '设备',
        objectCode: `DEV-SN-20260223${String(i).padStart(3, '0')}`,
        objectName: `数控车床（CNC-${String(i - 1).padStart(2, '0')}`,
        bindTime: `2026-02-23 10:${String(i * 10).padStart(2, '0')}:00`,
        checked: false
      };
      mockData.push(mockItem);
    }
    
    // 根据关键字过滤
    if (unbindSearchForm.value.keyword) {
      const keyword = unbindSearchForm.value.keyword.toLowerCase();
      return mockData.filter(item => 
        item.code.toLowerCase().includes(keyword) || 
        item.objectCode.toLowerCase().includes(keyword) ||
        item.objectName.toLowerCase().includes(keyword)
      );
    }
    
    return mockData;
  };
  
  // 生成并设置数据
  const mockData = generateMockData();
  unbindCodes.value = mockData;
  
  const total = mockData.length;
  unbindPagination.value.total = total;
};

const handleUnbindReset = () => {
  unbindSearchForm.value = {
    ruleId: '',
    keyword: '',
    objectType: '设备'
  };
  unbindPagination.value.current = 1;
  message.success('表单已重置');
};

const handleUnbindCheckAll = (e: any) => {
  unbindCodes.value.forEach(item => {
    item.checked = e.target.checked;
  });
};

const handleUnbindCheckChange = () => {
  const allChecked = unbindCodes.value.every(item => item.checked);
  unbindCheckAll.value = allChecked;
};

const prepareUnbind = (record: any) => {
  unbindForm.value.code = record.code;
  selectedBindInfo.value = {
    objectType: record.objectType,
    objectCode: record.objectCode,
    objectName: record.objectName,
    bindTime: record.bindTime
  };
  message.info(`已解绑编码：${record.code}`);
};

const batchUnbind = () => {
  const checkedItems = unbindCodes.value.filter(item => item.checked);
  if (checkedItems.length === 0) {
    message.warning('请至少选择一条编码');
    return;
  }
  
  const codes = checkedItems.map(item => item.code).join(', ');
  unbindForm.value.code = codes;
  message.success(`已批量解绑编码：${codes}`);
  // 清除选中状态
  unbindCodes.value.forEach(item => {
    item.checked = false;
  });
  unbindCheckAll.value = false;
};

const submitUnbind = async () => {
  if (!unbindForm.value.code) {
    message.warning('请选择解绑编码');
    return;
  }
  if (!unbindForm.value.description) {
    message.warning('请填写解绑说明');
    return;
  }
  
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    message.success(`解绑成功！\n编码：${unbindForm.value.code}\n状态：已解除绑定，可重新绑定其他实体`);
    
    // 更新表格状态
    unbindCodes.value = unbindCodes.value.filter(item => !unbindForm.value.code.includes(item.code));
    unbindCheckAll.value = false;
    resetUnbindForm();
  } catch (error) {
    message.error('解绑失败');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

const resetUnbindForm = () => {
  unbindForm.value = {
    code: '',
    reason: '',
    description: ''
  };
  selectedBindInfo.value = null;
};

// 生成记录查询模拟数据
const generateRecordMockData = () => {
  const mockData: BindRecord[] = [];
  const operationTypes = ['bind', 'unbind'];
  
  // 生成10条模拟数据
  for (let i = 1; i <= 10; i++) {
    const operationType = operationTypes[i % 2];
    const mockItem: BindRecord = {
      id: i,
      operationTime: `2026-02-23 ${String(9 + i).padStart(2, '0')}:${String(i * 5).padStart(2, '0')}:00`,
      operator: i % 2 === 0 ? 'admin' : 'operator',
      operationType: operationType,
      code: `EQ-CN01-2602-${String(i).padStart(4, '0')}`,
      objectType: '设备',
      objectCode: `DEV-SN-20260223${String(i).padStart(3, '0')}`,
      remark: operationType === 'bind' ? `绑定车间${i}号线数控车床` : '实体报废，解绑编码'
    };
    mockData.push(mockItem);
  }
  
  // 根据关键字过滤
  if (recordSearchForm.value.keyword) {
    const keyword = recordSearchForm.value.keyword.toLowerCase();
    return mockData.filter(item => 
      item.code.toLowerCase().includes(keyword) || 
      item.objectCode.toLowerCase().includes(keyword) ||
      item.remark.toLowerCase().includes(keyword)
    );
  }
  
  // 根据操作类型过滤
  if (recordSearchForm.value.operationType && recordSearchForm.value.operationType !== 'all') {
    return mockData.filter(item => item.operationType === recordSearchForm.value.operationType);
  }
  
  return mockData;
};

// 记录查询相关方法
const handleRecordSearch = () => {
  // 生成并设置数据
  const mockData = generateRecordMockData();
  bindRecords.value = mockData;
  
  const total = mockData.length;
  recordPagination.value.total = total;
};

// 初始化记录查询数据
handleRecordSearch();

const handleRecordReset = () => {
  recordSearchForm.value = {
    keyword: '',
    operationType: 'all',
    startDate: null,
    endDate: null
  };
  recordPagination.value.current = 1;
  message.success('表单已重置');
};
</script>

<style scoped>
.code-bind-container {
  width: 100%;
  padding: 1.5%;
}

.rule-page {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #111;
}

.search-bar {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.bind-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.bind-item {
  flex: 1;
  min-width: 200px;
}

.bind-item .label {
  color: #666;
  font-size: 13px;
  margin-bottom: 4px;
  display: block;
}

.bind-item .value {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .rule-page {
    padding: 20px;
  }
}

@media (max-width: 992px) {
  .rule-page {
    padding: 16px;
  }
  

}

@media (max-width: 768px) {
  .rule-page {
    padding: 12px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .bind-card {
    flex-direction: column;
    gap: 12px;
  }
  
  .bind-item {
    min-width: 100%;
  }
}

@media (max-width: 576px) {
  .rule-page {
    padding: 12px;
  }
}
</style>