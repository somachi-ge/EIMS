<template>
    <AppLayout>
        <a-config-provider :locale="zhCN">
            <div class="rule-detail-container">
                <div class="rule-page">
                    <!-- 页面标题 -->
                    <div class="page-header">
                        <h2 class="page-title">规则详情</h2>
                    </div>
                    
                    <!-- 规则详情卡片 -->
                    <a-card class="rule-card" :loading="loading">
                        <div v-if="currentRule" class="rule-detail-content">
                            <!-- 基本信息 -->
                            <div class="detail-section">
                                <!-- 操作按钮 -->
                                <div class="detail-actions">
                                    <a-button type="primary" @click="handleEdit">编辑规则</a-button>
                                    <a-button @click="handleViewHistory">查看历史版本</a-button>
                                    <a-button @click="handleBack"><a-icon :icon="ArrowLeftOutlined" /> 返回列表</a-button>
                                </div>
                                
                                <a-descriptions :column="1" bordered>
                                    <a-descriptions-item label="规则编号">{{ currentRule.ruleCode }}</a-descriptions-item>
                                    <a-descriptions-item label="规则名称">{{ currentRule.ruleName }}</a-descriptions-item>
                                    <a-descriptions-item label="编码类型">
                                        <a-tag :color="getRuleTypeColor(currentRule.ruleType)" :bordered="false">
                                            {{ getRuleTypeText(currentRule.ruleType) }}
                                        </a-tag>
                                    </a-descriptions-item>
                                    <a-descriptions-item label="规则格式">{{ currentRule.rulePattern }}</a-descriptions-item>
                                    <a-descriptions-item label="格式示例">{{ getFormatExample(currentRule) }}</a-descriptions-item>
                                    <a-descriptions-item label="流水号长度">{{ currentRule.numberLength }}位</a-descriptions-item>
                                    <a-descriptions-item label="当前流水号">{{ String(currentRule.startNumber + currentRule.generatedCount).padStart(currentRule.numberLength, '0') }}</a-descriptions-item>
                                    <a-descriptions-item label="生效时间">{{ currentRule.createdAt.split(' ')[0] }}</a-descriptions-item>
                                    <a-descriptions-item label="失效时间">{{ getExpiryDate(currentRule) }}</a-descriptions-item>
                                    <a-descriptions-item label="创建人">{{ currentRule.creator }}</a-descriptions-item>
                                    <a-descriptions-item label="创建时间">{{ currentRule.createdAt }}</a-descriptions-item>
                                    <a-descriptions-item label="最后修改人">{{ currentRule.creator }}</a-descriptions-item>
                                    <a-descriptions-item label="最后修改时间">{{ currentRule.updatedAt }}</a-descriptions-item>
                                    <a-descriptions-item label="规则状态">
                                        <a-tag :color="currentRule.status === 'active' ? 'green' : 'orange'" :bordered="false">
                                            {{ currentRule.status === 'active' ? '有效' : '无效' }}
                                        </a-tag>
                                    </a-descriptions-item>
                                    <a-descriptions-item label="规则描述">{{ currentRule.description || '无' }}</a-descriptions-item>
                                </a-descriptions>
                            </div>
                        </div>
                        
                        <!-- 规则不存在 -->
                        <div v-else class="rule-not-found">
                            <a-result
                                status="404"
                                title="规则不存在"
                                sub-title="未找到指定的编码规则，请检查规则ID是否正确"
                            />
                        </div>
                    </a-card>
                </div>
            </div>
        </a-config-provider>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';

// 路由
const router = useRouter();
const route = useRoute();

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

// 状态管理
const loading = ref(false);
const currentRule = ref<CodingRule | null>(null);

// 规则类型颜色映射
const getRuleTypeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
        equipment: 'blue',
        product: 'green',
        material: 'orange',
        asset: 'purple',
        other: 'default'
    };
    return colorMap[type] || 'default';
};

// 规则类型文本映射
const getRuleTypeText = (type: string): string => {
    const textMap: Record<string, string> = {
        equipment: '设备编码',
        product: '产品编码',
        material: '物料编码',
        asset: '资产编码',
        other: '其他'
    };
    return textMap[type] || type;
};

// 生成格式示例
const getFormatExample = (rule: CodingRule): string => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const serialNumber = String(rule.startNumber).padStart(rule.numberLength, '0');
    
    // 替换规则模式中的变量
    const replacements = {
        '{YYYY}': year,
        '{MM}': month,
        '{DD}': day,
        '{NNNN}': serialNumber,
        '{DEPT}': 'CN01',
        '{TYPE}': rule.ruleType.toUpperCase()
    };
    
    return Object.entries(replacements).reduce((pattern, [key, value]) => 
        pattern.replace(new RegExp(key, 'g'), value), 
        rule.rulePattern
    );
};

// 获取失效时间
const getExpiryDate = (rule: CodingRule): string => {
    // 简单计算，当前日期加一年
    const createdDate = new Date(rule.createdAt);
    const expiryDate = new Date(createdDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    return expiryDate.toISOString().split('T')[0];
};

// 生成模拟数据
const generateMockRules = (): CodingRule[] => {
    // 预定义的规则数据
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
            ruleCode: 'MT-RULE-001',
            ruleName: '原材料编码规则',
            ruleType: 'material',
            rulePattern: 'MT-{YYYY}{MM}{DD}-{NNNN}',
            startNumber: 1,
            numberLength: 5,
            status: 'active',
            description: '原材料入库编码规则',
            generatedCount: 892,
            creator: '操作员',
            createdAt: '2026-02-01 08:30:00',
            updatedAt: '2026-03-18 11:20:00'
        },
        {
            dbId: 4,
            ruleCode: 'AS-RULE-001',
            ruleName: '固定资产编码规则',
            ruleType: 'asset',
            rulePattern: 'AS-{YYYY}-{NNNN}',
            startNumber: 1,
            numberLength: 6,
            status: 'inactive',
            description: '公司固定资产编码规则',
            generatedCount: 156,
            creator: '管理员',
            createdAt: '2026-02-10 14:00:00',
            updatedAt: '2026-03-15 09:10:00'
        },
        {
            dbId: 5,
            ruleCode: 'EQ-RULE-002',
            ruleName: '检测设备编码规则',
            ruleType: 'equipment',
            rulePattern: 'EQ-TEST-{YYYY}-{NNNN}',
            startNumber: 1,
            numberLength: 4,
            status: 'active',
            description: '质量检测设备编码',
            generatedCount: 78,
            creator: '操作员',
            createdAt: '2026-02-15 11:30:00',
            updatedAt: '2026-03-21 13:40:00'
        },
        {
            dbId: 6,
            ruleCode: 'OT-RULE-001',
            ruleName: '通用编码规则',
            ruleType: 'other',
            rulePattern: 'GN-{YYYY}{MM}-{NNNN}',
            startNumber: 1,
            numberLength: 4,
            status: 'active',
            description: '通用物品编码规则',
            generatedCount: 234,
            creator: '管理员',
            createdAt: '2026-02-20 16:00:00',
            updatedAt: '2026-03-19 10:30:00'
        }
    ];

    // 生成额外的模拟数据
    const ruleTypes = ['equipment', 'product', 'material', 'asset', 'other'] as const;
    const typeNames = { equipment: '设备', product: '产品', material: '物料', asset: '资产', other: '其他' };
    const codePrefixes = { equipment: 'EQ', product: 'PR', material: 'MT', asset: 'AS', other: 'OT' };
    const creators = ['管理员', '操作员', '技术人员', '主管'];
    const patterns = ['{PREFIX}-{YYYY}-{NNNN}', '{PREFIX}-{DEPT}-{YYYY}{MM}-{NNNN}', '{PREFIX}-{YYYY}{MM}{DD}-{NNNN}', '{PREFIX}-{TYPE}-{YYYY}-{NNNN}', '{PREFIX}-{YYYY}-{MM}-{NNNN}'];
    
    // 生成94条额外数据（总共100条）
    for (let i = 7; i <= 100; i++) {
        const typeIndex = (i - 7) % ruleTypes.length;
        const ruleType = ruleTypes[typeIndex];
        const typeName = typeNames[ruleType];
        const codePrefix = codePrefixes[ruleType];
        const sequence = Math.floor((i - 7) / ruleTypes.length) + 1;
        const codeSuffix = String(sequence).padStart(3, '0');
        
        // 随机生成状态、创建者和生成数量
        const status = Math.random() > 0.2 ? 'active' as const : 'inactive' as const;
        const creator = creators[Math.floor(Math.random() * creators.length)];
        const generatedCount = Math.floor(Math.random() * 5000);
        
        // 生成日期
        const startDate = new Date(2026, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1);
        const createdAt = startDate.toISOString().replace('T', ' ').slice(0, 19);
        const updateDate = new Date(startDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        const updatedAt = updateDate.toISOString().replace('T', ' ').slice(0, 19);
        
        // 生成规则模式
        const pattern = patterns[(i - 7) % patterns.length].replace('{PREFIX}', codePrefix);
        
        initialRules.push({
            dbId: i,
            ruleCode: `${codePrefix}-RULE-${codeSuffix}`,
            ruleName: `${typeName}编码规则${sequence}`,
            ruleType,
            rulePattern: pattern,
            startNumber: Math.floor(Math.random() * 100) + 1,
            numberLength: Math.floor(Math.random() * 6) + 3,
            status,
            description: `${typeName}编码管理规则，用于${typeName}的统一编码`,
            generatedCount,
            creator,
            createdAt,
            updatedAt
        });
    }

    return initialRules;
};

// 模拟规则数据
const mockRules: CodingRule[] = generateMockRules();

// 获取规则详情
const fetchRuleDetail = async () => {
    try {
        loading.value = true;
        const ruleId = Number(route.params.id);
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 从模拟数据中查找规则
        const rule = mockRules.find(r => r.dbId === ruleId);
        if (rule) {
            currentRule.value = rule;
        } else {
            currentRule.value = null;
            message.warning('未找到指定规则');
        }
    } catch (error) {
        message.error('获取规则详情失败');
        console.error('Error fetching rule detail:', error);
        currentRule.value = null;
    } finally {
        loading.value = false;
    }
};

// 组件挂载时获取规则详情
onMounted(() => {
    fetchRuleDetail();
});

// 返回列表页面
const handleBack = () => {
    router.push('/coding-rule/rule-management/list');
};

// 跳转到编辑页面
const handleEdit = () => {
    if (currentRule.value) {
        router.push(`/coding-rule/rule-management/edit/${currentRule.value.dbId}`);
    }
};

// 查看历史版本
const handleViewHistory = () => {
    if (currentRule.value) {
        // 跳转到历史版本页面，这里暂时使用规则ID作为参数
        router.push(`/coding-rule/rule-management/history/${currentRule.value.dbId}`);
    }
};
</script>

<style scoped>
.rule-detail-container {
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
    margin: 0;
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

.rule-detail-content {
    padding: 8px 0;
}

.detail-section {
    margin-bottom: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 12px;
}

.rule-not-found {
    padding: 40px 0;
}

.detail-actions {
    margin-bottom: 16px;
    display: flex;
    gap: 12px;
}

/* 自定义描述列表样式 */
:deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
    width: 20%;
    font-weight: 500;
    background-color: #fafafa;
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
    width: 80%;
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .rule-page {
        padding: 20px;
    }
    
    :deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
        width: 25%;
    }
    
    :deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
        width: 75%;
    }
}

@media (max-width: 992px) {
    .rule-page {
        padding: 16px;
    }
    
    :deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
        width: 30%;
    }
    
    :deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
        width: 70%;
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
    
    .detail-actions {
        flex-direction: column;
    }
    
    .detail-actions :deep(.ant-btn) {
        width: 100%;
    }
    
    :deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
        width: 40%;
    }
    
    :deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
        width: 60%;
    }
}

@media (max-width: 576px) {
    .rule-page {
        padding: 12px;
    }
    
    :deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
        width: 100%;
        text-align: left;
    }
    
    :deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
        width: 100%;
    }
}
</style>