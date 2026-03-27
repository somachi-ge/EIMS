<template>
  <AppLayout>
    <a-config-provider :locale="zhCN">
      <div class="code-recovery-container">
        <div class="rule-page">
          <!-- 页面标题 -->
          <div class="page-header">
            <h2 class="page-title">编码作废与恢复</h2>
          </div>
          
          <!-- 核心标签页：作废申请 vs 恢复管理 -->
          <a-tabs v-model:activeKey="activeTab" style="margin-bottom: 20px;">
            <a-tab-pane key="invalid" tab="作废申请"></a-tab-pane>
            <a-tab-pane key="restore" tab="恢复管理"></a-tab-pane>
          </a-tabs>
          
          <!-- 面板1：作废申请 -->
          <div v-if="activeTab === 'invalid'">
            <div class="section-title" style="font-size:15px;margin-bottom:12px">1. 选择编码</div>
            <div class="search-bar" style="overflow-x: auto;">
              <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
                <div style="flex: 1; min-width: 120px;">
                  <a-input v-model:value="invalidForm.keyword" placeholder="输入编码或流水号" style="width: 100%;" />
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-select v-model:value="invalidForm.ruleId" placeholder="请选择编码规则" allow-clear style="width: 100%;">
                    <a-select-option value="">全部规则</a-select-option>
                    <a-select-option value="1">设备编码规则-生产车间</a-select-option>
                    <a-select-option value="2">工单编码规则-装配线</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-select v-model:value="invalidForm.status" placeholder="请选择状态" allow-clear style="width: 100%;">
                    <a-select-option value="all">全部状态</a-select-option>
                    <a-select-option value="valid">有效</a-select-option>
                    <a-select-option value="pending">审批中</a-select-option>
                    <a-select-option value="void">无效</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button type="primary" @click="handleSearchValid" style="width: 100%;">搜索</a-button>
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button @click="handleInvalidReset" style="width: 100%;">重置</a-button>
                </div>
              </div>
            </div>
            
            <a-table
              :columns="validColumns"
              :data-source="validCodes"
              :pagination="false"
              @change="handleValidPaginationChange"
              row-key="code"
            >
              <template #headerCell="{ column }">
                <template v-if="column.key === 'check'">
                  <a-checkbox v-model:checked="checkAllValid" @change="handleCheckAllValid"></a-checkbox>
                </template>
              </template>
              <template #bodyCell="{ record, column }">
                <template v-if="column.key === 'check'">
                  <a-checkbox v-model:checked="record.checked" @change="handleCheckChangeValid()" :disabled="record.status !== 'valid'"></a-checkbox>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag v-if="record.status === 'valid'" color="success">有效</a-tag>
                  <a-tag v-else-if="record.status === 'pending'" color="warning">审批中</a-tag>
                  <a-tag v-else color="error">无效</a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-tag v-if="record.status === 'valid'" :color="'default'" @click="prepareInvalid(record)" style="cursor: pointer;">
                    作废
                  </a-tag>
                  <a-tag v-else disabled style="opacity: 0.6; cursor: not-allowed;">
                    {{ record.status === 'pending' ? '审批中' : '已作废' }}
                  </a-tag>
                </template>
              </template>
            </a-table>
            
            <div style="margin:12px 0;display:flex;justify-content:space-between;align-items:center">
              <a-pagination 
                v-model:current="validPagination.current"
                v-model:page-size="validPagination.pageSize"
                :total="validPagination.total"
                :show-size-changer="validPagination.showSizeChanger"
                :show-quick-jumper="validPagination.showQuickJumper"
                :show-total="validPagination.showTotal"
                :size="validPagination.size"
                @change="handleValidPaginationChange"
              />
              <a-button type="primary" @click="handleBatchInvalid" :disabled="selectedValidCodes.length === 0">
                批量作废选中项
              </a-button>
            </div>
            
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
            
            <div class="section-title" style="font-size: 15px; margin-bottom: 12px;">2. 作废原因填写</div>
            <div class="form-container">
              <a-form-item label="作废编码" required>
                <a-input v-model:value="invalidForm.code" placeholder="请选择或输入要作废的编码" readonly />
              </a-form-item>
              <a-form-item label="作废原因" required>
                <a-select v-model:value="invalidForm.reason" placeholder="请选择作废原因">
                  <a-select-option value="1">编码错误（格式/逻辑错误）</a-select-option>
                  <a-select-option value="2">业务取消（订单取消/物料取消）</a-select-option>
                  <a-select-option value="3">重复生成</a-select-option>
                  <a-select-option value="4">其他原因</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="作废说明" required>
                <a-textarea v-model:value="invalidForm.description" rows="3" placeholder="请详细描述作废原因，便于后续追溯与恢复审批..." />
              </a-form-item>
              <a-form-item label="是否需要审批">
                <a-radio-group v-model:value="invalidForm.needApproval">
                  <a-radio value="1">是</a-radio>
                  <a-radio value="0">否（管理员权限）</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="submitInvalid" :loading="loading">
                  提交
                </a-button>
                <a-button @click="handleInvalidReset" style="margin-left: 8px">
                  重置
                </a-button>
              </a-form-item>
            </div>
          </div>
          
          <!-- 面板2：恢复管理 -->
          <div v-else-if="activeTab === 'restore'">
            <!-- 搜索栏 -->
            <div class="search-bar" style="overflow-x: auto;">
              <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
                <div style="flex: 1; min-width: 120px;">
                  <a-input v-model:value="searchForm.keyword" placeholder="输入编码或流水号" style="width: 100%;" />
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-select v-model:value="searchForm.ruleId" placeholder="请选择编码规则" allow-clear style="width: 100%;">
                    <a-select-option value="">全部规则</a-select-option>
                    <a-select-option value="1">设备编码规则-生产车间</a-select-option>
                    <a-select-option value="2">工单编码规则-装配线</a-select-option>
                    <a-select-option value="3">物料编码规则-成品</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-date-picker v-model:value="searchForm.startDate" format="YYYY-MM-DD" style="width: 100%;" />
                </div>
                <div style="flex: 1; min-width: 120px;">
                  <a-date-picker v-model:value="searchForm.endDate" format="YYYY-MM-DD" style="width: 100%;" />
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button type="primary" @click="handleSearch" style="width: 100%;">搜索</a-button>
                </div>
                <div style="flex: 0.4; min-width: 70px;">
                  <a-button @click="handleSearchReset" style="width: 100%;">重置</a-button>
                </div>
              </div>
            </div>
            
            <!-- 作废编码列表 -->
            <a-table
              :columns="columns"
              :data-source="voidCodes"
              :pagination="false"
              @change="handleVoidPaginationChange"
              row-key="code"
            >
              <template #headerCell="{ column }">
                <template v-if="column.key === 'check'">
                  <a-checkbox v-model:checked="checkAll" @change="handleCheckAll"></a-checkbox>
                </template>
              </template>
              <template #bodyCell="{ record, column }">
                <template v-if="column.key === 'check'">
                  <a-checkbox v-model:checked="record.checked" @change="handleCheckChange()" :disabled="record.status !== 'void'"></a-checkbox>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag v-if="record.status === 'pending'" color="warning">待审批</a-tag>
                  <a-tag v-else-if="record.status === 'approved'" color="success">已通过</a-tag>
                  <a-tag v-else-if="record.status === 'rejected'" color="error">已驳回</a-tag>
                  <a-tag v-else color="error">已作废</a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-tag v-if="record.status === 'pending'" color="success" @click="approveRestore(record)" style="cursor: pointer; margin-right: 8px">
                    通过恢复
                  </a-tag>
                  <a-tag v-if="record.status === 'pending'" :color="'default'" @click="rejectRestore(record)" style="cursor: pointer">
                    驳回
                  </a-tag>
                  <a-tag v-else-if="record.status === 'rejected'" :color="'default'" @click="viewDetail(record)" style="cursor: pointer">
                    查看详情
                  </a-tag>
                  <a-tag v-else-if="record.status === 'approved'" :color="'default'" disabled style="opacity: 0.6; cursor: not-allowed">
                    已生效
                  </a-tag>
                  <a-tag v-else :color="'default'" @click="handleRecovery(record)" style="cursor: pointer">
                    恢复
                  </a-tag>
                </template>
              </template>
            </a-table>
            
            <!-- 批量操作 -->
            <div style="margin:12px 0;display:flex;justify-content:space-between;align-items:center">
              <a-pagination 
                v-model:current="voidPagination.current"
                v-model:page-size="voidPagination.pageSize"
                :total="voidPagination.total"
                :show-size-changer="voidPagination.showSizeChanger"
                :show-quick-jumper="voidPagination.showQuickJumper"
                :show-total="voidPagination.showTotal"
                :size="voidPagination.size"
                @change="handleVoidPaginationChange"
              />
              <a-button type="primary" @click="handleBatchRecovery" :disabled="selectedCodes.length === 0">
                批量恢复选中项
              </a-button>
            </div>
            
            <!-- 操作结果 -->
            <a-card v-if="operationResult" class="result-card" style="margin-top: 16px;">
              <template #title>
                <div class="result-title">
                  <span>操作结果</span>
                </div>
              </template>
              <a-descriptions :column="1" bordered>
                <a-descriptions-item label="总数量">{{ operationResult.total }}</a-descriptions-item>
                <a-descriptions-item label="成功数量">{{ operationResult.success }}</a-descriptions-item>
                <a-descriptions-item label="失败数量">{{ operationResult.failed }}</a-descriptions-item>
                <a-descriptions-item label="操作时间">{{ operationResult.time }}</a-descriptions-item>
              </a-descriptions>
              
              <!-- 失败详情 -->
              <div v-if="operationResult.failed > 0" class="failed-details" style="margin-top: 16px;">
                <h4>失败详情</h4>
                <a-table
                  :columns="failedColumns"
                  :data-source="operationResult.failedItems"
                  :pagination="false"
                  row-key="code"
                />
              </div>
            </a-card>
          </div>
        </div>
      </div>
    </a-config-provider>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { message, Modal } from 'ant-design-vue';
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 注册中文语言包
dayjs.locale('zh-cn');

// 状态管理
const loading = ref(false);
const checkAll = ref(false);
const checkAllValid = ref(false);
const activeTab = ref('invalid');

// 分页相关
const validPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
  size: 'small'
});

const voidPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
  size: 'small'
});

// 搜索表单
const searchForm = ref({
  ruleId: '',
  keyword: '',
  startDate: null,
  endDate: null
});

// 作废申请表单
const invalidForm = ref({
  ruleId: '',
  keyword: '',
  status: 'all',
  code: '',
  reason: '',
  description: '',
  needApproval: '1'
});

// 操作结果类型定义
interface OperationResult {
  total: number;
  success: number;
  failed: number;
  time: string;
  failedItems: Array<{ code: string; reason: string }>;
}

// 操作结果
const operationResult = ref<OperationResult | null>(null);

// 表格数据类型定义
interface ValidCode {
  code: string;
  ruleName: string;
  generateTime: string;
  status: string;
  checked: boolean;
}

interface VoidCode {
  code: string;
  ruleName: string;
  voidTime: string;
  voidReason: string;
  operator: string;
  status: string;
  checked: boolean;
}

// 有效编码数据
const validCodes = ref<ValidCode[]>([]);

// 作废编码数据
const voidCodes = ref<VoidCode[]>([]);

// 选中的有效编码
const selectedValidCodes = computed(() => {
  return validCodes.value.filter(item => item.checked && item.status === 'valid');
});

// 选中的作废编码
const selectedCodes = computed(() => {
  return voidCodes.value.filter(item => item.checked && item.status === 'void');
});

// 有效编码表格列定义
const validColumns = [
  { key: 'check', width: 60 },
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
  { title: '生成时间', dataIndex: 'generateTime', key: 'generateTime' },
  { title: '当前状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 100 }
];

// 作废编码表格列定义
const columns = [
  { key: 'check', width: 60 },
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
  { title: '作废时间', dataIndex: 'voidTime', key: 'voidTime' },
  { title: '作废原因', dataIndex: 'voidReason', key: 'voidReason' },
  { title: '操作人', dataIndex: 'operator', key: 'operator' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 150 }
];

// 失败详情列定义
const failedColumns = [
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '原因', dataIndex: 'reason', key: 'reason' }
];

// 分页相关方法
const handleValidPaginationChange = (pagination: any) => {
  validPagination.value = pagination;
  handleSearchValid();
};

const handleVoidPaginationChange = (pagination: any) => {
  voidPagination.value = pagination;
  handleSearch();
};

// 生成有效编码模拟数据
const generateValidMockData = () => {
  const mockData: ValidCode[] = [];
  const statuses = ['valid', 'pending', 'void'];
  
  // 生成10条模拟数据
  for (let i = 1; i <= 10; i++) {
    const mockItem: ValidCode = {
      code: `EQ-CN01-2602-${String(i).padStart(4, '0')}`,
      ruleName: '设备编码规则-生产车间',
      generateTime: `2026-02-23 09:${String(i * 5).padStart(2, '0')}:00`,
      status: statuses[i % 3],
      checked: false
    };
    mockData.push(mockItem);
  }
  
  // 根据关键字过滤
  if (invalidForm.value.keyword) {
    const keyword = invalidForm.value.keyword.toLowerCase();
    return mockData.filter(item => 
      item.code.toLowerCase().includes(keyword) || 
      item.ruleName.toLowerCase().includes(keyword)
    );
  }
  
  // 根据状态过滤
  if (invalidForm.value.status && invalidForm.value.status !== 'all') {
    return mockData.filter(item => item.status === invalidForm.value.status);
  }
  
  return mockData;
};

// 生成作废编码模拟数据
const generateVoidMockData = () => {
  const mockData: VoidCode[] = [];
  const statuses = ['pending', 'rejected', 'approved', 'void'];
  
  // 生成10条模拟数据
  for (let i = 1; i <= 10; i++) {
    const mockItem: VoidCode = {
      code: `EQ-CN01-2602-${String(i).padStart(4, '0')}`,
      ruleName: '设备编码规则-生产车间',
      voidTime: `2026-02-23 ${String(9 + i).padStart(2, '0')}:${String(i * 5).padStart(2, '0')}:00`,
      voidReason: i % 2 === 0 ? '编码错误' : '重复生成',
      operator: i % 2 === 0 ? 'admin' : 'operator',
      status: statuses[i % 4],
      checked: false
    };
    mockData.push(mockItem);
  }
  
  // 根据关键字过滤
  if (searchForm.value.keyword) {
    const keyword = searchForm.value.keyword.toLowerCase();
    return mockData.filter(item => 
      item.code.toLowerCase().includes(keyword) || 
      item.ruleName.toLowerCase().includes(keyword) ||
      item.voidReason.toLowerCase().includes(keyword)
    );
  }
  
  return mockData;
};

// 查询有效编码
const handleSearchValid = () => {
  // 生成并设置数据
  const mockData = generateValidMockData();
  validCodes.value = mockData;
  
  const total = mockData.length;
  message.success(`查询成功，共找到 ${total} 条有效编码`);
  validPagination.value.total = total;
};

// 重置作废申请搜索
const handleInvalidReset = () => {
  invalidForm.value = {
    ruleId: '',
    keyword: '',
    status: 'all',
    code: '',
    reason: '',
    description: '',
    needApproval: '1'
  };
  validPagination.value.current = 1;
  message.success('表单已重置');
};

// 查询作废编码
const handleSearch = () => {
  // 生成并设置数据
  const mockData = generateVoidMockData();
  voidCodes.value = mockData;
  
  const total = mockData.length;
  message.success(`查询成功，共找到 ${total} 条作废编码`);
  voidPagination.value.total = total;
};

// 重置恢复管理搜索
const handleSearchReset = () => {
  searchForm.value = {
    ruleId: '',
    keyword: '',
    startDate: null,
    endDate: null
  };
  voidPagination.value.current = 1;
  message.success('表单已重置');
};

// 有效编码全选/取消全选
const handleCheckAllValid = (e: any) => {
  validCodes.value.forEach(item => {
    if (item.status === 'valid') {
      item.checked = e.target.checked;
    } else {
      item.checked = false;
    }
  });
};

// 有效编码单个选择
const handleCheckChangeValid = () => {
  const validItems = validCodes.value.filter(item => item.status === 'valid');
  const allChecked = validItems.length > 0 && validItems.every(item => item.checked);
  checkAllValid.value = allChecked;
};

// 作废编码全选/取消全选
const handleCheckAll = (e: any) => {
  voidCodes.value.forEach(item => {
    if (item.status === 'void') {
      item.checked = e.target.checked;
    } else {
      item.checked = false;
    }
  });
};

// 作废编码单个选择
const handleCheckChange = () => {
  const voidItems = voidCodes.value.filter(item => item.status === 'void');
  const allChecked = voidItems.length > 0 && voidItems.every(item => item.checked);
  checkAll.value = allChecked;
};

// 准备作废
const prepareInvalid = (record: any) => {
  invalidForm.value.code = record.code;
  message.info(`已选择编码：${record.code}，请填写作废原因`);
};

// 批量作废
const handleBatchInvalid = () => {
  if (selectedValidCodes.value.length === 0) {
    message.warning('请至少选择一条编码');
    return;
  }
  
  const codes = selectedValidCodes.value.map(item => item.code).join(', ');
  invalidForm.value.code = codes;
  message.success(`已选择批量作废：${codes}`);
};

// 提交作废申请
const submitInvalid = async () => {
  if (!invalidForm.value.code) {
    message.warning('请选择作废编码');
    return;
  }
  
  if (!invalidForm.value.description) {
    message.warning('请填写作废说明');
    return;
  }
  
  if (!invalidForm.value.reason) {
    message.warning('请选择作废原因');
    return;
  }
  
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    
    message.success(`作废申请提交成功！\n编码：${invalidForm.value.code}\n状态：已进入审批流`);
    
    // 提交后更新表格
    validCodes.value.forEach(item => {
      if (invalidForm.value.code.includes(item.code)) {
        item.status = 'pending';
      }
    });
    
    // 重置表单
    invalidForm.value = {
      ruleId: '',
      keyword: '',
      status: 'all',
      code: '',
      reason: '',
      description: '',
      needApproval: '1'
    };
  } catch (error) {
    message.error('作废申请提交失败');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// 单个恢复
const handleRecovery = async (record: any) => {
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    
    message.success(`恢复成功！编码：${record.code}`);
    
    // 从列表中移除
    voidCodes.value = voidCodes.value.filter(item => item.code !== record.code);
  } catch (error) {
    message.error('恢复失败');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// 批量恢复
const handleBatchRecovery = async () => {
  if (selectedCodes.value.length === 0) {
    message.warning('请至少选择一条编码');
    return;
  }
  
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    message.success(`批量恢复成功！共恢复 ${selectedCodes.value.length} 条编码`);
    
    // 从列表中移除
    voidCodes.value = voidCodes.value.filter(item => !item.checked);
    checkAll.value = false;
    
    // 设置操作结果
    operationResult.value = {
      total: selectedCodes.value.length,
      success: selectedCodes.value.length,
      failed: 0,
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      failedItems: []
    };
  } catch (error) {
    message.error('批量恢复失败');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// 审批通过
const approveRestore = async (record: any) => {
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    
    message.success('审批通过！编码已恢复为有效状态。');
    record.status = 'approved';
  } catch (error) {
    message.error('审批失败');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// 驳回恢复
const rejectRestore = async (record: any) => {
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 使用Vue的h函数创建VNode
    const textareaRef = ref<HTMLTextAreaElement | null>(null);
    
    const modalContent = h('div', { style: { padding: '16px' } }, [
      h('div', { style: { marginBottom: '8px' } }, '请输入驳回原因:'),
      h('textarea', {
        ref: textareaRef,
        style: {
          width: '100%',
          minHeight: '100px',
          padding: '8px',
          border: '1px solid #e8e8e8',
          borderRadius: '4px',
          resize: 'vertical',
          fontSize: '14px',
          outline: 'none'
        },
        placeholder: '请详细描述驳回原因...'
      })
    ]);
    
    Modal.confirm({
      title: '驳回原因',
      content: modalContent,
      onOk: () => {
        const reason = textareaRef.value?.value || '';
        if (reason) {
          message.success('已驳回该恢复申请。');
          record.status = 'rejected';
        } else {
          message.warning('请输入驳回原因');
        }
      },
      okText: '确定',
      cancelText: '取消'
    });
  } catch (error) {
    message.error('操作失败');
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// 查看详情
const viewDetail = (record: any) => {
  Modal.info({
    title: '恢复申请详情',
    content: `编码：${record.code}\n作废原因：${record.voidReason}\n驳回原因：该编码已被新编码替代，无需恢复`,
    okText: '关闭'
  });
};

// 初始化数据
const initData = () => {
  // 页面载入后列表中没有数据
  validCodes.value = [];
  voidCodes.value = [];
  
  // 恢复管理面板默认显示数据，但不显示提示
  const mockData = generateVoidMockData();
  voidCodes.value = mockData;
  voidPagination.value.total = mockData.length;
};

// 初始化
initData();
</script>

<style scoped>
.code-recovery-container {
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

.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-card {
  border-radius: 8px;
  box-shadow: none;
  border: none;
}

.result-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.failed-details {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.failed-details h4 {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
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
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-bar a-form-item {
    width: 100%;
  }
  
  .form-container {
    width: 100%;
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
}

@media (max-width: 576px) {
  .rule-page {
    padding: 12px;
  }
}
</style>