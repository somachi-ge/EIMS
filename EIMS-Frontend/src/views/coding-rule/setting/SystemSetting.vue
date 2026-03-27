<template>
  <a-config-provider :locale="zhCN">
    <AppLayout>
      <div class="system-setting">
        <a-card>
          <a-tabs default-active-key="global" class="setting-tabs">
            <a-tab-pane key="global" tab="全局参数配置">
              <div class="section-content">
                <div class="config-grid">
                  <div class="config-item">
                    <div class="config-label">编码最大长度</div>
                    <a-input type="number" value="64" />
                  </div>
                  <div class="config-item">
                    <div class="config-label">批量生成上限</div>
                    <a-input type="number" value="1000" />
                  </div>
                  <div class="config-item">
                    <div class="config-label">日志保留天数</div>
                    <a-input type="number" value="365" />
                  </div>
                  <div class="config-item">
                    <div class="config-label">并发锁超时（秒）</div>
                    <a-input type="number" value="3" />
                  </div>
                </div>
                <div class="config-actions">
                  <a-button type="primary">保存配置</a-button>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="category" tab="规则分类管理">
              <div class="section-content">
                <div class="category-actions">
                  <a-button type="primary" @click="handleAddCategory">新增分类</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #52c41a;" @click="handleBatchEnableCategory">批量启用</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #fa8c16;" @click="handleBatchDisableCategory">批量停用</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f;" @click="handleBatchDeleteCategory">批量删除</a-button>
                </div>
                <div style="border-bottom: 1px solid #e8e8e8; margin-bottom: 16px;"></div>
                <a-table :columns="categoryColumns" :data-source="paginatedCategoryData" row-key="id" :pagination="false" :row-selection="{ selectedRowKeys: selectedCategoryKeys, onChange: handleCategorySelectChange }">
                  <template #status="{ record }">
                    <a-switch
                      :checked="record.status === 'enabled'"
                      :checked-children="'启用'"
                      :un-checked-children="'停用'"
                      @change="() => toggleCategoryStatus(record)"
                    />
                  </template>
                  <template #action="{ record }">
                    <a-button size="small" style="margin-right: 8px;" @click="handleEditCategory(record)">编辑</a-button>
                    <a-button size="small" danger @click="handleDeleteCategory(record)">删除</a-button>
                  </template>
                </a-table>
                <div class="pagination-container">
                  <a-pagination
                    v-model:current="categoryPagination.current"
                    v-model:pageSize="categoryPagination.pageSize"
                    :total="categoryData.length"
                    :showSizeChanger="true"
                    :pageSizeOptions="PAGE_SIZE_OPTIONS"
                    :showTotal="showTotal"
                    showQuickJumper
                    size="default"
                  />
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="business" tab="业务对象配置">
              <div class="section-content">
                <div class="business-actions">
                  <a-button type="primary" @click="handleAddBusinessObject">新增业务对象</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #52c41a;" @click="handleBatchEnableBusiness">批量启用</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #fa8c16;" @click="handleBatchDisableBusiness">批量停用</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f;" @click="handleBatchDeleteBusiness">批量删除</a-button>
                </div>
                <div style="border-bottom: 1px solid #e8e8e8; margin-bottom: 16px;"></div>
                <a-table :columns="businessColumns" :data-source="paginatedBusinessData" row-key="id" :pagination="false" :row-selection="{ selectedRowKeys: selectedBusinessKeys, onChange: handleBusinessSelectChange }">
                  <template #status="{ record }">
                    <a-switch
                      :checked="record.status === 'enabled'"
                      :checked-children="'启用'"
                      :un-checked-children="'停用'"
                      @change="() => toggleBusinessObjectStatus(record)"
                    />
                  </template>
                  <template #action="{ record }">
                    <a-button size="small" style="margin-right: 8px;" @click="handleEditBusinessObject(record)">编辑</a-button>
                    <a-button size="small" style="margin-right: 8px;" @click="handleConfigureBusinessObject(record)">配置属性</a-button>
                    <a-button size="small" danger @click="handleDeleteBusinessObject(record)">删除</a-button>
                  </template>
                </a-table>
                <div class="pagination-container">
                  <a-pagination
                    v-model:current="businessPagination.current"
                    v-model:pageSize="businessPagination.pageSize"
                    :total="businessData.length"
                    :showSizeChanger="true"
                    :pageSizeOptions="PAGE_SIZE_OPTIONS"
                    :showTotal="showTotal"
                    showQuickJumper
                    size="default"
                  />
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="template" tab="模板管理">
              <div class="section-content">
                <div class="template-actions">
                  <a-button type="primary" @click="handleCreateTemplateFromRule">从规则创建模板</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #52c41a;" @click="handleBatchEnableTemplate">批量启用</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #fa8c16;" @click="handleBatchDisableTemplate">批量停用</a-button>
                  <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f;" @click="handleBatchDeleteTemplate">批量删除</a-button>
                </div>
                <div style="border-bottom: 1px solid #e8e8e8; margin-bottom: 16px;"></div>
                <a-table :columns="templateColumns" :data-source="paginatedTemplateData" row-key="id" :pagination="false" :row-selection="{ selectedRowKeys: selectedTemplateKeys, onChange: handleTemplateSelectChange }">
                  <template #status="{ record }">
                    <a-switch
                      :checked="record.status === 'enabled'"
                      :checked-children="'启用'"
                      :un-checked-children="'停用'"
                      @change="() => toggleTemplateStatus(record)"
                    />
                  </template>
                  <template #action="{ record }">
                    <a-button size="small" style="margin-right: 8px;" @click="handleEditTemplate(record)">编辑</a-button>
                    <a-button size="small" danger @click="handleDeleteTemplate(record)">删除</a-button>
                  </template>
                </a-table>
                <div class="pagination-container">
                  <a-pagination
                    v-model:current="templatePagination.current"
                    v-model:pageSize="templatePagination.pageSize"
                    :total="templateData.length"
                    :showSizeChanger="true"
                    :pageSizeOptions="PAGE_SIZE_OPTIONS"
                    :showTotal="showTotal"
                    showQuickJumper
                    size="default"
                  />
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>

          <!-- 从规则创建模板弹窗 -->
          <a-modal
            v-model:open="createTemplateModalVisible"
            title="从规则创建模板"
            width="500px"
            @ok="handleCreateTemplateConfirm"
            @cancel="handleCreateTemplateCancel"
          >
            <a-form layout="vertical">
              <a-form-item label="选择规则" required>
                <a-select v-model:value="selectedRuleId" placeholder="请选择一个规则">
                  <a-select-option v-for="rule in rulesData" :key="rule.id" :value="rule.id">
                    {{ rule.ruleName }} ({{ rule.ruleCode }})
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="模板名称" required>
                <a-input v-model:value="templateName" placeholder="请输入模板名称" />
              </a-form-item>
            </a-form>
          </a-modal>

          <!-- 编辑模板弹窗 -->
          <a-modal
            v-model:open="editTemplateModalVisible"
            title="编辑模板"
            width="500px"
            @ok="handleEditTemplateConfirm"
            @cancel="handleEditTemplateCancel"
          >
            <a-form layout="vertical">
              <a-form-item label="选择规则" required>
                <a-select v-model:value="editTemplateRuleId" placeholder="请选择一个规则">
                  <a-select-option v-for="rule in rulesData" :key="rule.id" :value="rule.id">
                    {{ rule.ruleName }} ({{ rule.ruleCode }})
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="模板名称" required>
                <a-input v-model:value="editTemplateName" placeholder="请输入模板名称" />
              </a-form-item>
            </a-form>
          </a-modal>

          <!-- 编辑分类弹窗 -->
          <a-modal
            v-model:open="editCategoryModalVisible"
            title="编辑分类"
            width="500px"
            @ok="handleEditCategoryConfirm"
            @cancel="handleEditCategoryCancel"
          >
            <a-form layout="vertical">
              <a-form-item label="分类名称" required>
                <a-input v-model:value="editCategoryName" placeholder="请输入分类名称" />
              </a-form-item>
              <a-form-item label="分类编码" required>
                <a-input v-model:value="editCategoryCode" placeholder="请输入分类编码" />
              </a-form-item>
            </a-form>
          </a-modal>

          <!-- 删除确认弹窗 -->
          <a-modal
            v-model:open="deleteModalVisible"
            title="确认删除"
            width="400px"
            @ok="handleDeleteConfirm"
            @cancel="handleDeleteCancel"
            :ok-text="'确认'"
            :cancel-text="'取消'"
            :ok-type="'danger'"
          >
            <div v-if="deleteRecord && !isBatchDelete">
              <p>确定要删除{{ deleteRecord.type === 'category' ? '分类' : deleteRecord.type === 'business' ? '业务对象' : '模板' }} "{{ deleteRecord.name }}" 吗？</p>
              <p style="color: #ff4d4f; margin-top: 12px;">删除后将无法恢复，请谨慎操作。</p>
            </div>
            <div v-else-if="isBatchDelete">
              <p>确定要删除选中的 {{ batchDeleteCount }} 个{{ batchDeleteType === 'category' ? '分类' : batchDeleteType === 'business' ? '业务对象' : '模板' }} 吗？</p>
              <p style="color: #ff4d4f; margin-top: 12px;">删除后将无法恢复，请谨慎操作。</p>
            </div>
          </a-modal>

          <!-- 新增业务对象弹窗 -->
          <a-modal
            v-model:open="addBusinessModalVisible"
            title="新增业务对象"
            width="500px"
            @ok="handleAddBusinessConfirm"
            @cancel="handleAddBusinessCancel"
          >
            <a-form layout="vertical">
              <a-form-item label="对象名称" required>
                <a-input v-model:value="addBusinessName" placeholder="请输入业务对象名称" />
              </a-form-item>
              <a-form-item label="对象编码" required>
                <a-input v-model:value="addBusinessCode" placeholder="请输入业务对象编码" />
              </a-form-item>
            </a-form>
          </a-modal>

          <!-- 配置业务对象属性弹窗 -->
          <a-modal
            v-model:open="configureBusinessModalVisible"
            :title="`配置【${currentBusinessObject?.name}】属性`"
            width="800px"
            @ok="handleConfigureBusinessConfirm"
            @cancel="handleConfigureBusinessCancel"
          >
            <div v-if="currentBusinessObject">
              <a-form layout="vertical">
                <a-form-item>
                  <div style="margin-top: 24px; margin-bottom: 16px;">
                    <a-button type="primary" @click="handleAddProperty">新增属性</a-button>
                    <div style="border-bottom: 1px solid #e8e8e8; margin-top: 12px;"></div>
                  </div>
                  <a-table :columns="propertyColumns" :data-source="businessProperties" row-key="id">
                    <template #action="{ record }">
                      <div style="display: flex; gap: 8px;">
                        <a-button size="small" @click="handleEditProperty(record)">编辑</a-button>
                        <a-button size="small" danger @click="handleDeleteProperty(record)">删除</a-button>
                      </div>
                    </template>
                  </a-table>
                </a-form-item>
              </a-form>
            </div>
          </a-modal>

          <!-- 新增/编辑属性弹窗 -->
          <a-modal
            v-model:open="propertyModalVisible"
            :title="isEditProperty ? '编辑属性' : '新增属性'"
            width="500px"
            @ok="handlePropertyConfirm"
            @cancel="handlePropertyCancel"
          >
            <a-form layout="vertical">
              <a-form-item label="属性名称" required>
                <a-input v-model:value="propertyForm.name" placeholder="请输入属性名称" />
              </a-form-item>
              <a-form-item label="属性编码" required>
                <a-input v-model:value="propertyForm.code" placeholder="请输入属性编码" />
              </a-form-item>
              <a-form-item label="属性类型" required>
                <a-select v-model:value="propertyForm.type" placeholder="请选择属性类型">
                  <a-select-option value="string">字符串</a-select-option>
                  <a-select-option value="number">数字</a-select-option>
                  <a-select-option value="boolean">布尔值</a-select-option>
                  <a-select-option value="date">日期</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="是否必填">
                <a-switch v-model:checked="propertyForm.required" />
              </a-form-item>
              <a-form-item label="默认值">
                <a-input v-model:value="propertyForm.defaultValue" placeholder="请输入默认值" />
              </a-form-item>
            </a-form>
          </a-modal>

          <!-- 编辑业务对象弹窗 -->
          <a-modal
            v-model:open="editBusinessModalVisible"
            title="编辑业务对象"
            width="500px"
            @ok="handleEditBusinessConfirm"
            @cancel="handleEditBusinessCancel"
          >
            <a-form layout="vertical">
              <a-form-item label="对象名称" required>
                <a-input v-model:value="editBusinessName" placeholder="请输入业务对象名称" />
              </a-form-item>
              <a-form-item label="对象编码" required>
                <a-input v-model:value="editBusinessCode" placeholder="请输入业务对象编码" />
              </a-form-item>
            </a-form>
          </a-modal>
        </a-card>
      </div>
    </AppLayout>
  </a-config-provider>
</template>

<script setup lang="ts">
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';

// 常量定义
const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;

// 规则分类数据
const categoryData = ref([
  { id: 1, name: '设备编码', code: 'DEVICE', status: 'enabled' },
  { id: 2, name: '工单编码', code: 'WO', status: 'enabled' },
  { id: 3, name: '库位编码', code: 'WAREHOUSE', status: 'enabled' },
]);

// 规则分类分页状态
const categoryPagination = ref({
  current: 1,
  pageSize: 10
});

// 规则分类分页数据
const paginatedCategoryData = computed(() => {
  const start = (categoryPagination.value.current - 1) * categoryPagination.value.pageSize;
  const end = start + categoryPagination.value.pageSize;
  return categoryData.value.slice(start, end);
});

// 规则分类列配置
const categoryColumns = [
  { title: '分类名称', dataIndex: 'name', key: 'name' },
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '状态', key: 'status', slots: { customRender: 'status' } },
  { title: '操作', key: 'action', slots: { customRender: 'action' } },
];

// 业务对象数据
const businessData = ref([
  { id: 1, name: '设备', code: 'DEVICE', status: 'enabled' },
  { id: 2, name: '生产工单', code: 'WORKORDER', status: 'enabled' },
  { id: 3, name: '库位', code: 'LOCATION', status: 'enabled' },
]);

// 业务对象分页状态
const businessPagination = ref({
  current: 1,
  pageSize: 10
});

// 业务对象分页数据
const paginatedBusinessData = computed(() => {
  const start = (businessPagination.value.current - 1) * businessPagination.value.pageSize;
  const end = start + businessPagination.value.pageSize;
  return businessData.value.slice(start, end);
});

// 业务对象列配置
const businessColumns = [
  { title: '对象名称', dataIndex: 'name', key: 'name' },
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '是否启用', key: 'status', slots: { customRender: 'status' } },
  { title: '操作', key: 'action', slots: { customRender: 'action' } },
];

// 模板数据
const templateData = ref([
  { id: 1, name: '设备编码模板（标准）', applyObject: '设备', status: 'enabled' },
  { id: 2, name: '工单编码模板（装配线）', applyObject: '生产工单', status: 'enabled' },
]);

// 模板分页状态
const templatePagination = ref({
  current: 1,
  pageSize: 10
});

// 模板分页数据
const paginatedTemplateData = computed(() => {
  const start = (templatePagination.value.current - 1) * templatePagination.value.pageSize;
  const end = start + templatePagination.value.pageSize;
  return templateData.value.slice(start, end);
});

// 从规则创建模板弹窗
const createTemplateModalVisible = ref(false);
const selectedRuleId = ref<number | null>(null);
const templateName = ref('');

// 模拟规则数据
const rulesData = ref([
  { id: 1, ruleCode: 'EQ-RULE-001', ruleName: '生产设备编码规则', ruleType: 'equipment' },
  { id: 2, ruleCode: 'PR-RULE-001', ruleName: '产品编码规则', ruleType: 'product' },
  { id: 3, ruleCode: 'MT-RULE-001', ruleName: '原材料编码规则', ruleType: 'material' },
  { id: 4, ruleCode: 'AS-RULE-001', ruleName: '固定资产编码规则', ruleType: 'asset' },
  { id: 5, ruleCode: 'EQ-RULE-002', ruleName: '检测设备编码规则', ruleType: 'equipment' },
]);

// 模板列配置
const templateColumns = [
  { title: '模板名称', dataIndex: 'name', key: 'name' },
  { title: '适用对象', dataIndex: 'applyObject', key: 'applyObject' },
  { title: '状态', key: 'status', slots: { customRender: 'status' } },
  { title: '操作', key: 'action', slots: { customRender: 'action' } },
];

// 显示总数
const showTotal = (total: number) => `共 ${total} 条记录`;

// 从规则创建模板
const handleCreateTemplateFromRule = () => {
  // 打开从规则创建模板弹窗
  createTemplateModalVisible.value = true;
  selectedRuleId.value = null;
  templateName.value = '';
};

// 确认创建模板
const handleCreateTemplateConfirm = () => {
  if (!selectedRuleId.value) {
    message.warning('请选择一个规则');
    return;
  }
  
  if (!templateName.value.trim()) {
    message.warning('请输入模板名称');
    return;
  }
  
  // 找到选中的规则
  const selectedRule = rulesData.value.find(rule => rule.id === selectedRuleId.value);
  if (selectedRule) {
    // 创建新模板
    const newTemplate = {
      id: templateData.value.length + 1,
      name: templateName.value,
      applyObject: getRuleTypeText(selectedRule.ruleType),
      status: 'enabled'
    };
    
    // 添加到模板数据中
    templateData.value.push(newTemplate);
    
    // 关闭弹窗
    createTemplateModalVisible.value = false;
    
    // 显示成功消息
    message.success('模板创建成功');
  }
};

// 关闭创建模板弹窗
const handleCreateTemplateCancel = () => {
  createTemplateModalVisible.value = false;
  selectedRuleId.value = null;
  templateName.value = '';
};

// 规则类型文本映射
const getRuleTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    equipment: '设备',
    product: '产品',
    material: '物料',
    asset: '资产',
    other: '其他'
  };
  return textMap[type] || type;
};

// 编辑模板弹窗
const editTemplateModalVisible = ref(false);
const currentTemplate = ref<any>(null);
const editTemplateName = ref('');
const editTemplateRuleId = ref<number | null>(null);

// 删除确认弹窗
const deleteModalVisible = ref(false);
const deleteRecord = ref<any>(null);
const isBatchDelete = ref(false);
const batchDeleteCount = ref(0);
const batchDeleteType = ref<'category' | 'business' | 'template'>('template');
const batchDeleteKeys = ref<(string | number)[]>([]);

// 模板选择
const selectedTemplateKeys = ref<(string | number)[]>([]);

// 处理模板选择变化
const handleTemplateSelectChange = (keys: (string | number)[]) => {
  selectedTemplateKeys.value = keys;
};

// 分类选择
const selectedCategoryKeys = ref<(string | number)[]>([]);

// 处理分类选择变化
const handleCategorySelectChange = (keys: (string | number)[]) => {
  selectedCategoryKeys.value = keys;
};

// 业务对象选择
const selectedBusinessKeys = ref<(string | number)[]>([]);

// 处理业务对象选择变化
const handleBusinessSelectChange = (keys: (string | number)[]) => {
  selectedBusinessKeys.value = keys;
};



// 编辑模板
const handleEditTemplate = (record: any) => {
  // 打开编辑模板弹窗
  currentTemplate.value = record;
  editTemplateName.value = record.name;
  // 尝试根据适用对象找到对应的规则ID
  const matchedRule = rulesData.value.find(rule => getRuleTypeText(rule.ruleType) === record.applyObject);
  editTemplateRuleId.value = matchedRule ? matchedRule.id : null;
  editTemplateModalVisible.value = true;
};

// 确认编辑模板
const handleEditTemplateConfirm = () => {
  if (!editTemplateName.value.trim()) {
    message.warning('请输入模板名称');
    return;
  }
  
  if (!editTemplateRuleId.value) {
    message.warning('请选择一个规则');
    return;
  }
  
  if (currentTemplate.value) {
    // 找到选中的规则
    const selectedRule = rulesData.value.find(rule => rule.id === editTemplateRuleId.value);
    if (selectedRule) {
      // 更新模板信息
      const index = templateData.value.findIndex(template => template.id === currentTemplate.value.id);
      if (index !== -1) {
        templateData.value[index].name = editTemplateName.value;
        templateData.value[index].applyObject = getRuleTypeText(selectedRule.ruleType);
        
        // 关闭弹窗
        editTemplateModalVisible.value = false;
        
        // 显示成功消息
        message.success('模板编辑成功');
      }
    }
  }
};

// 关闭编辑模板弹窗
const handleEditTemplateCancel = () => {
  editTemplateModalVisible.value = false;
  currentTemplate.value = null;
  editTemplateName.value = '';
  editTemplateRuleId.value = null;
};

// 编辑分类弹窗
const editCategoryModalVisible = ref(false);
const currentCategory = ref<any>(null);
const editCategoryName = ref('');
const editCategoryCode = ref('');

// 编辑分类
const handleEditCategory = (record: any) => {
  // 打开编辑分类弹窗
  currentCategory.value = record;
  editCategoryName.value = record.name;
  editCategoryCode.value = record.code;
  editCategoryModalVisible.value = true;
};

// 删除分类
const handleDeleteCategory = (record: any) => {
  // 打开删除确认弹窗
  deleteRecord.value = { ...record, type: 'category' };
  isBatchDelete.value = false;
  deleteModalVisible.value = true;
};

// 确认编辑分类
const handleEditCategoryConfirm = () => {
  if (!editCategoryName.value.trim()) {
    message.warning('请输入分类名称');
    return;
  }
  
  if (!editCategoryCode.value.trim()) {
    message.warning('请输入分类编码');
    return;
  }
  
  if (currentCategory.value) {
    // 更新分类信息
    const index = categoryData.value.findIndex(category => category.id === currentCategory.value.id);
    if (index !== -1) {
      categoryData.value[index].name = editCategoryName.value;
      categoryData.value[index].code = editCategoryCode.value;
      
      // 关闭弹窗
      editCategoryModalVisible.value = false;
      
      // 显示成功消息
      message.success('分类编辑成功');
    }
  }
};

// 关闭编辑分类弹窗
const handleEditCategoryCancel = () => {
  editCategoryModalVisible.value = false;
  currentCategory.value = null;
  editCategoryName.value = '';
  editCategoryCode.value = '';
};



// 切换模板状态
const toggleTemplateStatus = (record: any) => {
  const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled';
  const index = templateData.value.findIndex(template => template.id === record.id);
  if (index !== -1) {
    templateData.value[index].status = newStatus;
    message.success(`模板 "${record.name}" 已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  }
};

// 切换分类状态
const toggleCategoryStatus = (record: any) => {
  const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled';
  const index = categoryData.value.findIndex(category => category.id === record.id);
  if (index !== -1) {
    categoryData.value[index].status = newStatus;
    message.success(`分类 "${record.name}" 已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  }
};

// 切换业务对象状态
const toggleBusinessObjectStatus = (record: any) => {
  const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled';
  const index = businessData.value.findIndex(business => business.id === record.id);
  if (index !== -1) {
    businessData.value[index].status = newStatus;
    message.success(`业务对象 "${record.name}" 已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  }
};

// 删除模板
const handleDeleteTemplate = (record: any) => {
  // 打开删除确认弹窗
  deleteRecord.value = { ...record, type: 'template' };
  isBatchDelete.value = false;
  deleteModalVisible.value = true;
};

// 确认删除
const handleDeleteConfirm = () => {
  try {
    if (isBatchDelete.value) {
      // 批量删除
      const deleteCount = batchDeleteKeys.value.length;
      
      if (batchDeleteType.value === 'category') {
        categoryData.value = categoryData.value.filter(category => !batchDeleteKeys.value.includes(category.id));
        selectedCategoryKeys.value = [];
      } else if (batchDeleteType.value === 'business') {
        businessData.value = businessData.value.filter(business => !batchDeleteKeys.value.includes(business.id));
        selectedBusinessKeys.value = [];
      } else if (batchDeleteType.value === 'template') {
        templateData.value = templateData.value.filter(template => !batchDeleteKeys.value.includes(template.id));
        selectedTemplateKeys.value = [];
      }
      
      message.success(`批量删除 ${deleteCount} 个${batchDeleteType.value === 'category' ? '分类' : batchDeleteType.value === 'business' ? '业务对象' : '模板'} 成功`);
    } else if (deleteRecord.value) {
      // 单个删除
      if (deleteRecord.value.type === 'category') {
        const index = categoryData.value.findIndex(category => category.id === deleteRecord.value.id);
        if (index !== -1) {
          categoryData.value.splice(index, 1);
          message.success(`分类 "${deleteRecord.value.name}" 已删除`);
        }
      } else if (deleteRecord.value.type === 'business') {
        const index = businessData.value.findIndex(business => business.id === deleteRecord.value.id);
        if (index !== -1) {
          businessData.value.splice(index, 1);
          message.success(`业务对象 "${deleteRecord.value.name}" 已删除`);
        }
      } else {
        const index = templateData.value.findIndex(template => template.id === deleteRecord.value.id);
        if (index !== -1) {
          templateData.value.splice(index, 1);
          message.success(`模板 "${deleteRecord.value.name}" 已删除`);
        }
      }
    }
    
    // 重置状态
    deleteModalVisible.value = false;
    deleteRecord.value = null;
    isBatchDelete.value = false;
    batchDeleteCount.value = 0;
    batchDeleteType.value = 'template';
    batchDeleteKeys.value = [];
  } catch (error) {
    message.error('删除失败');
    console.error('Error deleting:', error);
  }
};

// 取消删除
const handleDeleteCancel = () => {
  deleteModalVisible.value = false;
  deleteRecord.value = null;
  isBatchDelete.value = false;
  batchDeleteCount.value = 0;
  batchDeleteType.value = 'template';
  batchDeleteKeys.value = [];
};

// 新增分类
const handleAddCategory = () => {
  // 这里可以添加新增分类的逻辑
  console.log('新增分类');
  message.info('新增分类功能已启用');
};

// 新增业务对象弹窗
const addBusinessModalVisible = ref(false);
const addBusinessName = ref('');
const addBusinessCode = ref('');

// 新增业务对象
const handleAddBusinessObject = () => {
  // 打开新增业务对象弹窗
  addBusinessModalVisible.value = true;
  addBusinessName.value = '';
  addBusinessCode.value = '';
};

// 确认新增业务对象
const handleAddBusinessConfirm = () => {
  if (!addBusinessName.value.trim()) {
    message.warning('请输入业务对象名称');
    return;
  }
  
  if (!addBusinessCode.value.trim()) {
    message.warning('请输入业务对象编码');
    return;
  }
  
  // 检查编码是否已存在
  const existingBusiness = businessData.value.find(business => business.code === addBusinessCode.value);
  if (existingBusiness) {
    message.warning('业务对象编码已存在');
    return;
  }
  
  // 创建新业务对象
  const newBusiness = {
    id: businessData.value.length + 1,
    name: addBusinessName.value,
    code: addBusinessCode.value,
    status: 'enabled'
  };
  
  // 添加到业务对象数据中
  businessData.value.push(newBusiness);
  
  // 关闭弹窗
  addBusinessModalVisible.value = false;
  
  // 显示成功消息
  message.success('业务对象创建成功');
};

// 关闭新增业务对象弹窗
const handleAddBusinessCancel = () => {
  addBusinessModalVisible.value = false;
  addBusinessName.value = '';
  addBusinessCode.value = '';
};

// 编辑业务对象弹窗
const editBusinessModalVisible = ref(false);
const currentEditBusiness = ref<any>(null);
const editBusinessName = ref('');
const editBusinessCode = ref('');

// 编辑业务对象
const handleEditBusinessObject = (record: any) => {
  // 打开编辑业务对象弹窗
  currentEditBusiness.value = record;
  editBusinessName.value = record.name;
  editBusinessCode.value = record.code;
  editBusinessModalVisible.value = true;
};

// 确认编辑业务对象
const handleEditBusinessConfirm = () => {
  if (!editBusinessName.value.trim()) {
    message.warning('请输入业务对象名称');
    return;
  }
  
  if (!editBusinessCode.value.trim()) {
    message.warning('请输入业务对象编码');
    return;
  }
  
  // 检查编码是否已存在（排除当前编辑的记录）
  const existingBusiness = businessData.value.find(business => business.code === editBusinessCode.value && business.id !== currentEditBusiness.value.id);
  if (existingBusiness) {
    message.warning('业务对象编码已存在');
    return;
  }
  
  // 更新业务对象
  const index = businessData.value.findIndex(business => business.id === currentEditBusiness.value.id);
  if (index !== -1) {
    businessData.value[index].name = editBusinessName.value;
    businessData.value[index].code = editBusinessCode.value;
    message.success('业务对象编辑成功');
  }
  
  // 关闭弹窗
  editBusinessModalVisible.value = false;
  currentEditBusiness.value = null;
  editBusinessName.value = '';
  editBusinessCode.value = '';
};

// 关闭编辑业务对象弹窗
const handleEditBusinessCancel = () => {
  editBusinessModalVisible.value = false;
  currentEditBusiness.value = null;
  editBusinessName.value = '';
  editBusinessCode.value = '';
};

// 删除业务对象
const handleDeleteBusinessObject = (record: any) => {
  // 打开删除确认弹窗
  deleteRecord.value = { ...record, type: 'business' };
  isBatchDelete.value = false;
  deleteModalVisible.value = true;
};

// 配置业务对象属性弹窗
const configureBusinessModalVisible = ref(false);
const currentBusinessObject = ref<any>(null);
const businessProperties = ref<any[]>([]);

// 新增/编辑属性弹窗
const propertyModalVisible = ref(false);
const isEditProperty = ref(false);
const currentProperty = ref<any>(null);
const propertyForm = ref({
  name: '',
  code: '',
  type: 'string',
  required: false,
  defaultValue: ''
});

// 属性列配置
const propertyColumns = [
  { title: '属性名称', dataIndex: 'name', key: 'name' },
  { title: '属性编码', dataIndex: 'code', key: 'code' },
  { title: '属性类型', dataIndex: 'type', key: 'type', customRender: ({ text }: { text: string }) => {
    const typeMap: Record<string, string> = {
      string: '字符串',
      number: '数字',
      boolean: '布尔值',
      date: '日期'
    };
    return typeMap[text] || text;
  }},
  { title: '是否必填', dataIndex: 'required', key: 'required', customRender: ({ text }: { text: boolean }) => {
    return text ? '是' : '否';
  }},
  { title: '默认值', dataIndex: 'defaultValue', key: 'defaultValue' },
  { title: '操作', key: 'action', slots: { customRender: 'action' } }
];

// 配置业务对象属性
const handleConfigureBusinessObject = (record: any) => {
  // 打开配置属性弹窗
  currentBusinessObject.value = record;
  // 模拟属性数据
  businessProperties.value = [
    { id: 1, name: '名称', code: 'name', type: 'string', required: true, defaultValue: 'true' },
    { id: 2, name: '编码', code: 'code', type: 'string', required: true, defaultValue: 'false' },
    { id: 3, name: '状态', code: 'status', type: 'boolean', required: false, defaultValue: 'true' }
  ];
  configureBusinessModalVisible.value = true;
};

// 确认配置业务对象属性
const handleConfigureBusinessConfirm = () => {
  // 保存属性配置
  message.success(`业务对象 ${currentBusinessObject.value.name} 的属性配置已保存`);
  configureBusinessModalVisible.value = false;
  currentBusinessObject.value = null;
  businessProperties.value = [];
};

// 取消配置业务对象属性
const handleConfigureBusinessCancel = () => {
  configureBusinessModalVisible.value = false;
  currentBusinessObject.value = null;
  businessProperties.value = [];
};

// 新增属性
const handleAddProperty = () => {
  isEditProperty.value = false;
  currentProperty.value = null;
  propertyForm.value = {
    name: '',
    code: '',
    type: 'string',
    required: false,
    defaultValue: ''
  };
  propertyModalVisible.value = true;
};

// 编辑属性
const handleEditProperty = (record: any) => {
  isEditProperty.value = true;
  currentProperty.value = record;
  propertyForm.value = {
    name: record.name,
    code: record.code,
    type: record.type,
    required: record.required,
    defaultValue: record.defaultValue
  };
  propertyModalVisible.value = true;
};

// 删除属性
const handleDeleteProperty = (record: any) => {
  const index = businessProperties.value.findIndex(prop => prop.id === record.id);
  if (index !== -1) {
    businessProperties.value.splice(index, 1);
    message.success(`属性 "${record.name}" 已删除`);
  }
};

// 确认新增/编辑属性
const handlePropertyConfirm = () => {
  if (!propertyForm.value.name.trim()) {
    message.warning('请输入属性名称');
    return;
  }
  
  if (!propertyForm.value.code.trim()) {
    message.warning('请输入属性编码');
    return;
  }
  
  if (!propertyForm.value.type) {
    message.warning('请选择属性类型');
    return;
  }
  
  if (isEditProperty.value && currentProperty.value) {
    // 编辑属性
    const index = businessProperties.value.findIndex(prop => prop.id === currentProperty.value.id);
    if (index !== -1) {
      businessProperties.value[index] = {
        ...currentProperty.value,
        ...propertyForm.value
      };
      message.success('属性编辑成功');
    }
  } else {
    // 新增属性
    const newProperty = {
      id: businessProperties.value.length + 1,
      ...propertyForm.value
    };
    businessProperties.value.push(newProperty);
    message.success('属性新增成功');
  }
  
  propertyModalVisible.value = false;
};

// 取消新增/编辑属性
const handlePropertyCancel = () => {
  propertyModalVisible.value = false;
  isEditProperty.value = false;
  currentProperty.value = null;
  propertyForm.value = {
    name: '',
    code: '',
    type: 'string',
    required: false,
    defaultValue: ''
  };
};

// 批量启用分类
const handleBatchEnableCategory = () => {
  if (selectedCategoryKeys.value.length === 0) {
    message.warning('请先选择要启用的分类');
    return;
  }

  try {
    categoryData.value = categoryData.value.map(category => {
      if (selectedCategoryKeys.value.includes(category.id)) {
        return { ...category, status: 'enabled' };
      }
      return category;
    });
    selectedCategoryKeys.value = [];
    message.success('批量启用分类成功');
  } catch (error) {
    message.error('批量启用分类失败');
    console.error('Error batch enabling categories:', error);
  }
};

// 批量停用分类
const handleBatchDisableCategory = () => {
  if (selectedCategoryKeys.value.length === 0) {
    message.warning('请先选择要停用的分类');
    return;
  }

  try {
    categoryData.value = categoryData.value.map(category => {
      if (selectedCategoryKeys.value.includes(category.id)) {
        return { ...category, status: 'disabled' };
      }
      return category;
    });
    selectedCategoryKeys.value = [];
    message.success('批量停用分类成功');
  } catch (error) {
    message.error('批量停用分类失败');
    console.error('Error batch disabling categories:', error);
  }
};

// 批量删除分类
const handleBatchDeleteCategory = () => {
  if (selectedCategoryKeys.value.length === 0) {
    message.warning('请先选择要删除的分类');
    return;
  }

  // 打开删除确认弹窗
  isBatchDelete.value = true;
  batchDeleteCount.value = selectedCategoryKeys.value.length;
  batchDeleteType.value = 'category';
  batchDeleteKeys.value = [...selectedCategoryKeys.value];
  deleteModalVisible.value = true;
};

// 批量启用业务对象
const handleBatchEnableBusiness = () => {
  if (selectedBusinessKeys.value.length === 0) {
    message.warning('请先选择要启用的业务对象');
    return;
  }

  try {
    businessData.value = businessData.value.map(business => {
      if (selectedBusinessKeys.value.includes(business.id)) {
        return { ...business, status: 'enabled' };
      }
      return business;
    });
    selectedBusinessKeys.value = [];
    message.success('批量启用业务对象成功');
  } catch (error) {
    message.error('批量启用业务对象失败');
    console.error('Error batch enabling business objects:', error);
  }
};

// 批量停用业务对象
const handleBatchDisableBusiness = () => {
  if (selectedBusinessKeys.value.length === 0) {
    message.warning('请先选择要停用的业务对象');
    return;
  }

  try {
    businessData.value = businessData.value.map(business => {
      if (selectedBusinessKeys.value.includes(business.id)) {
        return { ...business, status: 'disabled' };
      }
      return business;
    });
    selectedBusinessKeys.value = [];
    message.success('批量停用业务对象成功');
  } catch (error) {
    message.error('批量停用业务对象失败');
    console.error('Error batch disabling business objects:', error);
  }
};

// 批量删除业务对象
const handleBatchDeleteBusiness = () => {
  if (selectedBusinessKeys.value.length === 0) {
    message.warning('请先选择要删除的业务对象');
    return;
  }

  // 打开删除确认弹窗
  isBatchDelete.value = true;
  batchDeleteCount.value = selectedBusinessKeys.value.length;
  batchDeleteType.value = 'business';
  batchDeleteKeys.value = [...selectedBusinessKeys.value];
  deleteModalVisible.value = true;
};

// 批量启用模板
const handleBatchEnableTemplate = () => {
  if (selectedTemplateKeys.value.length === 0) {
    message.warning('请先选择要启用的模板');
    return;
  }

  try {
    templateData.value = templateData.value.map(template => {
      if (selectedTemplateKeys.value.includes(template.id)) {
        return { ...template, status: 'enabled' };
      }
      return template;
    });
    selectedTemplateKeys.value = [];
    message.success('批量启用模板成功');
  } catch (error) {
    message.error('批量启用模板失败');
    console.error('Error batch enabling templates:', error);
  }
};

// 批量停用模板
const handleBatchDisableTemplate = () => {
  if (selectedTemplateKeys.value.length === 0) {
    message.warning('请先选择要停用的模板');
    return;
  }

  try {
    templateData.value = templateData.value.map(template => {
      if (selectedTemplateKeys.value.includes(template.id)) {
        return { ...template, status: 'disabled' };
      }
      return template;
    });
    selectedTemplateKeys.value = [];
    message.success('批量停用模板成功');
  } catch (error) {
    message.error('批量停用模板失败');
    console.error('Error batch disabling templates:', error);
  }
};

// 批量删除模板
const handleBatchDeleteTemplate = () => {
  if (selectedTemplateKeys.value.length === 0) {
    message.warning('请先选择要删除的模板');
    return;
  }

  // 打开删除确认弹窗
  isBatchDelete.value = true;
  batchDeleteCount.value = selectedTemplateKeys.value.length;
  batchDeleteType.value = 'template';
  batchDeleteKeys.value = [...selectedTemplateKeys.value];
  deleteModalVisible.value = true;
};
</script>

<style scoped>
.system-setting {
  padding: 20px;
}

.setting-tabs {
  margin-top: 16px;
}

.section-content {
  padding: 20px 0;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-label {
  font-size: 14px;
  color: #666;
}

.config-actions {
  margin-top: 10px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  margin-bottom: 16px;
}

.category-actions,
.business-actions,
.template-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-actions :deep(.ant-btn),
.business-actions :deep(.ant-btn),
.template-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.category-actions :deep(.ant-btn:hover),
.business-actions :deep(.ant-btn:hover),
.template-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}
</style>
