<template>
    <AppLayout>
        <a-config-provider :locale="zhCN">
            <div class="rule-list-container">
                <div class="rule-page">
                <!-- 规则管理卡片 -->
                <a-card class="rule-card">
                    <div class="card-header">
                        <div class="header-right"></div>
                    </div>

                    <!-- 搜索过滤区域 -->
                    <div class="rule-filter" style="overflow-x: auto;">
                        <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
                            <div style="flex: 1; min-width: 120px;">
                                <a-input v-model:value="filterForm.ruleCode" placeholder="请输入规则编码" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
                            </div>
                            <div style="flex: 1.5; min-width: 150px;">
                                <a-input v-model:value="filterForm.ruleName" placeholder="请输入规则名称" @keyup.enter="handleSearch" allow-clear style="width: 100%;" />
                            </div>
                            <div style="flex: 1; min-width: 120px;">
                                <a-select v-model:value="filterForm.ruleType" placeholder="全部类型" allow-clear style="width: 100%;">
                                    <a-select-option value="">全部类型</a-select-option>
                                    <a-select-option value="equipment">设备编码</a-select-option>
                                    <a-select-option value="product">产品编码</a-select-option>
                                    <a-select-option value="material">物料编码</a-select-option>
                                    <a-select-option value="asset">资产编码</a-select-option>
                                    <a-select-option value="other">其他</a-select-option>
                                </a-select>
                            </div>
                            <div style="flex: 1; min-width: 100px;">
                                <a-select v-model:value="filterForm.status" placeholder="全部状态" allow-clear style="width: 100%;">
                                    <a-select-option value="">全部状态</a-select-option>
                                    <a-select-option value="active">启用</a-select-option>
                                    <a-select-option value="inactive">停用</a-select-option>
                                </a-select>
                            </div>
                            <div style="flex: 0.4; min-width: 70px;">
                                <a-button type="primary" @click="handleSearch" style="width: 100%;">搜索</a-button>
                            </div>
                            <div style="flex: 0.4; min-width: 70px;">
                                <a-button @click="handleReset" style="width: 100%;">重置</a-button>
                            </div>
                        </div>
                    </div>

                    <!-- 操作按钮区域 -->
                    <div class="rule-actions">
                        <a-button type="primary" @click="handleAdd">新增规则</a-button>
                        <a-button type="primary" style="margin-left: 8px;" @click="handleBatchExport">导出规则</a-button>
                        <a-button type="primary" style="margin-left: 8px;" @click="handleBatchImport">导入规则</a-button>
                        <a-button type="primary" style="margin-left: 8px;" @click="handleTemplateDownload">模板下载</a-button>
                        <a-button type="primary" style="margin-left: 8px; background-color: #52c41a;" @click="handleBatchEnable">批量启用</a-button>
                        <a-button type="primary" style="margin-left: 8px; background-color: #fa8c16;" @click="handleBatchDisable">批量停用</a-button>
                        <a-button type="primary" style="margin-left: 8px; background-color: #ff4d4f;" @click="handleBatchDelete">批量删除</a-button>
                    </div>

                    <!-- 提示信息 -->
                    <a-alert
                        v-if="showAlert"
                        type="warning"
                        show-icon
                        :message="'操作提示'"
                        :description="'禁用规则后，关联业务无法生成编码；删除规则前，请确认无关联编码生成记录'"
                        style="margin-bottom: 16px;"
                        closable
                        @close="handleAlertClose"
                    />

                    <!-- 规则列表 -->
                    <div class="rule-table-container">
                        <a-table
                            :columns="columns"
                            :data-source="paginatedRules"
                            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectChange }"
                            :pagination="false"
                            size="small"
                            class="rule-table"
                            row-key="dbId"
                            :scroll="{ x: 1100 }"
                            :loading="loading"
                        >
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'ruleType'">
                                    <a-tag :color="getRuleTypeColor(record.ruleType)" :bordered="false">
                                        {{ getRuleTypeText(record.ruleType) }}
                                    </a-tag>
                                </template>
                                <template v-else-if="column.key === 'status'">
                                    <a-switch
                                        :checked="record.status === 'active'"
                                        :checked-children="'启用'"
                                        :un-checked-children="'停用'"
                                        @change="() => toggleRuleStatus(record)"
                                    />
                                </template>
                                <template v-else-if="column.key === 'rulePattern'">
                                    <a-tooltip :title="record.rulePattern">
                                        <span class="pattern-text">{{ record.rulePattern }}</span>
                                    </a-tooltip>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                    <div style="display: flex; gap: 8px;">
                                        <a-button type="link" size="small" @click="handleView(record)">详情</a-button>
                                        <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                                        <a-button type="link" size="small" @click="handlePreview(record)">预览</a-button>
                                        <a-button type="link" size="small" danger @click="handleDelete(record.dbId)">删除</a-button>
                                    </div>
                                </template>
                            </template>
                        </a-table>

                        <div class="rule-pagination-container">
                            <a-pagination
                                v-model:current="pagination.current"
                                v-model:pageSize="pagination.pageSize"
                                :total="filteredRules.length"
                                :showSizeChanger="true"
                                :pageSizeOptions="PAGE_SIZE_OPTIONS"
                                :showTotal="showTotal"
                                showQuickJumper
                                size="default"
                            />
                        </div>
                    </div>
                </a-card>



                <!-- 查看规则详情模态框 -->
                <a-modal
                    v-model:open="viewModalVisible"
                    title="规则详情"
                    width="600px"
                    :ok-text="'关闭'"
                    :cancel-text="''"
                    :cancel-button-props="{ style: { display: 'none' } }"
                    @ok="closeViewModal"
                    @cancel="closeViewModal"
                    class="rule-view-modal"
                >
                    <a-descriptions :column="2" bordered v-if="currentRule">
                        <a-descriptions-item label="规则编码" :span="2">{{ currentRule.ruleCode }}</a-descriptions-item>
                        <a-descriptions-item label="规则名称" :span="2">{{ currentRule.ruleName }}</a-descriptions-item>
                        <a-descriptions-item label="规则类型">
                            <a-tag :color="getRuleTypeColor(currentRule.ruleType)" :bordered="false">
                                {{ getRuleTypeText(currentRule.ruleType) }}
                            </a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="状态">
                            <a-tag :color="currentRule.status === 'active' ? 'green' : 'orange'" :bordered="false">
                                {{ currentRule.status === 'active' ? '启用' : '停用' }}
                            </a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="规则格式" :span="2">{{ currentRule.rulePattern }}</a-descriptions-item>
                        <a-descriptions-item label="起始流水号">{{ currentRule.startNumber }}</a-descriptions-item>
                        <a-descriptions-item label="流水号长度">{{ currentRule.numberLength }}</a-descriptions-item>
                        <a-descriptions-item label="已生成数量">{{ currentRule.generatedCount }}</a-descriptions-item>
                        <a-descriptions-item label="创建人">{{ currentRule.creator }}</a-descriptions-item>
                        <a-descriptions-item label="创建时间" :span="2">{{ currentRule.createdAt }}</a-descriptions-item>
                        <a-descriptions-item label="更新时间" :span="2">{{ currentRule.updatedAt }}</a-descriptions-item>
                        <a-descriptions-item label="规则描述" :span="2">{{ currentRule.description || '无' }}</a-descriptions-item>
                    </a-descriptions>
                </a-modal>

                <!-- 预览规则编码模态窗 -->
                <a-modal
                    v-model:open="previewModalVisible"
                    title="规则预览"
                    width="500px"
                    :ok-text="'关闭'"
                    :cancel-text="''"
                    :cancel-button-props="{ style: { display: 'none' } }"
                    @ok="closePreviewModal"
                    @cancel="closePreviewModal"
                    class="rule-preview-modal"
                >
                    <div class="preview-container" v-if="currentPreviewRule">
                        <div class="preview-item">
                            <span class="preview-label">规则名称：</span>
                            <span class="preview-value">{{ currentPreviewRule.ruleName }}</span>
                        </div>
                        <div class="preview-item">
                            <span class="preview-label">规则格式：</span>
                            <span class="preview-value">{{ currentPreviewRule.rulePattern }}</span>
                        </div>
                        <div class="preview-item">
                            <span class="preview-label">预览编码：</span>
                            <span class="preview-code">{{ previewCode }}</span>
                        </div>
                        <div class="preview-hint">
                            <p>预览编码基于当前日期和规则设置生成</p>
                            <p>实际生成的编码可能会根据系统时间和流水号自动递增</p>
                        </div>
                    </div>
                </a-modal>
            </div>
        </div>
    </a-config-provider>
</AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, shallowRef } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import AppLayout from '../layout/AppLayout.vue';

import zhCN from 'ant-design-vue/es/locale/zh_CN';

// 常量定义
const PAGE_SIZE_OPTIONS = ['10', '30', '50'] as const;

// 路由
const router = useRouter();

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

interface FilterForm {
    ruleCode: string;
    ruleName: string;
    ruleType: string;
    status: string;
}

interface Pagination {
    current: number;
    pageSize: number;
}

// 状态管理
const loading = ref(false);
const selectedRowKeys = ref<(string | number)[]>([]);
const viewModalVisible = ref(false);
const previewModalVisible = ref(false);
const currentRule = ref<CodingRule | null>(null);
const currentPreviewRule = ref<CodingRule | null>(null);
const previewCode = ref('');
const showAlert = ref(true);

// 表单数据
const filterForm = reactive<FilterForm>({
    ruleCode: '',
    ruleName: '',
    ruleType: '',
    status: ''
});

const pagination = reactive<Pagination>({
    current: 1,
    pageSize: 10
});

// 表格列定义
const columns = shallowRef([
    {
        title: '规则编码',
        dataIndex: 'ruleCode',
        key: 'ruleCode',
        width: 140
    },
    {
        title: '规则名称',
        dataIndex: 'ruleName',
        key: 'ruleName',
        width: 180
    },
    {
        title: '规则类型',
        dataIndex: 'ruleType',
        key: 'ruleType',
        width: 100
    },
    {
        title: '规则格式',
        dataIndex: 'rulePattern',
        key: 'rulePattern',
        width: 180,
        ellipsis: true
    },
    {
        title: '已生成',
        dataIndex: 'generatedCount',
        key: 'generatedCount',
        width: 80
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 90
    },
    {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
        width: 100
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150
    },
    {
        title: '操作',
        key: 'action',
        width: 210,
        fixed: 'right'
    }
]);

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



// 生成模拟数据
const generateMockRules = (): CodingRule[] => {
    // 预定义的规则数据
    const initialRules: CodingRule[] = [
        {
            dbId: 1,
            ruleCode: 'EQ-RULE-001',
            ruleName: '生产设备编码规则',
            ruleType: 'equipment',
            rulePattern: 'EQ-{YYYY}-{NNNN}',
            startNumber: 1,
            numberLength: 4,
            status: 'active',
            description: '用于生产设备统一编码管理',
            generatedCount: 568,
            creator: '管理员',
            createdAt: '2026-01-15 09:30:00',
            updatedAt: '2026-03-20 14:20:00'
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
const originalRules = ref<CodingRule[]>([...mockRules]);

// 计算属性：过滤后的规则列表
const filteredRules = computed(() => {
    let result = [...originalRules.value];

    // 按规则编码过滤
    if (filterForm.ruleCode) {
        const keyword = filterForm.ruleCode.toLowerCase();
        result = result.filter(rule => rule.ruleCode.toLowerCase().includes(keyword));
    }

    // 按规则名称过滤
    if (filterForm.ruleName) {
        const keyword = filterForm.ruleName.toLowerCase();
        result = result.filter(rule => rule.ruleName.toLowerCase().includes(keyword));
    }

    // 按规则类型过滤
    if (filterForm.ruleType) {
        result = result.filter(rule => rule.ruleType === filterForm.ruleType);
    }

    // 按状态过滤
    if (filterForm.status) {
        result = result.filter(rule => rule.status === filterForm.status);
    }

    return result;
});

// 计算属性：分页后的规则列表
const paginatedRules = computed(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredRules.value.slice(start, end);
});

// 显示总数
const showTotal = (total: number) => `共 ${total} 条记录`;

// 获取规则列表
const fetchRules = async () => {
    try {
        loading.value = true;
        await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
        message.error('获取规则列表失败');
        console.error('Error fetching rules:', error);
    } finally {
        loading.value = false;
    }
};

// 组件挂载时获取规则列表
onMounted(() => {
    fetchRules();
});

// 搜索按钮点击事件
const handleSearch = async () => {
    try {
        loading.value = true;
        pagination.current = 1;
        message.success(`搜索完成，共找到 ${filteredRules.value.length} 条规则记录`);
    } catch (error) {
        message.error('搜索失败');
        console.error('Error searching rules:', error);
    } finally {
        loading.value = false;
    }
};

// 重置按钮点击事件
const handleReset = async () => {
    Object.assign(filterForm, {
        ruleCode: '',
        ruleName: '',
        ruleType: '',
        status: ''
    });
    pagination.current = 1;
    message.success('表单已重置，规则列表已恢复');
};

// 选择行变化事件
const handleSelectChange = (keys: (string | number)[]) => {
    selectedRowKeys.value = keys;
};

// 跳转到新增规则页面
const handleAdd = () => {
    router.push('/coding-rule/rule-management/add');
};

// 跳转到编辑规则页面
const handleEdit = (record: CodingRule) => {
    router.push(`/coding-rule/rule-management/edit/${record.dbId}`);
};

// 查看规则详情
const handleView = (record: CodingRule) => {
    currentRule.value = record;
    viewModalVisible.value = true;
};

// 预览规则编码
const handlePreview = (record: CodingRule) => {
    // 生成预览编码
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const serialNumber = String(record.startNumber).padStart(record.numberLength, '0');
    
    // 替换规则模式中的变量
    const replacements = {
        '{YYYY}': year,
        '{MM}': month,
        '{DD}': day,
        '{NNNN}': serialNumber,
        '{DEPT}': 'DEPT',
        '{TYPE}': record.ruleType.toUpperCase()
    };
    
    previewCode.value = Object.entries(replacements).reduce((pattern, [key, value]) => 
        pattern.replace(new RegExp(key, 'g'), value), 
        record.rulePattern
    );
    
    currentPreviewRule.value = record;
    previewModalVisible.value = true;
};

// 关闭预览模态窗
const closePreviewModal = () => {
    previewModalVisible.value = false;
    currentPreviewRule.value = null;
    previewCode.value = '';
};

// 关闭查看模态框
const closeViewModal = () => {
    viewModalVisible.value = false;
    currentRule.value = null;
};

// 删除规则
const handleDelete = async (id: number) => {
    try {
        loading.value = true;
        originalRules.value = originalRules.value.filter(rule => rule.dbId !== id);
        message.success('删除规则成功');
    } catch (error) {
        message.error('删除规则失败');
        console.error('Error deleting rule:', error);
    } finally {
        loading.value = false;
    }
};

// 批量删除规则
const handleBatchDelete = async () => {
    if (selectedRowKeys.value.length === 0) {
        message.warning('请先选择要删除的规则');
        return;
    }

    try {
        loading.value = true;
        const deleteCount = selectedRowKeys.value.length;
        originalRules.value = originalRules.value.filter(rule => !selectedRowKeys.value.includes(rule.dbId));
        selectedRowKeys.value = [];
        message.success(`批量删除 ${deleteCount} 个规则成功`);
    } catch (error) {
        message.error('批量删除规则失败');
        console.error('Error batch deleting rules:', error);
    } finally {
        loading.value = false;
    }
};

// 批量启用规则
const handleBatchEnable = async () => {
    if (selectedRowKeys.value.length === 0) {
        message.warning('请先选择要启用的规则');
        return;
    }

    try {
        loading.value = true;
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        originalRules.value = originalRules.value.map(rule => {
            if (selectedRowKeys.value.includes(rule.dbId)) {
                return { ...rule, status: 'active' as const, updatedAt: now };
            }
            return rule;
        });
        selectedRowKeys.value = [];
        message.success('批量启用规则成功');
    } catch (error) {
        message.error('批量启用规则失败');
        console.error('Error batch enabling rules:', error);
    } finally {
        loading.value = false;
    }
};

// 批量停用规则
const handleBatchDisable = async () => {
    if (selectedRowKeys.value.length === 0) {
        message.warning('请先选择要停用的规则');
        return;
    }

    try {
        loading.value = true;
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        originalRules.value = originalRules.value.map(rule => {
            if (selectedRowKeys.value.includes(rule.dbId)) {
                return { ...rule, status: 'inactive' as const, updatedAt: now };
            }
            return rule;
        });
        selectedRowKeys.value = [];
        message.success('批量停用规则成功');
    } catch (error) {
        message.error('批量停用规则失败');
        console.error('Error batch disabling rules:', error);
    } finally {
        loading.value = false;
    }
};

// 切换规则状态
const toggleRuleStatus = async (record: CodingRule) => {
    try {
        loading.value = true;
        const newStatus = record.status === 'active' ? 'inactive' : 'active';
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

        const index = originalRules.value.findIndex(rule => rule.dbId === record.dbId);
        if (index !== -1) {
            originalRules.value[index].status = newStatus;
            originalRules.value[index].updatedAt = now;
        }

        message.success(`规则状态已切换为${newStatus === 'active' ? '启用' : '停用'}`);
    } catch (error) {
        message.error('切换规则状态失败');
        console.error('Error toggling rule status:', error);
    } finally {
        loading.value = false;
    }
};

// 批量导入规则
const handleBatchImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = async (e) => {
        const target = e.target as HTMLInputElement;
        if (!target.files?.length) return;

        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
            const result = event.target?.result as string;
            if (!result) return;

            try {
                loading.value = true;
                const lines = result.split('\n').filter(line => line.trim());
                if (lines.length < 2) {
                    message.error('CSV文件格式错误，至少需要包含表头和一行数据');
                    return;
                }

                const dataLines = lines.slice(1);
                const importedRules: CodingRule[] = [];
                const errors: string[] = [];
                const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
                const validTypes = ['equipment', 'product', 'material', 'asset', 'other'];

                dataLines.forEach((line, index) => {
                    const fields = line.split(',');
                    if (fields.length < 6) {
                        errors.push(`第${index + 2}行：数据字段不足`);
                        return;
                    }

                    const [ruleCode, ruleName, ruleType, rulePattern, startNumber, numberLength] = fields;

                    if (!ruleCode || !ruleName || !ruleType || !rulePattern) {
                        errors.push(`第${index + 2}行：存在空字段`);
                        return;
                    }

                    if (!validTypes.includes(ruleType)) {
                        errors.push(`第${index + 2}行：规则类型错误`);
                        return;
                    }

                    importedRules.push({
                        dbId: originalRules.value.length + 1 + importedRules.length,
                        ruleCode,
                        ruleName,
                        ruleType: ruleType as CodingRule['ruleType'],
                        rulePattern,
                        startNumber: parseInt(startNumber) || 1,
                        numberLength: parseInt(numberLength) || 4,
                        status: 'active',
                        description: '',
                        generatedCount: 0,
                        creator: '当前用户',
                        createdAt: now,
                        updatedAt: now
                    });
                });

                if (errors.length) {
                    message.error(`导入失败，发现${errors.length}个错误：\n${errors.join('\n')}`);
                    return;
                }

                if (importedRules.length) {
                    originalRules.value.push(...importedRules);
                    message.success(`批量导入成功，共导入${importedRules.length}条规则`);
                } else {
                    message.warning('没有可导入的有效数据');
                }
            } catch (error) {
                message.error('导入失败：' + (error as Error).message);
            } finally {
                loading.value = false;
            }
        };

        reader.readAsText(file, 'utf-8');
    };

    input.click();
};

// 下载导入模板
const handleTemplateDownload = () => {
    const headers = ['规则编码', '规则名称', '规则类型', '规则格式', '起始流水号', '流水号长度'];
    const csvContent = [
        headers.join(','),
        ['EQ-RULE-003,新设备编码规则,equipment,EQ-{YYYY}-{NNNN},1,4'].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `编码规则导入模板_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('模板下载成功');
};

// 批量导出规则
const handleBatchExport = () => {
    const headers = ['规则编码', '规则名称', '规则类型', '规则格式', '起始流水号', '流水号长度', '状态', '已生成数量', '创建人', '创建时间'];
    const exportData = filteredRules.value.map(rule => [
        rule.ruleCode,
        rule.ruleName,
        getRuleTypeText(rule.ruleType),
        rule.rulePattern,
        rule.startNumber,
        rule.numberLength,
        rule.status === 'active' ? '启用' : '停用',
        rule.generatedCount,
        rule.creator,
        rule.createdAt
    ]);

    const csvContent = [
        headers.join(','),
        ...exportData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `编码规则列表_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(`导出成功，共导出 ${exportData.length} 条规则记录`);
};

// 关闭操作提示
const handleAlertClose = () => {
    showAlert.value = false;
};
</script>

<style scoped>
.rule-list-container {
    width: 100%;
    padding: 1.5%;
}

.rule-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    transition: all 0.3s ease;
}

.rule-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.rule-filter {
    margin-bottom: 20px;
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 4px;
}

.rule-actions {
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.rule-actions :deep(.ant-btn) {
    transition: all 0.3s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: 4px;
}

.rule-actions :deep(.ant-btn:hover) {
    opacity: 0.8;
    transform: translateY(-1px);
}

.rule-table {
    border-radius: 4px;
}

.rule-table :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    font-weight: 600;
    font-size: 14px;
}

.rule-table :deep(.ant-table-tbody > tr > td) {
    font-size: 13px;
    padding: 10px;
}

.pattern-text {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}

.rule-pagination-container {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
}

.rule-detail-modal :deep(.ant-modal-content) {
    border-radius: 8px;
}

.form-hint {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 4px;
}

.preview-box {
    padding: 12px 16px;
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 4px;
}

.preview-label {
    color: #52c41a;
    font-weight: 500;
}

.preview-value {
    color: #262626;
    font-family: 'Courier New', monospace;
    font-weight: 600;
    margin-left: 8px;
}

.rule-view-modal :deep(.ant-descriptions-item-label) {
    font-weight: 500;
    background-color: #fafafa;
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .rule-page {
        padding: 20px;
    }

    .rule-filter {
        padding: 12px;
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

    .rule-filter {
        padding: 12px;
    }

    .rule-actions {
        flex-direction: column;
    }

    .rule-actions :deep(.ant-btn) {
        width: 100%;
        margin-left: 0 !important;
    }
}

@media (max-width: 576px) {
    .rule-page {
        padding: 12px;
    }

    .rule-pagination-container {
        justify-content: center;
    }

    .rule-pagination-container :deep(.ant-pagination) {
        flex-wrap: wrap;
        justify-content: center;
    }

    .rule-detail-modal {
        width: 90% !important;
    }
}

/* 预览模态窗样式 */
.rule-preview-modal {
    :deep(.ant-modal-content) {
        border-radius: 8px;
    }
}

.preview-container {
    padding: 16px 0;
}

.preview-item {
    display: flex;
    margin-bottom: 16px;
    align-items: flex-start;
}

.preview-label {
    width: 80px;
    font-weight: 500;
    color: #262626;
    flex-shrink: 0;
}

.preview-value {
    flex: 1;
    color: #595959;
    word-break: break-all;
}

.preview-code {
    flex: 1;
    color: #1890ff;
    font-family: 'Courier New', monospace;
    font-weight: 600;
    padding: 8px 12px;
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 4px;
    word-break: break-all;
}

.preview-hint {
    margin-top: 20px;
    padding: 12px 16px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-size: 14px;
    color: #8c8c8c;
}

.preview-hint p {
    margin: 4px 0;
}
</style>
