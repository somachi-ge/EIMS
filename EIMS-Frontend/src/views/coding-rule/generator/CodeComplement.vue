<template>
    <AppLayout>
        <a-config-provider :locale="zhCN">
            <div class="code-complement-container">
                <div class="rule-page">
                    <!-- 页面标题 -->
                    <div class="page-header">
                        <h2 class="page-title">编码补号</h2>
                    </div>
                    
                    <!-- 编码补号表单卡片 -->
                    <a-card class="rule-card" :loading="loading">
                        <a-tabs v-model:activeKey="activeTab">
                            <!-- 手动补号 -->
                            <a-tab-pane key="manual" tab="手动补号">
                                <a-form :model="manualForm" layout="vertical">
                                    <a-form-item label="选择编码规则" required>
                                        <a-select v-model:value="manualForm.ruleId" placeholder="请选择编码规则">
                                            <a-select-option
                                                v-for="rule in rules"
                                                :key="rule.dbId"
                                                :value="rule.dbId"
                                            >
                                                {{ rule.ruleCode }} - {{ rule.ruleName }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    
                                    <a-form-item label="补号编码" required>
                                        <a-input
                                            v-model:value="manualForm.complementCode"
                                            placeholder="请输入需要补录的编码（需符合当前规则格式）"
                                        />
                                    </a-form-item>
                                    
                                    <div class="preview" v-if="manualForm.ruleId">
                                        规则格式校验：<span style="color:green">✅ 格式正确（固定段+车间产线+年月+流水号）</span>
                                        <div style="margin-top:6px">当前规则预览：{{ currentRulePreview }}</div>
                                    </div>
                                    
                                    <a-form-item label="补号原因">
                                        <a-select v-model:value="manualForm.reason" placeholder="请选择补号原因">
                                            <a-select-option value="漏生成">编码漏生成</a-select-option>
                                            <a-select-option value="误删除">编码误删除</a-select-option>
                                            <a-select-option value="系统异常">系统异常导致断号</a-select-option>
                                            <a-select-option value="其他">其他原因</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    
                                    <a-form-item label="备注（可选）">
                                        <a-input
                                            v-model:value="manualForm.remark"
                                            placeholder="请输入备注信息（如：补录2月23日漏生成编码）"
                                        />
                                    </a-form-item>
                                    
                                    <a-form-item>
                                        <a-button type="primary" @click="handleManualComplement">
                                            确认补号
                                        </a-button>
                                        <a-button @click="handleManualReset" style="margin-left: 8px">
                                            清空
                                        </a-button>
                                    </a-form-item>
                                </a-form>
                                
                                <!-- 近期补号记录 -->
                                <div class="section-title" style="margin-top:20px">近期补号记录</div>
                                <a-table
                                    :columns="complementHistoryColumns"
                                    :data-source="complementHistory"
                                    :pagination="false"
                                    row-key="code"
                                />
                            </a-tab-pane>
                            
                            <!-- 自动补号 -->
                            <a-tab-pane key="auto" tab="自动补号">
                                <a-form :model="autoForm" layout="vertical">
                                    <a-form-item label="选择编码规则" required>
                                        <a-select v-model:value="autoForm.ruleId" placeholder="请选择编码规则">
                                            <a-select-option
                                                v-for="rule in rules"
                                                :key="rule.dbId"
                                                :value="rule.dbId"
                                            >
                                                {{ rule.ruleCode }} - {{ rule.ruleName }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    
                                    <a-form-item label="补号范围" required>
                                        <div style="display:flex;gap:12px">
                                            <a-input
                                                v-model:value="autoForm.startCode"
                                                placeholder="起始编码"
                                                style="flex:1"
                                            />
                                            <a-input
                                                v-model:value="autoForm.endCode"
                                                placeholder="结束编码"
                                                style="flex:1"
                                            />
                                        </div>
                                    </a-form-item>
                                    
                                    <a-form-item label="补号设置">
                                        <div style="display:flex;flex-wrap:wrap;gap:12px">
                                            <a-checkbox v-model:checked="autoForm.autoDetect">自动检测断号并补录</a-checkbox>
                                            <a-checkbox v-model:checked="autoForm.updateStartNumber">补号后同步更新流水号起始值</a-checkbox>
                                        </div>
                                    </a-form-item>
                                    
                                    <a-form-item label="补号原因">
                                        <a-select v-model:value="autoForm.reason" placeholder="请选择补号原因">
                                            <a-select-option value="系统批量生成异常">系统批量生成异常</a-select-option>
                                            <a-select-option value="批量删除后需补录">批量删除后需补录</a-select-option>
                                            <a-select-option value="其他批量补号场景">其他批量补号场景</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    
                                    <a-form-item>
                                        <a-button type="primary" @click="handleAutoComplement">
                                            开始自动补号
                                        </a-button>
                                    </a-form-item>
                                </a-form>
                            </a-tab-pane>
                            
                            <!-- 断号查询 -->
                            <a-tab-pane key="void" tab="断号查询">
                                <a-form :model="voidForm" layout="vertical">
                                    <a-form-item label="选择编码规则" required>
                                        <a-select v-model:value="voidForm.ruleId" placeholder="请选择编码规则">
                                            <a-select-option
                                                v-for="rule in rules"
                                                :key="rule.dbId"
                                                :value="rule.dbId"
                                            >
                                                {{ rule.ruleCode }} - {{ rule.ruleName }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    
                                    <a-form-item label="查询日期范围">
                                        <div style="display:flex;gap:12px">
                                            <a-date-picker
                                                v-model:value="voidForm.startDate"
                                                format="YYYY-MM-DD"
                                                style="flex:1"
                                            />
                                            <a-date-picker
                                                v-model:value="voidForm.endDate"
                                                format="YYYY-MM-DD"
                                                style="flex:1"
                                            />
                                        </div>
                                    </a-form-item>
                                    
                                    <a-form-item>
                                        <a-button type="primary" @click="handleQueryVoid">
                                            查询断号
                                        </a-button>
                                    </a-form-item>
                                </a-form>
                                
                                <!-- 查询结果 -->
                                <div class="section-title" style="margin-top:20px">查询结果（共{{ voidCodes.length }}条断号）</div>
                                <div class="void-list" v-if="voidCodes.length > 0">
                                    <div class="void-item" v-for="(item, index) in voidCodes" :key="index">
                                        <span class="code">{{ item.code }}</span>
                                        <span>断号时间：{{ item.voidTime }}</span>
                                        <a-button type="primary" size="small" @click="handleSingleVoidComplement(item)" style="margin-left:auto">
                                            立即补号
                                        </a-button>
                                    </div>
                                </div>
                                
                                <a-form-item v-if="voidCodes.length > 0">
                                    <a-button @click="handleBatchVoidComplement">
                                        批量补号选中断号
                                    </a-button>
                                </a-form-item>
                            </a-tab-pane>
                        </a-tabs>
                    </a-card>
                </div>
            </div>
        </a-config-provider>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

// 类型定义
interface CodingRule {
    dbId: number;
    ruleCode: string;
    ruleName: string;
    ruleType: 'equipment' | 'product' | 'material' | 'asset' | 'other';
    rulePattern: string;
    startNumber: number;
    numberLength: number;
    status: 'active' | 'inactive';
    description: string;
    generatedCount: number;
    creator: string;
    createdAt: string;
    updatedAt: string;
}

interface ComplementHistory {
    code: string;
    ruleName: string;
    operator: string;
    complementTime: string;
    reason: string;
}

interface VoidCode {
    code: string;
    voidTime: string;
}

// 状态管理
const loading = ref(false);
const rules = ref<CodingRule[]>([]);
const activeTab = ref('manual');
const complementHistory = ref<ComplementHistory[]>([]);
const voidCodes = ref<VoidCode[]>([]);

// 手动补号表单数据
const manualForm = ref({
    ruleId: null,
    complementCode: '',
    reason: '',
    remark: ''
});

// 自动补号表单数据
const autoForm = ref({
    ruleId: null,
    startCode: '',
    endCode: '',
    autoDetect: true,
    updateStartNumber: false,
    reason: ''
});

// 断号查询表单数据
const voidForm = ref({
    ruleId: null,
    startDate: null,
    endDate: null
});

// 补号历史表格列定义
const complementHistoryColumns = [
    { title: '补号编码', dataIndex: 'code', key: 'code' },
    { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
    { title: '补号人', dataIndex: 'operator', key: 'operator' },
    { title: '补号时间', dataIndex: 'complementTime', key: 'complementTime' },
    { title: '补号原因', dataIndex: 'reason', key: 'reason' }
];

// 当前规则预览
const currentRulePreview = computed(() => {
    if (!manualForm.value.ruleId) return '';
    const rule = rules.value.find(r => r.dbId === manualForm.value.ruleId);
    if (!rule) return '';
    
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const serialNumber = String(rule.generatedCount).padStart(rule.numberLength, '0');
    
    return rule.rulePattern
        .replace('{YYYY}', year)
        .replace('{YY}', year.substring(2))
        .replace('{MM}', month)
        .replace('{DD}', day)
        .replace('{NNNN}', serialNumber)
        .replace('{DEPT}', 'CN01')
        .replace('{TYPE}', rule.ruleType.toUpperCase());
});

// 生成模拟规则数据
const generateMockRules = (): CodingRule[] => {
    const initialRules: CodingRule[] = [
        {
            dbId: 1,
            ruleCode: 'RULE001',
            ruleName: '设备编码规则-生产车间',
            ruleType: 'equipment',
            rulePattern: 'EQ-{DEPT}-{YY}{MM}-{NNNN}',
            startNumber: 1,
            numberLength: 4,
            status: 'active',
            description: '生产车间设备编码规则，用于生产车间所有设备的唯一编码标识',
            generatedCount: 46,
            creator: 'admin',
            createdAt: '2026-02-01 09:00:00',
            updatedAt: '2026-02-10 15:30:00'
        },
        {
            dbId: 2,
            ruleCode: 'PR-RULE-001',
            ruleName: '产品编码规则',
            ruleType: 'product',
            rulePattern: 'PR-{DEPT}-{YYYY}{MM}-{NNNN}',
            startNumber: 1000,
            numberLength: 4,
            status: 'active',
            description: '产品出厂编码规则',
            generatedCount: 3256,
            creator: '管理员',
            createdAt: '2026-01-20 10:00:00',
            updatedAt: '2026-03-22 16:45:00'
        },
        {
            dbId: 3,
            ruleCode: 'WO-RULE-001',
            ruleName: '工单编码规则-装配线',
            ruleType: 'other',
            rulePattern: 'WO-{DEPT}-{YY}{MM}-{NNNN}',
            startNumber: 1,
            numberLength: 4,
            status: 'active',
            description: '装配线工单编码规则',
            generatedCount: 12,
            creator: 'admin',
            createdAt: '2026-02-15 09:00:00',
            updatedAt: '2026-02-20 14:30:00'
        },
        {
            dbId: 4,
            ruleCode: 'MAT-RULE-001',
            ruleName: '物料编码规则-成品',
            ruleType: 'material',
            rulePattern: 'MAT-{DEPT}-{YY}{MM}-{NNNN}',
            startNumber: 1000,
            numberLength: 4,
            status: 'active',
            description: '成品物料编码规则',
            generatedCount: 500,
            creator: '管理员',
            createdAt: '2026-01-30 10:00:00',
            updatedAt: '2026-02-25 16:45:00'
        }
    ];
    return initialRules;
};

// 生成模拟补号历史数据
const generateMockComplementHistory = (): ComplementHistory[] => {
    return [
        {
            code: 'EQ-CN01-2602-0044',
            ruleName: '设备编码规则-生产车间',
            operator: 'admin',
            complementTime: '2026-02-22 15:30:00',
            reason: '编码漏生成'
        },
        {
            code: 'WO-CN02-2602-0012',
            ruleName: '工单编码规则-装配线',
            operator: 'admin',
            complementTime: '2026-02-21 10:15:00',
            reason: '系统异常导致断号'
        }
    ];
};

// 生成模拟断号数据
const generateMockVoidCodes = (): VoidCode[] => {
    return [
        {
            code: 'EQ-CN01-2602-0042',
            voidTime: '2026-02-20 11:00:00'
        },
        {
            code: 'EQ-CN01-2602-0045',
            voidTime: '2026-02-21 09:30:00'
        },
        {
            code: 'EQ-CN01-2602-0047',
            voidTime: '2026-02-22 14:15:00'
        }
    ];
};

// 获取规则列表
const fetchRules = async () => {
    try {
        loading.value = true;
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 生成模拟数据
        rules.value = generateMockRules();
        complementHistory.value = generateMockComplementHistory();
    } catch (error) {
        message.error('获取规则列表失败');
        console.error('Error fetching rules:', error);
        rules.value = [];
    } finally {
        loading.value = false;
    }
};

// 手动补号
const handleManualComplement = async () => {
    if (!manualForm.value.ruleId) {
        message.warning('请选择编码规则');
        return;
    }
    
    if (!manualForm.value.complementCode) {
        message.warning('请输入补号编码');
        return;
    }
    
    try {
        loading.value = true;
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));
        
        message.success('补号成功，已记录日志并同步至编码库');
        
        // 清空表单
        handleManualReset();
        
        // 更新补号历史
        const rule = rules.value.find(r => r.dbId === manualForm.value.ruleId);
        if (rule) {
            complementHistory.value.unshift({
                code: manualForm.value.complementCode,
                ruleName: rule.ruleName,
                operator: 'admin',
                complementTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
                reason: manualForm.value.reason || '其他原因'
            });
        }
    } catch (error) {
        message.error('补号失败');
        console.error('Error complementing code:', error);
    } finally {
        loading.value = false;
    }
};

// 重置手动补号表单
const handleManualReset = () => {
    manualForm.value = {
        ruleId: null,
        complementCode: '',
        reason: '',
        remark: ''
    };
};

// 自动补号
const handleAutoComplement = async () => {
    if (!autoForm.value.ruleId) {
        message.warning('请选择编码规则');
        return;
    }
    
    if (!autoForm.value.startCode || !autoForm.value.endCode) {
        message.warning('请输入补号范围');
        return;
    }
    
    try {
        loading.value = true;
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 800));
        
        message.success('自动补号任务已提交，将补录范围内所有断号，完成后通知您');
        
        // 清空表单
        autoForm.value = {
            ruleId: null,
            startCode: '',
            endCode: '',
            autoDetect: true,
            updateStartNumber: false,
            reason: ''
        };
    } catch (error) {
        message.error('自动补号失败');
        console.error('Error auto complementing:', error);
    } finally {
        loading.value = false;
    }
};

// 查询断号
const handleQueryVoid = async () => {
    if (!voidForm.value.ruleId) {
        message.warning('请选择编码规则');
        return;
    }
    
    try {
        loading.value = true;
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 生成模拟数据
        voidCodes.value = generateMockVoidCodes();
    } catch (error) {
        message.error('查询断号失败');
        console.error('Error querying void codes:', error);
        voidCodes.value = [];
    } finally {
        loading.value = false;
    }
};

// 单个断号补号
const handleSingleVoidComplement = async (item: VoidCode) => {
    try {
        loading.value = true;
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 300));
        
        message.success('补号成功');
        
        // 从断号列表中移除
        voidCodes.value = voidCodes.value.filter(code => code.code !== item.code);
    } catch (error) {
        message.error('补号失败');
        console.error('Error complementing void code:', error);
    } finally {
        loading.value = false;
    }
};

// 批量补号
const handleBatchVoidComplement = async () => {
    if (voidCodes.value.length === 0) {
        message.warning('没有可批量补号的断号');
        return;
    }
    
    try {
        loading.value = true;
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));
        
        message.success(`批量补号成功，共补录${voidCodes.value.length}条断号编码`);
        
        // 清空断号列表
        voidCodes.value = [];
    } catch (error) {
        message.error('批量补号失败');
        console.error('Error batch complementing:', error);
    } finally {
        loading.value = false;
    }
};

// 组件挂载时获取规则列表
onMounted(() => {
    fetchRules();
    voidCodes.value = generateMockVoidCodes();
});
</script>

<style scoped>
.code-complement-container {
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
}

.page-title {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
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

.section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #111;
}

.preview {
    padding: 12px;
    background: #f9fafb;
    border-radius: 6px;
    margin: 10px 0 16px;
}

.void-list {
    margin-top: 16px;
}

.void-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border: 1px solid #fee2e2;
    border-radius: 4px;
    margin-bottom: 8px;
}

.void-item .code {
    color: #ef4444;
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
    
    .void-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .void-item a-button {
        align-self: flex-end;
    }
}

@media (max-width: 576px) {
    .rule-page {
        padding: 12px;
    }
}
</style>