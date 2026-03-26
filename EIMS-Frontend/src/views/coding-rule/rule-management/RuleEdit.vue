<template>
    <AppLayout>
        <a-config-provider :locale="zhCN">
            <div class="rule-edit-container">
                <div class="rule-edit-page">
                    <!-- 步骤条 -->
                    <div class="steps-wrapper">
                        <a-steps :current="currentStep" size="small">
                            <a-step title="基本信息" />
                            <a-step title="绑定对象" />
                            <a-step title="编码结构" />
                            <a-step title="高级配置" />
                        </a-steps>
                    </div>

                    <!-- 表单内容 -->
                    <div class="form-wrapper">
                        <!-- 步骤1：基本信息 -->
                        <div v-show="currentStep === 0" class="step-content">
                            <a-form :model="formData" layout="vertical" class="edit-form">
                                <a-row :gutter="24">
                                    <a-col :span="8">
                                        <a-form-item required>
                                            <template #label>
                                                <span>规则编码
                                                    <Tooltip title="规则的唯一标识符，用于系统内部识别">
                                                        <QuestionCircleOutlined style="margin-left: 4px; color: #1890ff" />
                                                    </Tooltip>
                                                </span>
                                            </template>
                                            <a-input 
                                                v-model:value="formData.ruleCode" 
                                                placeholder="请输入规则编码"
                                                :maxLength="50"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="8">
                                        <a-form-item required>
                                            <template #label>
                                                <span>规则名称
                                                    <Tooltip title="规则的名称，用于在系统中显示">
                                                        <QuestionCircleOutlined style="margin-left: 4px; color: #1890ff" />
                                                    </Tooltip>
                                                </span>
                                            </template>
                                            <a-input 
                                                v-model:value="formData.ruleName" 
                                                placeholder="请输入规则名称"
                                                :maxLength="100"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="8">
                                        <a-form-item required>
                                            <template #label>
                                                <span>规则分类
                                                    <Tooltip title="规则的分类，用于区分不同类型的编码规则">
                                                        <QuestionCircleOutlined style="margin-left: 4px; color: #1890ff" />
                                                    </Tooltip>
                                                </span>
                                            </template>
                                            <a-select 
                                                v-model:value="formData.ruleType" 
                                                placeholder="请选择规则分类"
                                            >
                                                <a-select-option value="equipment">设备编码</a-select-option>
                                                <a-select-option value="product">产品编码</a-select-option>
                                                <a-select-option value="material">物料编码</a-select-option>
                                                <a-select-option value="asset">资产编码</a-select-option>
                                                <a-select-option value="other">其他</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-row :gutter="24">
                                    <a-col :span="8">
                                        <a-form-item required>
                                            <template #label>
                                                <span>生效日期
                                                    <Tooltip title="规则开始生效的日期">
                                                        <QuestionCircleOutlined style="margin-left: 4px; color: #1890ff" />
                                                    </Tooltip>
                                                </span>
                                            </template>
                                            <a-date-picker 
                                                v-model:value="formData.effectiveDate" 
                                                style="width: 100%"
                                                format="YYYY/MM/DD"
                                                placeholder="请选择生效日期"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="8">
                                        <a-form-item required>
                                            <template #label>
                                                <span>失效日期
                                                    <Tooltip title="规则停止生效的日期">
                                                        <QuestionCircleOutlined style="margin-left: 4px; color: #1890ff" />
                                                    </Tooltip>
                                                </span>
                                            </template>
                                            <a-date-picker 
                                                v-model:value="formData.expiryDate" 
                                                style="width: 100%"
                                                format="YYYY/MM/DD"
                                                placeholder="请选择失效日期"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="8">
                                        <a-form-item required>
                                            <template #label>
                                                <span>优先级
                                                    <Tooltip title="规则的优先级，数值越小优先级越高">
                                                        <QuestionCircleOutlined style="margin-left: 4px; color: #1890ff" />
                                                    </Tooltip>
                                                </span>
                                            </template>
                                            <a-input-number 
                                                v-model:value="formData.priority" 
                                                :min="1" 
                                                :max="999"
                                                style="width: 100%"
                                                placeholder="请输入优先级"
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-form-item required>
                                    <template #label>
                                        <span>规则描述
                                            <Tooltip title="规则的详细描述，包括适用场景等信息">
                                                <QuestionCircleOutlined style="margin-left: 4px; color: #1890ff" />
                                            </Tooltip>
                                        </span>
                                    </template>
                                    <a-textarea 
                                        v-model:value="formData.description" 
                                        :rows="4"
                                        placeholder="说明适用场景：车间设备、机床、AGV、PLC等统一编码"
                                        :maxlength="500"
                                        :show-count="{
                                            formatter: (info: { value: string, count: number, maxLength?: number }) => `已输入${info.count}字，最大500字`
                                        }"
                                    />
                                </a-form-item>
                            </a-form>
                        </div>

                        <!-- 步骤2：绑定对象 -->
                        <div v-show="currentStep === 1" class="step-content">
                            <div class="placeholder-content">
                                <a-empty description="绑定对象配置" />
                            </div>
                        </div>

                        <!-- 步骤3：编码结构 -->
                        <div v-show="currentStep === 2" class="step-content">
                            <div class="placeholder-content">
                                <a-empty description="编码结构配置" />
                            </div>
                        </div>

                        <!-- 步骤4：高级配置 -->
                        <div v-show="currentStep === 3" class="step-content">
                            <div class="placeholder-content">
                                <a-empty description="高级配置" />
                            </div>
                        </div>
                    </div>

                    <!-- 底部按钮 -->
                    <div class="form-footer">
                        <a-button type="primary" @click="handleSaveDraft">保存草稿</a-button>
                        <a-button type="primary" @click="handleSubmit">提交</a-button>
                        <a-button @click="handleCancel">取消</a-button>
                    </div>
                </div>
            </div>
        </a-config-provider>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message, Tooltip } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

// 设置 dayjs 为中文
dayjs.locale('zh-cn');

// 路由
const route = useRoute();
const router = useRouter();

// 当前步骤
const currentStep = ref(0);

// 表单数据
interface FormData {
    ruleCode: string;
    ruleName: string;
    ruleType: string;
    effectiveDate: Dayjs | null;
    expiryDate: Dayjs | null;
    priority: number;
    description: string;
}

const formData = reactive<FormData>({
    ruleCode: '',
    ruleName: '',
    ruleType: 'equipment',
    effectiveDate: null,
    expiryDate: null,
    priority: 1,
    description: ''
});

// 是否是编辑模式
const isEdit = ref(false);

// 初始化
onMounted(() => {
    const id = route.params.id;
    if (id) {
        isEdit.value = true;
        // 加载数据
        loadRuleData(Number(id));
    } else {
        // 新增模式，设置默认值
        formData.ruleCode = generateRuleCode();
    }
});

// 生成规则编码
const generateRuleCode = (): string => {
    const prefix = 'EQ';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-RULE-${timestamp}`;
};

// 加载规则数据
const loadRuleData = (id: number) => {
    // 模拟加载数据
    // 实际项目中这里应该调用API
    console.log('加载规则数据:', id);
    
    // 模拟数据
    formData.ruleCode = 'EQ-RULE-001';
    formData.ruleName = '设备编码规则-生产车间';
    formData.ruleType = 'equipment';
    formData.priority = 1;
    formData.description = '说明适用场景：车间设备、机床、AGV、PLC等统一编码';
};

// 保存草稿
const handleSaveDraft = () => {
    message.success('草稿保存成功');
};

// 提交
const handleSubmit = () => {
    // 表单验证
    if (!formData.ruleCode || !formData.ruleName || !formData.ruleType || !formData.effectiveDate || !formData.expiryDate || !formData.description) {
        message.error('请填写必填项');
        return;
    }
    
    message.success(isEdit.value ? '规则更新成功' : '规则创建成功');
    router.push('/coding-rule/rule-management/list');
};

// 取消
const handleCancel = () => {
    router.push('/coding-rule/rule-management/list');
};
</script>

<style scoped>
.rule-edit-container {
    width: 100%;
    padding: 1.5%;
}

.rule-edit-page {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    padding: 24px;
}

.steps-wrapper {
    margin-bottom: 32px;
    padding: 0 16px;
}

.form-wrapper {
    min-height: 400px;
    padding: 0 16px;
}

.step-content {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.edit-form {
    max-width: 1200px;
}

.edit-form :deep(.ant-form-item-label) {
    font-weight: 500;
    color: #262626;
}

.edit-form :deep(.ant-form-item-label > label::after) {
    content: '';
}

.edit-form :deep(.ant-form-item-label > label.ant-form-item-required::before) {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
}

.placeholder-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

.form-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 992px) {
    .rule-edit-page {
        padding: 16px;
    }
    
    .steps-wrapper {
        padding: 0;
    }
    
    .form-wrapper {
        padding: 0;
    }
}

@media (max-width: 768px) {
    .rule-edit-container {
        padding: 12px;
    }
    
    .form-footer {
        flex-direction: column;
    }
    
    .form-footer :deep(.ant-btn) {
        width: 100%;
    }
}
</style>
