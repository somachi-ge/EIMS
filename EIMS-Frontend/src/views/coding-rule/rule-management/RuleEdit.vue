<template>
    <AppLayout>
        <a-config-provider :locale="zhCN">
            <div class="rule-list-container">
                <div class="rule-page">
                <!-- 页面标题 -->
                <h2 class="page-title">{{ isEdit ? '编辑规则' : '新增规则' }}</h2>
                <!-- 规则管理卡片 -->
                <a-card class="rule-card">
                    <!-- 步骤条 -->
                    <div class="steps-wrapper">
                        <a-steps :current="currentStep" size="small" @change="handleStepChange">
                            <a-step title="编码结构" />
                            <a-step title="基本信息" />
                            <a-step title="绑定对象" />
                            <a-step title="高级配置" />
                        </a-steps>
                    </div>

                    <!-- 表单内容 -->
                    <div class="form-wrapper">
                        <!-- 步骤1：编码结构 -->
                        <div v-show="currentStep === 0" class="step-content">
                            <div class="coding-structure-content">
                                <!-- 编码分段配置 -->
                                <div class="segment-config">
                                    <h3 class="section-title">编码分段配置</h3>
                                    <div class="segments-list">
                                        <div 
                                            v-for="(segment, index) in formData.segments" 
                                            :key="index"
                                            class="segment-item"
                                        >
                                            <div class="segment-row">
                                                <a-select 
                                                    v-model:value="segment.type" 
                                                    style="width: 120px; margin-right: 12px;"
                                                >
                                                    <a-select-option value="fixed">固定段</a-select-option>
                                                    <a-select-option value="property">属性段</a-select-option>
                                                    <a-select-option value="date">日期段</a-select-option>
                                                    <a-select-option value="serial">流水段</a-select-option>
                                                </a-select>
                                                <a-input 
                                                    v-model:value="segment.value" 
                                                    style="flex: 1; margin-right: 12px;"
                                                    :placeholder="getSegmentPlaceholder(segment.type)"
                                                />
                                                <div class="segment-actions">
                                                    <a-button 
                                                        type="text" 
                                                        @click="moveSegment(index, 'up')"
                                                        :disabled="index === 0"
                                                    >上移</a-button>
                                                    <a-button 
                                                        type="text" 
                                                        @click="moveSegment(index, 'down')"
                                                        :disabled="index === formData.segments.length - 1"
                                                    >下移</a-button>
                                                    <a-button 
                                                        type="text" 
                                                        danger 
                                                        @click="removeSegment(index)"
                                                    >删除</a-button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <a-button type="primary" @click="addSegment" style="margin-top: 12px;">
                                        + 添加分段
                                    </a-button>
                                </div>

                                <!-- 全局配置 -->
                                <div class="global-config" style="margin-top: 32px;">
                                    <h3 class="section-title">全局配置</h3>
                                    <div class="global-config-row">
                                        <div class="config-item">
                                            <span class="config-label">前缀</span>
                                            <a-input v-model:value="formData.prefix" placeholder="可选" style="width: 120px;" />
                                        </div>
                                        <div class="config-item">
                                            <span class="config-label">后缀</span>
                                            <a-input v-model:value="formData.suffix" placeholder="可选" style="width: 120px;" />
                                        </div>
                                        <div class="config-item">
                                            <span class="config-label">分隔符</span>
                                            <a-select v-model:value="formData.separator" style="width: 120px;">
                                                <a-select-option value="-">-</a-select-option>
                                                <a-select-option value="_">_</a-select-option>
                                                <a-select-option value="">无</a-select-option>
                                            </a-select>
                                        </div>
                                    </div>
                                </div>

                                <!-- 实时预览 -->
                                <div class="preview-section" style="margin-top: 32px;">
                                    <h3 class="section-title">实时预览</h3>
                                    <div class="preview-box">
                                        <div class="preview-code">{{ previewCode }}</div>
                                        <div class="preview-description">{{ previewDescription }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 步骤2：基本信息 -->
                        <div v-show="currentStep === 1" class="step-content">
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

                        <!-- 步骤3：绑定对象 -->
                        <div v-show="currentStep === 2" class="step-content">
                            <div class="binding-content">
                                <h3 class="binding-title">绑定业务对象（智改数转）</h3>
                                <div class="binding-options">
                                    <a-checkbox-group v-model:value="formData.bindingObjects">
                                        <a-checkbox value="equipment">设备</a-checkbox>
                                        <a-checkbox value="productionLine">产线</a-checkbox>
                                        <a-checkbox value="tooling">工装夹具</a-checkbox>
                                        <a-checkbox value="productionOrder">生产工单</a-checkbox>
                                        <a-checkbox value="material">物料</a-checkbox>
                                        <a-checkbox value="location">库位</a-checkbox>
                                        <a-checkbox value="batch">批次/SN</a-checkbox>
                                    </a-checkbox-group>
                                </div>
                                <div class="default-rule-option">
                                    <a-checkbox v-model:value="formData.isDefault">设为默认规则</a-checkbox>
                                </div>
                            </div>
                        </div>

                        <!-- 步骤4：高级配置 -->
                        <div v-show="currentStep === 3" class="step-content">
                            <div class="advanced-config-content">
                                <!-- 条件规则 -->
                                <div class="condition-rules">
                                    <h3 class="section-title">条件规则</h3>
                                    <div class="conditions-list">
                                        <div 
                                            v-for="(condition, index) in formData.conditions" 
                                            :key="index"
                                            class="condition-item"
                                        >
                                            <div class="condition-row">
                                                <a-select 
                                                    v-model:value="condition.field" 
                                                    style="width: 120px; margin-right: 12px;"
                                                >
                                                    <a-select-option value="factory">工厂</a-select-option>
                                                    <a-select-option value="department">部门</a-select-option>
                                                    <a-select-option value="workshop">车间</a-select-option>
                                                    <a-select-option value="line">产线</a-select-option>
                                                </a-select>
                                                <a-select 
                                                    v-model:value="condition.operator" 
                                                    style="width: 80px; margin-right: 12px;"
                                                >
                                                    <a-select-option value="=">=</a-select-option>
                                                    <a-select-option value="!=">!=</a-select-option>
                                                    <a-select-option value="like">包含</a-select-option>
                                                    <a-select-option value="not like">不包含</a-select-option>
                                                </a-select>
                                                <a-input 
                                                    v-model:value="condition.value" 
                                                    style="flex: 1; margin-right: 12px;"
                                                    placeholder="请输入值"
                                                />
                                                <div class="condition-logic" v-if="index < formData.conditions.length - 1">
                                                    <a-button-group>
                                                        <a-button 
                                                            :type="condition.logic === 'and' ? 'primary' : 'default'"
                                                            @click="condition.logic = 'and'"
                                                        >且</a-button>
                                                        <a-button 
                                                            :type="condition.logic === 'or' ? 'primary' : 'default'"
                                                            @click="condition.logic = 'or'"
                                                        >或</a-button>
                                                    </a-button-group>
                                                </div>
                                                <a-button 
                                                    type="text" 
                                                    danger 
                                                    @click="removeCondition(index)"
                                                >删除</a-button>
                                            </div>
                                        </div>
                                    </div>
                                    <a-button type="primary" @click="addCondition" style="margin-top: 12px;">
                                        + 添加条件
                                    </a-button>
                                </div>

                                <!-- 流水号配置 -->
                                <div class="serial-config" style="margin-top: 32px;">
                                    <h3 class="section-title">流水号配置</h3>
                                    <div class="serial-config-row">
                                        <div class="config-item">
                                            <span class="config-label">初始值</span>
                                            <a-input-number 
                                                v-model:value="formData.serialConfig.initialValue" 
                                                :min="1" 
                                                style="width: 120px;" 
                                                placeholder="1"
                                            />
                                        </div>
                                        <div class="config-item">
                                            <span class="config-label">步长</span>
                                            <a-input-number 
                                                v-model:value="formData.serialConfig.step" 
                                                :min="1" 
                                                style="width: 120px;" 
                                                placeholder="1"
                                            />
                                        </div>
                                        <div class="config-item">
                                            <span class="config-label">重置周期</span>
                                            <a-select v-model:value="formData.serialConfig.resetCycle" style="width: 120px;">
                                                <a-select-option value="none">不重置</a-select-option>
                                                <a-select-option value="daily">按日</a-select-option>
                                                <a-select-option value="monthly">按月</a-select-option>
                                                <a-select-option value="yearly">按年</a-select-option>
                                            </a-select>
                                        </div>
                                    </div>
                                </div>

                                <!-- 并发与校验 -->
                                <div class="concurrency-config" style="margin-top: 32px;">
                                    <h3 class="section-title">并发与校验</h3>
                                    <div class="concurrency-options">
                                        <a-checkbox v-model:value="formData.concurrencyConfig.antiDuplicate">高并发防重</a-checkbox>
                                        <a-checkbox v-model:value="formData.concurrencyConfig.uniqueCheck">唯一性校验</a-checkbox>
                                        <a-checkbox v-model:value="formData.concurrencyConfig.allow补号">允许补号</a-checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 底部按钮 -->
                    <div class="form-footer">
                        <a-button type="primary" @click="handleSaveDraft">保存草稿</a-button>
                        <a-button type="primary" @click="handleSubmit">提交</a-button>
                        <a-button @click="handleCancel">取消</a-button>
                    </div>
                </a-card>
            </div>
        </div>
        </a-config-provider>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
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

// 编码分段类型
interface Segment {
    type: 'fixed' | 'property' | 'date' | 'serial';
    value: string;
}

// 条件规则类型
interface Condition {
    field: string;
    operator: string;
    value: string;
    logic: 'and' | 'or';
}

// 流水号配置类型
interface SerialConfig {
    initialValue: number;
    step: number;
    resetCycle: 'none' | 'daily' | 'monthly' | 'yearly';
}

// 并发与校验配置类型
interface ConcurrencyConfig {
    antiDuplicate: boolean;
    uniqueCheck: boolean;
    allow补号: boolean;
}

// 表单数据
interface FormData {
    ruleCode: string;
    ruleName: string;
    ruleType: string;
    effectiveDate: Dayjs | null;
    expiryDate: Dayjs | null;
    priority: number;
    description: string;
    bindingObjects: string[];
    isDefault: boolean;
    segments: Segment[];
    prefix: string;
    suffix: string;
    separator: string;
    conditions: Condition[];
    serialConfig: SerialConfig;
    concurrencyConfig: ConcurrencyConfig;
}

const formData = reactive<FormData>({
    ruleCode: '',
    ruleName: '',
    ruleType: 'equipment',
    effectiveDate: null,
    expiryDate: null,
    priority: 1,
    description: '',
    bindingObjects: ['equipment'],
    isDefault: true,
    segments: [
        { type: 'fixed', value: 'EQ-' },
        { type: 'property', value: '车间-产线' },
        { type: 'date', value: 'yyyyMM' },
        { type: 'serial', value: '0001' }
    ],
    prefix: '',
    suffix: '',
    separator: '-',
    conditions: [
        { field: 'factory', operator: '=', value: '一号工厂', logic: 'and' }
    ],
    serialConfig: {
        initialValue: 1,
        step: 1,
        resetCycle: 'daily'
    },
    concurrencyConfig: {
        antiDuplicate: true,
        uniqueCheck: true,
        allow补号: false
    }
});

// 是否是编辑模式
const isEdit = ref(false);

// 预览相关
const previewCode = ref('EQ-CN01-2602-0045');
const previewDescription = ref('固定段 + 车间产线 + 年月 + 流水号');

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
    // 初始化预览
    updatePreview();
});

// 监听编码结构变化，实时更新预览
watch(
    () => [formData.segments, formData.prefix, formData.suffix, formData.separator],
    () => {
        updatePreview();
    },
    { deep: true }
);

// 获取分段占位符
const getSegmentPlaceholder = (type: string): string => {
    const placeholders = {
        fixed: '请输入固定值',
        property: '请输入属性名称',
        date: '请输入日期格式 (如 yyyyMM)',
        serial: '请输入流水号格式 (如 0001)'
    };
    return placeholders[type as keyof typeof placeholders] || '';
};

// 添加分段
const addSegment = () => {
    formData.segments.push({ type: 'fixed', value: '' });
};

// 删除分段
const removeSegment = (index: number) => {
    if (formData.segments.length > 1) {
        formData.segments.splice(index, 1);
    }
};

// 移动分段
const moveSegment = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
        // 上移
        const temp = formData.segments[index];
        formData.segments[index] = formData.segments[index - 1];
        formData.segments[index - 1] = temp;
    } else if (direction === 'down' && index < formData.segments.length - 1) {
        // 下移
        const temp = formData.segments[index];
        formData.segments[index] = formData.segments[index + 1];
        formData.segments[index + 1] = temp;
    }
};

// 更新预览
const updatePreview = () => {
    // 生成预览编码
    const segmentValues = formData.segments.map(segment => {
        switch (segment.type) {
            case 'fixed':
                return segment.value || 'FIXED';
            case 'property':
                return 'CN01'; // 模拟属性值
            case 'date':
                return '2602'; // 模拟日期值
            case 'serial':
                return '0045'; // 模拟流水号
            default:
                return '';
        }
    });
    
    // 构建完整编码
    let code = '';
    if (formData.prefix) {
        code += formData.prefix + formData.separator;
    }
    code += segmentValues.join(formData.separator);
    if (formData.suffix) {
        code += formData.separator + formData.suffix;
    }
    
    previewCode.value = code;
    
    // 生成预览描述
    const segmentDescriptions = formData.segments.map(segment => {
        const descriptions = {
            fixed: '固定段',
            property: '车间产线',
            date: '年月',
            serial: '流水号'
        };
        return descriptions[segment.type] || segment.type;
    });
    
    previewDescription.value = segmentDescriptions.join(' + ');
};

// 添加条件
const addCondition = () => {
    formData.conditions.push({ field: 'factory', operator: '=', value: '', logic: 'and' });
};

// 删除条件
const removeCondition = (index: number) => {
    if (formData.conditions.length > 1) {
        formData.conditions.splice(index, 1);
    }
};

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
    
    // 模拟数据 - 从模拟规则列表中查找对应ID的规则
    const mockRules = [
        {
            dbId: 1,
            ruleCode: 'EQ-RULE-001',
            ruleName: '生产设备编码规则',
            ruleType: 'equipment',
            description: '用于生产设备统一编码管理',
            bindingObjects: ['equipment'],
            isDefault: true,
            priority: 1
        },
        {
            dbId: 2,
            ruleCode: 'PR-RULE-001',
            ruleName: '产品编码规则',
            ruleType: 'product',
            description: '产品出厂编码规则',
            bindingObjects: ['product'],
            isDefault: false,
            priority: 2
        },
        {
            dbId: 3,
            ruleCode: 'MT-RULE-001',
            ruleName: '原材料编码规则',
            ruleType: 'material',
            description: '原材料入库编码规则',
            bindingObjects: ['material'],
            isDefault: false,
            priority: 3
        },
        {
            dbId: 4,
            ruleCode: 'AS-RULE-001',
            ruleName: '固定资产编码规则',
            ruleType: 'asset',
            description: '公司固定资产编码规则',
            bindingObjects: ['asset'],
            isDefault: false,
            priority: 4
        },
        {
            dbId: 5,
            ruleCode: 'EQ-RULE-002',
            ruleName: '检测设备编码规则',
            ruleType: 'equipment',
            description: '质量检测设备编码',
            bindingObjects: ['equipment'],
            isDefault: false,
            priority: 5
        },
        {
            dbId: 6,
            ruleCode: 'OT-RULE-001',
            ruleName: '通用编码规则',
            ruleType: 'other',
            description: '通用物品编码规则',
            bindingObjects: ['equipment', 'product'],
            isDefault: false,
            priority: 6
        }
    ];
    
    // 查找对应ID的规则
    const rule = mockRules.find(r => r.dbId === id);
    
    if (rule) {
        // 填充表单数据
        formData.ruleCode = rule.ruleCode;
        formData.ruleName = rule.ruleName;
        formData.ruleType = rule.ruleType;
        formData.priority = rule.priority;
        formData.description = rule.description;
        formData.bindingObjects = rule.bindingObjects;
        formData.isDefault = rule.isDefault;
        // 可以根据需要设置日期字段
        // formData.effectiveDate = dayjs();
        // formData.expiryDate = dayjs().add(1, 'year');
    } else {
        console.error('未找到ID为', id, '的规则');
    }
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
    
    // 验证绑定对象
    if (!formData.bindingObjects || formData.bindingObjects.length === 0) {
        message.error('请至少选择一个业务对象');
        return;
    }
    
    message.success(isEdit.value ? '规则更新成功' : '规则创建成功');
    router.push('/coding-rule/rule-management/list');
};

// 取消
const handleCancel = () => {
    router.push('/coding-rule/rule-management/list');
};

// 步骤切换
const handleStepChange = (current: number) => {
    currentStep.value = current;
};
</script>

<style scoped>
.rule-list-container {
    width: 100%;
    padding: 1.5%;
}

.rule-page {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    padding: 24px;
}

.rule-card {
    border-radius: 8px;
    box-shadow: none;
    border: none;
    transition: all 0.3s ease;
}

.rule-card:hover {
    box-shadow: none;
}

.page-title {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
}

.steps-wrapper {
    margin-bottom: 40px;
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
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
}

.form-footer :deep(.ant-btn) {
    transition: all 0.3s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: 4px;
}

.form-footer :deep(.ant-btn:hover) {
    opacity: 0.8;
    transform: translateY(-1px);
}

.binding-content {
    padding: 0;
}

.binding-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #262626;
}

.binding-options {
    margin-bottom: 24px;
}

.binding-options :deep(.ant-checkbox-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}

.binding-options :deep(.ant-checkbox) {
    font-size: 14px;
    color: #595959;
}

.default-rule-option {
    margin-top: 16px;
}

.default-rule-option :deep(.ant-checkbox) {
    font-size: 14px;
    color: #595959;
}

/* 编码结构样式 */
.coding-structure-content {
    padding: 0 16px;
}

/* 高级配置样式 */
.advanced-config-content {
    padding: 0 16px;
}

.section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #262626;
}

.segments-list {
    margin-bottom: 16px;
}

.segment-item {
    margin-bottom: 12px;
}

.segment-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.segment-actions {
    display: flex;
    gap: 8px;
}

/* 条件规则样式 */
.conditions-list {
    margin-bottom: 16px;
}

.condition-item {
    margin-bottom: 12px;
}

.condition-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.condition-logic {
    margin-right: 12px;
}

/* 删除按钮样式 */
.condition-row :deep(.ant-btn-danger) {
    background-color: #ff4d4f;
    color: #fff;
    border-color: #ff4d4f;
}

.condition-row :deep(.ant-btn-danger:hover) {
    background-color: #ff7875;
    border-color: #ff7875;
}

/* 全局配置样式 */
.global-config-row {
    display: flex;
    gap: 24px;
    align-items: center;
}

/* 流水号配置样式 */
.serial-config-row {
    display: flex;
    gap: 24px;
    align-items: center;
}

.config-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.config-label {
    font-size: 14px;
    color: #595959;
    white-space: nowrap;
}

/* 并发与校验样式 */
.concurrency-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.preview-box {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 4px;
    padding: 16px;
}

.preview-code {
    font-family: 'Courier New', monospace;
    font-size: 16px;
    font-weight: 600;
    color: #1890ff;
    margin-bottom: 8px;
}

.preview-description {
    font-size: 14px;
    color: #595959;
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
    
    .steps-wrapper {
        padding: 0;
    }
    
    .form-wrapper {
        padding: 0;
    }
    
    .global-config-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
    
    .serial-config-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
    
    .segment-row {
        flex-wrap: wrap;
    }
    
    .segment-actions {
        margin-top: 8px;
        width: 100%;
        justify-content: flex-start;
    }
    
    .condition-row {
        flex-wrap: wrap;
    }
    
    .condition-logic {
        margin-top: 8px;
        margin-right: 0;
    }
}

@media (max-width: 768px) {
    .rule-page {
        padding: 12px;
    }
    
    .form-footer {
        flex-direction: column;
    }
    
    .form-footer :deep(.ant-btn) {
        width: 100%;
    }
}

@media (max-width: 576px) {
    .rule-page {
        padding: 12px;
    }
}
</style>
