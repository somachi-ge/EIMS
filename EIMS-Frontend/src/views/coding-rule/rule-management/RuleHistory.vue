<template>
    <AppLayout>
        <a-config-provider :locale="zhCN">
            <div class="rule-history-container">
                <div class="rule-page">
                    <!-- 页面标题 -->
                    <div class="page-header">
                        <h2 class="page-title">规则历史版本（{{ currentRule?.ruleCode || '' }} - {{ currentRule?.ruleName || '' }}）</h2>
                    </div>
                    
                    <!-- 历史版本列表卡片 -->
                    <a-card class="rule-card" :loading="loading">
                        <!-- 操作按钮 -->
                        <div class="history-actions">
                            <a-button @click="handleBack"><a-icon :icon="ArrowLeftOutlined" /> 返回规则详情</a-button>
                        </div>
                        
                        <!-- 历史版本表格 -->
                        <a-table
                            :columns="columns"
                            :data-source="versionHistory"
                            :pagination="false"
                            row-key="versionId"
                            class="history-table"
                        >
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'status'">
                                    <a-tag :color="record.isCurrent ? 'green' : 'default'" :bordered="false">
                                        {{ record.isCurrent ? '当前版本' : '历史版本' }}
                                    </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                    <a-space>
                                        <a-button type="link" size="small" @click="handleViewDetail(record)" :disabled="record.isCurrent">
                                            查看详情
                                        </a-button>
                                    </a-space>
                                </template>
                            </template>
                        </a-table>
                        
                        <!-- 版本详情模态框 -->
                        <a-modal
                            v-model:open="detailModalVisible"
                            title="版本详情"
                            width="800px"
                        >
                            <div v-if="selectedVersion" class="modal-content">
                                <a-descriptions :column="1" bordered>
                                    <a-descriptions-item label="规则编号">{{ selectedVersion.ruleCode }}</a-descriptions-item>
                                    <a-descriptions-item label="规则名称">{{ selectedVersion.ruleName }}</a-descriptions-item>
                                    <a-descriptions-item label="编码类型">
                                        <a-tag :color="getRuleTypeColor(selectedVersion.ruleType)" :bordered="false">
                                            {{ getRuleTypeText(selectedVersion.ruleType) }}
                                        </a-tag>
                                    </a-descriptions-item>
                                    <a-descriptions-item label="规则格式">{{ selectedVersion.rulePattern }}</a-descriptions-item>
                                    <a-descriptions-item label="流水号长度">{{ selectedVersion.numberLength }}位</a-descriptions-item>
                                    <a-descriptions-item label="起始流水号">{{ selectedVersion.startNumber }}</a-descriptions-item>
                                    <a-descriptions-item label="规则状态">
                                        <a-tag :color="selectedVersion.status === 'active' ? 'green' : 'orange'" :bordered="false">
                                            {{ selectedVersion.status === 'active' ? '有效' : '无效' }}
                                        </a-tag>
                                    </a-descriptions-item>
                                    <a-descriptions-item label="规则描述">{{ selectedVersion.description || '无' }}</a-descriptions-item>
                                    <a-descriptions-item label="修改人">{{ selectedVersion.modifier }}</a-descriptions-item>
                                    <a-descriptions-item label="修改时间">{{ selectedVersion.modifiedAt }}</a-descriptions-item>
                                    <a-descriptions-item label="版本号">{{ selectedVersion.version }}</a-descriptions-item>
                                    <a-descriptions-item label="更新内容">{{ selectedVersion.changes.join('；') }}</a-descriptions-item>
                                </a-descriptions>
                            </div>
                            <template #footer>
                                <div class="modal-footer">
                                    <a-button type="primary" @click="handleCloseModal">关闭</a-button>
                                </div>
                            </template>
                        </a-modal>
                        
                        <!-- 版本回滚 -->
                        <div class="rollback-section">
                            <div class="section-title">版本回滚</div>
                            <a-form :model="rollbackForm" layout="vertical">
                                <a-form-item label="选择要回滚的版本" required>
                                    <a-select v-model:value="rollbackForm.targetVersion" placeholder="请选择版本">
                                        <a-select-option
                                            v-for="version in rollbackAvailableVersions"
                                            :key="version.versionId"
                                            :value="version.versionId"
                                        >
                                            {{ version.version }} - {{ version.modifiedAt.split(' ')[0] }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item label="回滚原因" required>
                                    <a-textarea
                                        v-model:value="rollbackForm.reason"
                                        :rows="3"
                                        placeholder="请输入回滚原因"
                                    ></a-textarea>
                                </a-form-item>
                                <a-form-item>
                                    <a-button type="primary" @click="handleRollback">提交回滚申请</a-button>
                                </a-form-item>
                            </a-form>
                        </div>
                    </a-card>
                </div>
            </div>
        </a-config-provider>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
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

interface RuleVersion {
    versionId: number;
    ruleId: number;
    ruleCode: string;
    ruleName: string;
    ruleType: 'equipment' | 'product' | 'material' | 'asset' | 'other';
    rulePattern: string;
    startNumber: number;
    numberLength: number;
    status: 'active' | 'inactive';
    description: string;
    modifier: string;
    modifiedAt: string;
    version: string;
    changes: string[];
    isCurrent?: boolean;
}

interface RollbackForm {
    targetVersion: number | null;
    reason: string;
}

// 状态管理
const loading = ref(false);
const currentRule = ref<CodingRule | null>(null);
const versionHistory = ref<RuleVersion[]>([]);
const selectedVersion = ref<RuleVersion | null>(null);
const detailModalVisible = ref(false);
const rollbackForm = ref<RollbackForm>({
    targetVersion: null,
    reason: ''
});

// 表格列定义
const columns = [
    { title: '版本号', dataIndex: 'version', key: 'version' },
    { title: '更新时间', dataIndex: 'modifiedAt', key: 'modifiedAt' },
    { title: '更新人', dataIndex: 'modifier', key: 'modifier' },
    { title: '更新内容', dataIndex: 'changes', key: 'changes', customRender: ({ text }: { text: string[] }) => text.join('；') },
    { title: '状态', key: 'status' },
    { title: '操作', key: 'action' }
];

// 计算可回滚的版本（排除当前版本）
const rollbackAvailableVersions = computed(() => {
    return versionHistory.value.filter(v => !v.isCurrent);
});

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

// 生成模拟规则数据（与RuleDetail.vue保持一致）
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
        }
    ];
    return initialRules;
};

// 生成模拟历史版本数据
const generateMockVersions = (ruleId: number): RuleVersion[] => {
    const versions: RuleVersion[] = [
        {
            versionId: 3,
            ruleId,
            ruleCode: 'RULE001',
            ruleName: '设备编码规则-生产车间',
            ruleType: 'equipment',
            rulePattern: 'EQ-{DEPT}-{YY}{MM}-{NNNN}',
            startNumber: 1,
            numberLength: 4,
            status: 'active',
            description: '生产车间设备编码规则，用于生产车间所有设备的唯一编码标识',
            modifier: 'admin',
            modifiedAt: '2026-02-10 15:30:00',
            version: 'V1.2',
            changes: ['修改流水号长度为4位', '新增车间段可选值'],
            isCurrent: true
        },
        {
            versionId: 2,
            ruleId,
            ruleCode: 'RULE001',
            ruleName: '设备编码规则-生产车间',
            ruleType: 'equipment',
            rulePattern: 'EQ-{DEPT}-{YY}{MM}-{NNN}',
            startNumber: 1,
            numberLength: 3,
            status: 'active',
            description: '生产车间设备编码规则，用于生产车间所有设备的唯一编码标识，包含车间段可选值',
            modifier: 'admin',
            modifiedAt: '2026-02-05 10:00:00',
            version: 'V1.1',
            changes: ['修改规则描述', '补充使用说明'],
            isCurrent: false
        },
        {
            versionId: 1,
            ruleId,
            ruleCode: 'RULE001',
            ruleName: '设备编码规则-生产车间',
            ruleType: 'equipment',
            rulePattern: 'EQ-{DEPT}-{YY}{MM}-{NNN}',
            startNumber: 1,
            numberLength: 3,
            status: 'active',
            description: '生产车间设备编码规则',
            modifier: 'admin',
            modifiedAt: '2026-02-01 09:00:00',
            version: 'V1.0',
            changes: ['初始创建规则', '流水号长度3位'],
            isCurrent: false
        }
    ];
    return versions;
};

// 获取规则详情和历史版本数据
const fetchData = async () => {
    try {
        loading.value = true;
        const ruleId = Number(route.params.id);
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 生成模拟数据
        const mockRules = generateMockRules();
        const rule = mockRules.find(r => r.dbId === ruleId);
        
        if (rule) {
            currentRule.value = rule;
            versionHistory.value = generateMockVersions(ruleId);
        } else {
            currentRule.value = null;
            versionHistory.value = [];
            message.warning('未找到指定规则');
        }
    } catch (error) {
        message.error('获取数据失败');
        console.error('Error fetching data:', error);
        currentRule.value = null;
        versionHistory.value = [];
    } finally {
        loading.value = false;
    }
};

// 查看版本详情
const handleViewDetail = (version: RuleVersion) => {
    selectedVersion.value = version;
    detailModalVisible.value = true;
};

// 关闭版本详情模态框
const handleCloseModal = () => {
    detailModalVisible.value = false;
};

// 提交回滚申请
const handleRollback = () => {
    if (!rollbackForm.value.targetVersion) {
        message.warning('请选择要回滚的版本');
        return;
    }
    if (!rollbackForm.value.reason.trim()) {
        message.warning('请输入回滚原因');
        return;
    }
    
    Modal.confirm({
        title: '确认提交回滚申请',
        content: '版本回滚申请已提交，需管理员审批！',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
            message.success('回滚申请已提交');
            // 重置表单
            rollbackForm.value = {
                targetVersion: null,
                reason: ''
            };
        }
    });
};

// 组件挂载时获取数据
onMounted(() => {
    fetchData();
});

// 返回规则详情页面
const handleBack = () => {
    const ruleId = route.params.id;
    router.push(`/coding-rule/rule-management/detail/${ruleId}`);
};
</script>

<style scoped>
.rule-history-container {
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

.rule-card {
    border-radius: 8px;
    box-shadow: none;
    border: none;
    transition: all 0.3s ease;
}

.rule-card:hover {
    box-shadow: none;
}

.history-actions {
    margin-bottom: 24px;
}

.history-table {
    margin-bottom: 32px;
}

.rollback-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 20px;
}

.modal-content {
    padding: 8px 0;
    max-height: 60vh;
    overflow-y: auto;
}

/* 自定义表格样式 */
:deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    font-weight: 500;
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
    
    .history-actions {
        margin-bottom: 16px;
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