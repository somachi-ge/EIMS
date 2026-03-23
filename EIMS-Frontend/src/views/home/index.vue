<template>
  <MainLayout>
    <div class="home-page">
      <div class="home-quadrant-cards">
        <a-card v-for="card in dashboardCards" :key="card.key" :class="['home-quadrant-card', `home-${card.key}-card`]">
          <div class="home-card-header">
            <h3 class="home-card-title">{{ card.title }}</h3>
            <div class="home-header-right">
              <div class="home-date-tabs">
                <a-tag 
                  v-for="option in DATE_OPTIONS" 
                  :key="option.value"
                  :color="card.color" 
                  :class="['home-date-tag', card.dateType === option.value ? 'active' : '']"
                  @click="switchDateType(card.key, option.value)"
                >
                  {{ option.label }}
                </a-tag>
              </div>
              <component :is="card.icon" :class="['home-card-icon', `home-card-icon-${card.color}`]" />
            </div>
          </div>
          <div class="home-card-content">
            <div class="home-card-value">{{ formatValue(card.animatedValue, card.isCurrency) }}</div>
            <div class="home-card-stats">
              <div class="home-stat-item">
                <span :class="['home-stat-trend', card.data[card.dateType].rate.includes('-') ? 'down' : 'up']">
                  {{ card.data[card.dateType].rate.includes('-') ? '↓' : '↑' }}{{ card.data[card.dateType].rate }}
                </span>
                <span class="home-stat-period">{{ getCompareText(card.dateType) }}</span>
              </div>
              <div class="home-stat-item home-stat-item-right">
                <div class="home-stat-label">{{ card.targetLabel }}</div>
                <div class="home-stat-value">{{ card.data[card.dateType].target }}</div>
              </div>
            </div>
          </div>
        </a-card>
      </div>
      
      <div class="home-analysis-cards">
        <a-card class="home-analysis-card home-sales-analysis-card">
          <div class="home-card-header">
            <h3 class="home-card-title">销售分析</h3>
            <div class="home-header-right">
              <div class="home-analysis-tabs">
                <a-tag 
                  v-for="option in SALES_ANALYSIS_OPTIONS" 
                  :key="option.value"
                  color="blue" 
                  :class="['home-analysis-tag', salesAnalysisType === option.value ? 'active' : '']"
                  @click="switchSalesAnalysis(option.value)"
                >
                  {{ option.label }}
                </a-tag>
              </div>
            </div>
          </div>
          <div class="home-card-content">
            <div id="activityChart" style="height: 300px;"></div>
          </div>
        </a-card>

        <a-card class="home-analysis-card home-fund-distribution-card">
          <div class="home-card-header">
            <h3 class="home-card-title">资金分布</h3>
            <div class="home-header-right">
              <div class="home-analysis-tabs">
                <a-tag 
                  v-for="option in FUND_DISTRIBUTION_OPTIONS" 
                  :key="option.value"
                  color="blue" 
                  :class="['home-analysis-tag', fundDistributionType === option.value ? 'active' : '']"
                  @click="switchFundDistribution(option.value)"
                >
                  {{ option.label }}
                </a-tag>
              </div>
            </div>
          </div>
          <div class="home-card-content">
            <div id="systemChart" style="height: 200px;"></div>
            <div class="home-fund-stats">
              <div class="home-fund-stat-item">
                <div class="home-fund-stat-label">{{ currentFundStats.label }}</div>
                <div class="home-fund-stat-value home-fund-stat-value-blue">{{ currentFundStats.displayValue }}</div>
              </div>
              <div class="home-fund-stat-item">
                <div class="home-fund-stat-label">{{ currentFundStats.periodLabel }}</div>
                <div class="home-fund-stat-value home-fund-stat-value-blue">{{ currentFundStats.displayPeriodValue }}</div>
              </div>
            </div>
          </div>
        </a-card>
      </div>
      
      <div class="home-transactions-card">
        <a-card class="home-transaction-card">
          <div class="home-card-header">
            <h3 class="home-card-title">交易记录</h3>
            <div class="home-header-right">
              <a-dropdown trigger="click">
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-for="option in VIEW_RANGE_OPTIONS" :key="option.value">
                      <span @click="handleViewRange(option.value)">{{ option.label }}</span>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button size="small" class="home-view-range-button">
                  {{ currentViewRangeText }} <DownOutlined />
                </a-button>
              </a-dropdown>
            </div>
          </div>
          <div class="home-card-content">
            <a-spin :spinning="loading">
              <a-table 
                :columns="transactionColumns" 
                :data-source="paginatedTransactions" 
                :pagination="paginationConfig"
                size="small"
                class="home-transaction-table"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'status'">
                    <a-tag :color="STATUS_COLORS[record.status as keyof typeof STATUS_COLORS]" :bordered="false">
                      {{ STATUS_TEXT[record.status as keyof typeof STATUS_TEXT] }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'type'">
                    <a-tag :color="TYPE_COLORS[record.type as keyof typeof TYPE_COLORS]" :bordered="false">
                      {{ TYPE_TEXT[record.type as keyof typeof TYPE_TEXT] }}
                    </a-tag>
                  </template>
                </template>
                <template #action="{ record }">
                  <a-tag color="blue" :bordered="false" @click="openDetailModal(record as Transaction)" style="cursor: pointer;">详情</a-tag>
                </template>
              </a-table>
            </a-spin>
          </div>
        </a-card>
      </div>

      <a-modal
        v-model:visible="detailModalVisible"
        title="交易记录详情"
        width="700px"
        :ok-text="'关闭'"
        :cancel-button-props="{ style: { display: 'none' } }"
        @ok="closeDetailModal"
        @cancel="closeDetailModal"
        class="home-transaction-detail-modal"
        :body-style="{ maxHeight: '60vh', overflow: 'auto' }"
        :scrollable="true"
      >
        <div v-if="currentTransaction" class="home-transaction-detail">
          <div class="home-detail-header">
            <div class="home-detail-id">{{ currentTransaction.id }}</div>
            <div class="home-detail-status">
              <a-tag :color="STATUS_COLORS[currentTransaction.status as keyof typeof STATUS_COLORS]" :bordered="false" class="home-status-tag">
                {{ STATUS_TEXT[currentTransaction.status as keyof typeof STATUS_TEXT] }}
              </a-tag>
            </div>
          </div>
          
          <div class="home-detail-content">
            <div class="home-detail-section">
              <h4 class="home-section-title">基本信息</h4>
              <div class="home-detail-grid">
                <div class="home-detail-item">
                  <div class="home-detail-label">交易类型：</div>
                  <div class="home-detail-value">
                    <a-tag :color="TYPE_COLORS[currentTransaction.type as keyof typeof TYPE_COLORS]" :bordered="false" class="home-type-tag">
                      {{ TYPE_TEXT[currentTransaction.type as keyof typeof TYPE_TEXT] }}
                    </a-tag>
                  </div>
                </div>
                <div class="home-detail-item">
                  <div class="home-detail-label">客户/供应商：</div>
                  <div class="home-detail-value">{{ currentTransaction.partner }}</div>
                </div>
                <div class="home-detail-item">
                  <div class="home-detail-label">交易描述：</div>
                  <div class="home-detail-value">{{ currentTransaction.description }}</div>
                </div>
                <div class="home-detail-item">
                  <div class="home-detail-label">金额：</div>
                  <div class="home-detail-value home-amount-value">¥{{ currentTransaction.amount.toLocaleString() }}</div>
                </div>
                <div class="home-detail-item">
                  <div class="home-detail-label">日期：</div>
                  <div class="home-detail-value">{{ currentTransaction.date }}</div>
                </div>
                <div class="home-detail-item">
                  <div class="home-detail-label">支付方式：</div>
                  <div class="home-detail-value">{{ currentTransaction.paymentMethod }}</div>
                </div>
              </div>
            </div>
            
            <div class="home-detail-section">
              <h4 class="home-section-title">管理信息</h4>
              <div class="home-detail-grid">
                <div class="home-detail-item">
                  <div class="home-detail-label">负责人：</div>
                  <div class="home-detail-value">{{ currentTransaction.manager }}</div>
                </div>
                <div class="home-detail-item">
                  <div class="home-detail-label">部门：</div>
                  <div class="home-detail-value">{{ currentTransaction.department }}</div>
                </div>
                <div class="home-detail-item">
                  <div class="home-detail-label">发票编号：</div>
                  <div class="home-detail-value">{{ currentTransaction.invoiceNumber }}</div>
                </div>
              </div>
            </div>
            
            <div class="home-detail-section">
              <h4 class="home-section-title">备注信息</h4>
              <div class="home-detail-notes">
                {{ currentTransaction.notes || '无备注信息' }}
              </div>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, shallowRef } from 'vue'
import { LineChartOutlined, ShoppingOutlined, InboxOutlined, DollarOutlined, DownOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import MainLayout from '../../components/layout/MainLayout.vue'

interface DateData {
  value: string
  rate: string
  target: string
}

interface DashboardCard {
  key: string
  title: string
  icon: any
  color: string
  dateType: 'today' | 'week' | 'month'
  data: Record<string, DateData>
  animatedValue: number
  isCurrency: boolean
  targetLabel: string
}

const DATE_OPTIONS = [
  { value: 'today' as const, label: '当天' },
  { value: 'week' as const, label: '本周' },
  { value: 'month' as const, label: '本月' }
]

const COMPARE_TEXT = {
  today: '较昨日',
  week: '较上周',
  month: '较上月'
} as const

const ANIMATION_DURATION = 500

const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
  let startTime: number | null = null
  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const value = start + (end - start) * progress
    callback(value)
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

const parseNumericValue = (value: string): number => {
  return parseInt(value.replace(/[^0-9]/g, ''), 10)
}

const salesDateType = ref<'today' | 'week' | 'month'>('today')
const purchaseDateType = ref<'today' | 'week' | 'month'>('today')
const inventoryDateType = ref<'today' | 'week' | 'month'>('today')
const profitDateType = ref<'today' | 'week' | 'month'>('today')

const salesAnimatedValue = ref(1258492)
const purchaseAnimatedValue = ref(876245)
const inventoryAnimatedValue = ref(24589)
const profitAnimatedValue = ref(382247)

const salesData = shallowRef({
  today: { value: '¥1,258,492', rate: '12.5%', target: '89%' },
  week: { value: '¥8,762,450', rate: '10.2%', target: '92%' },
  month: { value: '¥35,049,800', rate: '8.7%', target: '95%' }
})

const purchaseData = shallowRef({
  today: { value: '¥876,245', rate: '8.3%', target: '92%' },
  week: { value: '¥6,133,715', rate: '6.5%', target: '94%' },
  month: { value: '¥24,534,860', rate: '5.2%', target: '96%' }
})

const inventoryData = shallowRef({
  today: { value: '24,589', rate: '-3.2%', target: '68%' },
  week: { value: '25,342', rate: '-2.8%', target: '70%' },
  month: { value: '26,128', rate: '-2.1%', target: '72%' }
})

const profitData = shallowRef({
  today: { value: '¥382,247', rate: '15.8%', target: '30.4%' },
  week: { value: '¥2,675,729', rate: '14.3%', target: '31.2%' },
  month: { value: '¥10,704,950', rate: '12.9%', target: '32.0%' }
})

const dashboardCards = computed<DashboardCard[]>(() => [
  {
    key: 'sales',
    title: '总销售额',
    icon: LineChartOutlined,
    color: 'blue',
    dateType: salesDateType.value,
    data: salesData.value,
    animatedValue: salesAnimatedValue.value,
    isCurrency: true,
    targetLabel: '目标完成率'
  },
  {
    key: 'purchase',
    title: '采购总额',
    icon: ShoppingOutlined,
    color: 'orange',
    dateType: purchaseDateType.value,
    data: purchaseData.value,
    animatedValue: purchaseAnimatedValue.value,
    isCurrency: true,
    targetLabel: '成本控制率'
  },
  {
    key: 'inventory',
    title: '库存总量',
    icon: InboxOutlined,
    color: 'green',
    dateType: inventoryDateType.value,
    data: inventoryData.value,
    animatedValue: inventoryAnimatedValue.value,
    isCurrency: false,
    targetLabel: '周转率'
  },
  {
    key: 'profit',
    title: '毛利润',
    icon: DollarOutlined,
    color: 'red',
    dateType: profitDateType.value,
    data: profitData.value,
    animatedValue: profitAnimatedValue.value,
    isCurrency: true,
    targetLabel: '毛利率'
  }
])

const switchDateType = (cardKey: string, type: 'today' | 'week' | 'month') => {
  const dateTypeMap = {
    sales: salesDateType,
    purchase: purchaseDateType,
    inventory: inventoryDateType,
    profit: profitDateType
  }
  const animatedValueMap = {
    sales: salesAnimatedValue,
    purchase: purchaseAnimatedValue,
    inventory: inventoryAnimatedValue,
    profit: profitAnimatedValue
  }
  const dataMap = {
    sales: salesData,
    purchase: purchaseData,
    inventory: inventoryData,
    profit: profitData
  }

  const dateTypeRef = dateTypeMap[cardKey as keyof typeof dateTypeMap]
  const animatedValueRef = animatedValueMap[cardKey as keyof typeof animatedValueMap]
  const dataRef = dataMap[cardKey as keyof typeof dataMap]

  const oldValue = animatedValueRef.value
  dateTypeRef.value = type
  const newValue = parseNumericValue(dataRef.value[type].value)
  animateValue(oldValue, newValue, ANIMATION_DURATION, (value) => {
    animatedValueRef.value = value
  })
}

const getCompareText = (dateType: 'today' | 'week' | 'month'): string => {
  return COMPARE_TEXT[dateType]
}

const formatValue = (value: number, isCurrency: boolean = true): string => {
  const formatted = Math.round(value).toLocaleString()
  return isCurrency ? `¥${formatted}` : formatted
}

const updateDashboardAnimations = () => {
  const cards = [
    { data: salesData, dateType: salesDateType, animatedValue: salesAnimatedValue },
    { data: purchaseData, dateType: purchaseDateType, animatedValue: purchaseAnimatedValue },
    { data: inventoryData, dateType: inventoryDateType, animatedValue: inventoryAnimatedValue },
    { data: profitData, dateType: profitDateType, animatedValue: profitAnimatedValue }
  ]

  cards.forEach(({ data, dateType, animatedValue }) => {
    const targetValue = parseNumericValue(data.value[dateType.value].value)
    animatedValue.value = 0
    animateValue(0, targetValue, ANIMATION_DURATION, (value) => {
      animatedValue.value = value
    })
  })
}

const SALES_ANALYSIS_OPTIONS = [
  { value: 'sales' as const, label: '销售额' },
  { value: 'profit' as const, label: '利润' }
]

const FUND_DISTRIBUTION_OPTIONS = [
  { value: 'receivable' as const, label: '应收账款' },
  { value: 'payable' as const, label: '应付账款' }
]

const VIEW_RANGE_OPTIONS = [
  { value: 'month' as const, label: '本月度' },
  { value: 'quarter' as const, label: '本季度' },
  { value: 'year' as const, label: '本年度' }
]

const STATUS_COLORS = {
  completed: 'green',
  pending: 'orange',
  cancelled: 'red'
} as const

const STATUS_TEXT = {
  completed: '已完成',
  pending: '处理中',
  cancelled: '已取消'
} as const

const TYPE_COLORS = {
  sales: 'green',
  purchase: 'blue',
  transfer: 'orange',
  refund: 'red',
  expense: 'purple'
} as const

const TYPE_TEXT = {
  sales: '销售',
  purchase: '采购',
  transfer: '转账',
  refund: '退款',
  expense: '费用'
} as const

interface SalesAnalysisData {
  name: string
  data: Array<{ name: string; value: number }>
  color: string
}

interface FundStats {
  label: string
  value: string
  numericValue: number
  periodLabel: string
  periodValue: string
  numericPeriodValue: number
}

interface FundDistributionItem {
  name: string
  value: number
  color: string
}

interface FundDistributionData {
  name: string
  data: FundDistributionItem[]
}

interface Transaction {
  key: string
  id: string
  type: 'sales' | 'purchase' | 'transfer' | 'refund' | 'expense'
  partner: string
  description: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  manager: string
  department: string
  paymentMethod: string
  invoiceNumber: string
  notes: string
}

interface Pagination {
  current: number
  pageSize: number
  total: number
}

const salesAnalysisType = ref<'sales' | 'profit'>('sales')
let salesAnalysisChart: echarts.ECharts | null = null

const salesAnalysisData = shallowRef<Record<string, SalesAnalysisData>>({
  sales: {
    name: '销售额',
    data: [
      { name: '1月', value: 1258492 },
      { name: '2月', value: 1389245 },
      { name: '3月', value: 1567890 },
      { name: '4月', value: 1423567 },
      { name: '5月', value: 1689234 },
      { name: '6月', value: 1756432 }
    ],
    color: '#1890ff'
  },
  profit: {
    name: '利润',
    data: [
      { name: '1月', value: 382247 },
      { name: '2月', value: 425678 },
      { name: '3月', value: 478923 },
      { name: '4月', value: 435678 },
      { name: '5月', value: 512345 },
      { name: '6月', value: 538921 }
    ],
    color: '#52c41a'
  }
})

const switchSalesAnalysis = (type: 'sales' | 'profit') => {
  salesAnalysisType.value = type
  updateSalesAnalysisChart()
}

const initSalesAnalysisChart = () => {
  const chartDom = document.getElementById('activityChart')
  if (chartDom) {
    salesAnalysisChart = echarts.init(chartDom)
    updateSalesAnalysisChart()
  }
}

const updateSalesAnalysisChart = () => {
  if (!salesAnalysisChart) return
  
  const currentData = salesAnalysisData.value[salesAnalysisType.value]
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${currentData.name}: ¥${data.value.toLocaleString()}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: currentData.data.map(item => item.name),
      axisLabel: { fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => '¥' + (value / 10000) + '万',
        fontSize: 12
      }
    },
    series: [{
      name: currentData.name,
      type: 'bar',
      data: currentData.data.map(item => item.value),
      itemStyle: { color: currentData.color },
      barWidth: '60%'
    }]
  }
  
  salesAnalysisChart.setOption(option)
}

const fundDistributionType = ref<'receivable' | 'payable'>('receivable')
let fundDistributionChart: echarts.ECharts | null = null

const fundStatsData = shallowRef<Record<string, FundStats>>({
  receivable: {
    label: '总应收账款',
    value: '¥456,892',
    numericValue: 456892,
    periodLabel: '平均账期',
    periodValue: '32天',
    numericPeriodValue: 32
  },
  payable: {
    label: '总应付账款',
    value: '¥385,000',
    numericValue: 385000,
    periodLabel: '平均付款周期',
    periodValue: '28天',
    numericPeriodValue: 28
  }
})

const loading = ref(true)
const fundAmountAnimatedValue = ref(456892)
const fundPeriodAnimatedValue = ref(32)

const currentViewRange = ref<'month' | 'quarter' | 'year'>('month')

const currentViewRangeText = computed(() => {
  const option = VIEW_RANGE_OPTIONS.find(o => o.value === currentViewRange.value)
  return option?.label || '本月度'
})

const transactionColumns = [
  { title: '交易编号', dataIndex: 'id', key: 'id', width: 140 },
  { title: '交易类型', dataIndex: 'type', key: 'type', width: 90 },
  { title: '客户/供应商', dataIndex: 'partner', key: 'partner', width: 160 },
  { title: '交易描述', dataIndex: 'description', key: 'description', width: 180 },
  { 
    title: '金额', 
    dataIndex: 'amount', 
    key: 'amount', 
    width: 100,
    customRender: (value: number) => `¥${value.toLocaleString()}`
  },
  { title: '日期', dataIndex: 'date', key: 'date', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '负责人', dataIndex: 'manager', key: 'manager', width: 90 },
  { title: '部门', dataIndex: 'department', key: 'department', width: 90 },
  { title: '操作', key: 'action', width: 80, fixed: 'right', slots: { customRender: 'action' } }
]

const allTransactions = shallowRef<Transaction[]>([
  { key: '1', id: 'TRX-2026-001', type: 'sales', partner: '上海科技有限公司', description: '产品销售', amount: 125849, date: '2026-02-08', status: 'completed', manager: '张三', department: '销售部', paymentMethod: '银行转账', invoiceNumber: 'INV-2026-001', notes: '常规销售订单' },
  { key: '2', id: 'TRX-2026-002', type: 'purchase', partner: '北京供应商集团', description: '原材料采购', amount: 87624, date: '2026-02-07', status: 'completed', manager: '李四', department: '采购部', paymentMethod: '电汇', invoiceNumber: 'INV-2026-002', notes: '月度采购计划' },
  { key: '3', id: 'TRX-2026-003', type: 'sales', partner: '广州贸易公司', description: '服务费用', amount: 156789, date: '2026-02-06', status: 'pending', manager: '王五', department: '销售部', paymentMethod: '支票', invoiceNumber: 'INV-2026-003', notes: '技术咨询服务' },
  { key: '4', id: 'TRX-2026-004', type: 'purchase', partner: '深圳制造企业', description: '设备更新升级', amount: 65432, date: '2026-02-05', status: 'completed', manager: '赵六', department: '采购部', paymentMethod: '银行转账', invoiceNumber: 'INV-2026-004', notes: '生产设备更新' },
  { key: '5', id: 'TRX-2026-005', type: 'sales', partner: '杭州科技公司', description: '软件授权', amount: 98765, date: '2026-02-04', status: 'cancelled', manager: '孙七', department: '销售部', paymentMethod: '在线支付', invoiceNumber: 'INV-2026-005', notes: '企业版软件授权' },
  { key: '6', id: 'TRX-2026-006', type: 'sales', partner: '成都电子科技有限公司', description: '硬件销售', amount: 234567, date: '2026-02-03', status: 'completed', manager: '周八', department: '销售部', paymentMethod: '银行转账', invoiceNumber: 'INV-2026-006', notes: '批量采购订单' },
  { key: '7', id: 'TRX-2026-007', type: 'purchase', partner: '武汉原材料供应商', description: '原材料采购', amount: 145678, date: '2026-02-02', status: 'pending', manager: '吴九', department: '采购部', paymentMethod: '电汇', invoiceNumber: 'INV-2026-007', notes: '季度采购计划' },
  { key: '8', id: 'TRX-2026-008', type: 'sales', partner: '西安科技公司', description: '技术服务', amount: 89012, date: '2026-02-01', status: 'completed', manager: '郑十', department: '销售部', paymentMethod: '在线支付', invoiceNumber: 'INV-2026-008', notes: '技术支持服务' },
  { key: '9', id: 'TRX-2026-009', type: 'purchase', partner: '南京设备供应商', description: '办公设备采购', amount: 56789, date: '2026-01-31', status: 'completed', manager: '王十一', department: '行政部', paymentMethod: '银行转账', invoiceNumber: 'INV-2026-009', notes: '办公室设备更新' },
  { key: '10', id: 'TRX-2026-010', type: 'sales', partner: '重庆贸易公司', description: '产品销售', amount: 178901, date: '2026-01-30', status: 'completed', manager: '李十二', department: '销售部', paymentMethod: '支票', invoiceNumber: 'INV-2026-010', notes: '常规销售订单' },
  { key: '11', id: 'TRX-2026-011', type: 'purchase', partner: '天津供应商', description: '原材料采购', amount: 98765, date: '2026-01-29', status: 'pending', manager: '张十三', department: '采购部', paymentMethod: '电汇', invoiceNumber: 'INV-2026-011', notes: '月度采购计划' },
  { key: '12', id: 'TRX-2026-012', type: 'sales', partner: '苏州科技有限公司', description: '软件销售', amount: 213456, date: '2026-01-28', status: 'completed', manager: '刘十四', department: '销售部', paymentMethod: '银行转账', invoiceNumber: 'INV-2026-012', notes: '企业版软件授权' },
  { key: '13', id: 'TRX-2026-013', type: 'purchase', partner: '厦门设备供应商', description: '生产设备采购', amount: 345678, date: '2026-01-27', status: 'completed', manager: '陈十五', department: '采购部', paymentMethod: '银行转账', invoiceNumber: 'INV-2026-013', notes: '生产设备更新' },
  { key: '14', id: 'TRX-2026-014', type: 'sales', partner: '青岛贸易公司', description: '产品销售', amount: 156789, date: '2026-01-26', status: 'cancelled', manager: '杨十六', department: '销售部', paymentMethod: '支票', invoiceNumber: 'INV-2026-014', notes: '客户取消订单' },
  { key: '15', id: 'TRX-2026-015', type: 'purchase', partner: '大连供应商', description: '原材料采购', amount: 87654, date: '2026-01-25', status: 'completed', manager: '黄十七', department: '采购部', paymentMethod: '电汇', invoiceNumber: 'INV-2026-015', notes: '月度采购计划' },
  { key: '16', id: 'TRX-2026-016', type: 'sales', partner: '宁波科技公司', description: '技术服务', amount: 123456, date: '2026-01-24', status: 'completed', manager: '周十八', department: '销售部', paymentMethod: '在线支付', invoiceNumber: 'INV-2026-016', notes: '技术咨询服务' },
  { key: '17', id: 'TRX-2026-017', type: 'purchase', partner: '长沙供应商', description: '办公用品采购', amount: 34567, date: '2026-01-23', status: 'completed', manager: '吴十九', department: '行政部', paymentMethod: '银行转账', invoiceNumber: 'INV-2026-017', notes: '办公用品采购' },
  { key: '18', id: 'TRX-2026-018', type: 'sales', partner: '昆明贸易公司', description: '产品销售', amount: 198765, date: '2026-01-22', status: 'pending', manager: '郑二十', department: '销售部', paymentMethod: '支票', invoiceNumber: 'INV-2026-018', notes: '批量采购订单' },
  { key: '19', id: 'TRX-2026-019', type: 'purchase', partner: '贵阳供应商', description: '原材料采购', amount: 76543, date: '2026-01-21', status: 'completed', manager: '王二十一', department: '采购部', paymentMethod: '电汇', invoiceNumber: 'INV-2026-019', notes: '月度采购计划' },
  { key: '20', id: 'TRX-2026-020', type: 'sales', partner: '南宁科技有限公司', description: '软件销售', amount: 234567, date: '2026-01-20', status: 'completed', manager: '李二十二', department: '销售部', paymentMethod: '银行转账', invoiceNumber: 'INV-2026-020', notes: '企业版软件授权' }
])

const pagination = ref<Pagination>({
  current: 1,
  pageSize: 5,
  total: allTransactions.value.length
})

const paginatedTransactions = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return allTransactions.value.slice(start, end)
})

const paginationConfig = computed(() => ({
  current: pagination.value.current,
  pageSize: pagination.value.pageSize,
  total: pagination.value.total,
  onChange: (page: number, pageSize: number) => {
    pagination.value.current = page
    pagination.value.pageSize = pageSize
  },
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20'],
  showTotal: (total: number) => `共 ${total} 条记录`,
  showQuickJumper: true,
  size: 'default' as const,
  simple: false,
  locale: {
    items_per_page: '条/页',
    jump_to: '前往',
    page: '页',
    prev_page: '上一页',
    next_page: '下一页',
    prev_5: '向前 5 页',
    next_5: '向后 5 页',
    prev_3: '向前 3 页',
    next_3: '向后 3 页',
    first_page: '首页',
    last_page: '末页'
  }
}))

const detailModalVisible = ref(false)
const currentTransaction = ref<Transaction | null>(null)

const openDetailModal = (record: Transaction) => {
  currentTransaction.value = record
  detailModalVisible.value = true
}

const closeDetailModal = () => {
  detailModalVisible.value = false
  currentTransaction.value = null
}

const handleViewRange = (range: 'month' | 'quarter' | 'year') => {
  currentViewRange.value = range
  pagination.value.current = 1
}

const currentFundStats = computed(() => {
  const data = fundStatsData.value[fundDistributionType.value]
  return {
    ...data,
    displayValue: `¥${Math.round(fundAmountAnimatedValue.value).toLocaleString()}`,
    displayPeriodValue: `${Math.round(fundPeriodAnimatedValue.value)}天`
  }
})

const fundDistributionData = shallowRef<Record<string, FundDistributionData>>({
  receivable: {
    name: '应收账款',
    data: [
      { name: '1-30天', value: 210000, color: '#1890ff' },
      { name: '31-60天', value: 120000, color: '#52c41a' },
      { name: '61-90天', value: 80000, color: '#faad14' },
      { name: '90天以上', value: 46892, color: '#ff4d4f' }
    ]
  },
  payable: {
    name: '应付账款',
    data: [
      { name: '1-30天', value: 180000, color: '#1890ff' },
      { name: '31-60天', value: 100000, color: '#52c41a' },
      { name: '61-90天', value: 70000, color: '#faad14' },
      { name: '90天以上', value: 35000, color: '#ff4d4f' }
    ]
  }
})

const switchFundDistribution = (type: 'receivable' | 'payable') => {
  const oldValue = fundAmountAnimatedValue.value
  const oldPeriodValue = fundPeriodAnimatedValue.value
  
  fundDistributionType.value = type
  
  const newValue = fundStatsData.value[type].numericValue
  const newPeriodValue = fundStatsData.value[type].numericPeriodValue
  
  animateValue(oldValue, newValue, ANIMATION_DURATION, (value) => {
    fundAmountAnimatedValue.value = value
  })
  
  animateValue(oldPeriodValue, newPeriodValue, ANIMATION_DURATION, (value) => {
    fundPeriodAnimatedValue.value = value
  })
  
  updateFundDistributionChart()
}

const initFundDistributionChart = () => {
  const chartDom = document.getElementById('systemChart')
  if (chartDom) {
    fundDistributionChart = echarts.init(chartDom)
    updateFundDistributionChart()
  }
}

const updateFundDistributionChart = () => {
  if (!fundDistributionChart) return
  
  const currentData = fundDistributionData.value[fundDistributionType.value]
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const total = currentData.data.reduce((sum, item) => sum + item.value, 0)
        const percentage = ((params.value / total) * 100).toFixed(1)
        return `${params.name}<br/>金额: ¥${params.value.toLocaleString()}<br/>占比: ${percentage}%`
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: '#1890ff',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    legend: {
      orient: 'vertical',
      right: 65,
      top: '48%',
      textStyle: { fontSize: 12, color: '#666' },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 15
    },
    series: [{
      name: currentData.name,
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['35%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 0,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.1)'
      },
      label: {
        show: true,
        position: 'center',
        formatter: currentData.name,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 20,
        lineStyle: { width: 1, type: 'solid' }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: (idx: number) => idx * 100,
      data: currentData.data.map(item => ({
        name: item.name,
        value: item.value,
        itemStyle: { color: item.color }
      }))
    }]
  }
  
  fundDistributionChart.setOption(option)
}

const handleResize = () => {
  salesAnalysisChart?.resize()
  fundDistributionChart?.resize()
}

onMounted(async () => {
  loading.value = true
  
  try {
    updateDashboardAnimations()
    
    setTimeout(() => {
      initSalesAnalysisChart()
      initFundDistributionChart()
      
      fundAmountAnimatedValue.value = 0
      fundPeriodAnimatedValue.value = 0
      animateValue(0, fundStatsData.value[fundDistributionType.value].numericValue, ANIMATION_DURATION, (value) => {
        fundAmountAnimatedValue.value = value
      })
      animateValue(0, fundStatsData.value[fundDistributionType.value].numericPeriodValue, ANIMATION_DURATION, (value) => {
        fundPeriodAnimatedValue.value = value
      })
    }, 100)
  } catch (error) {
    console.error('Error during initialization:', error)
  } finally {
    loading.value = false
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesAnalysisChart?.dispose()
  fundDistributionChart?.dispose()
})
</script>

<style scoped>
.home-page {
  width: 100%;
  padding: 1.5%;
}

.home-quadrant-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.home-quadrant-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.home-quadrant-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.home-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.home-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.home-card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.home-card-icon {
  font-size: 18px;
  color: #999;
}

.home-card-icon-blue {
  color: #1890ff;
  background-color: #bae7ff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.home-card-icon-orange {
  color: #fa8c16;
  background-color: #ffe7ba;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.home-card-icon-green {
  color: #52c41a;
  background-color: #d9f7be;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.home-card-icon-red {
  color: #ff4d4f;
  background-color: #ffccc7;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.home-date-tabs {
  display: flex;
  gap: 2px;
}

.home-date-tag {
  font-size: 12px;
  padding: 2px 8px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  color: #000;
}

.home-date-tag.active {
  font-weight: 600;
  border: none;
  background-color: #40a9ff;
  color: #fff;
}

.home-sales-card .home-date-tag.active {
  background-color: #40a9ff;
  color: #fff;
}

.home-purchase-card .home-date-tag.active {
  background-color: #ffa940;
  color: #fff;
}

.home-inventory-card .home-date-tag.active {
  background-color: #73d13d;
  color: #fff;
}

.home-profit-card .home-date-tag.active {
  background-color: #ff7875;
  color: #fff;
}

.home-card-content {
  padding-top: 0;
  margin-top: -16px;
}

.home-card-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.home-card-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home-stat-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.home-stat-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-top: -26px;
}

.home-stat-label {
  font-size: 12px;
  color: #666;
}

.home-stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.home-stat-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.home-stat-trend.up {
  color: #52c41a;
  background-color: #d9f7be;
}

.home-stat-trend.down {
  color: #ff4d4f;
  background-color: #ffccc7;
}

.home-stat-period {
  font-size: 12px;
  color: #999;
}

.home-sales-card .home-card-value {
  color: #1890ff;
}

.home-purchase-card .home-card-value {
  color: #fa8c16;
}

.home-inventory-card .home-card-value {
  color: #52c41a;
}

.home-profit-card .home-card-value {
  color: #ff4d4f;
}

@media (max-width: 1200px) {
  .home-quadrant-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-quadrant-cards {
    grid-template-columns: 1fr;
  }
  
  .home-page {
    padding: 16px;
  }
}

@media (max-width: 576px) {
  .home-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .home-header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .home-card-value {
    font-size: 28px;
  }
}

.home-chart-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.home-chart-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
  height: 380px;
  display: flex;
  flex-direction: column;
}

.home-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.home-chart-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.home-chart-tabs {
  display: flex;
  gap: 12px;
}

.home-chart-tab {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 16px;
  background-color: #f5f5f5;
  
  &.active {
    color: #fff;
    background-color: #1890ff;
  }
}

.home-chart-footer {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.home-footer-item {
  text-align: center;
}

.home-footer-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.home-footer-value {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .home-stat-grid {
    grid-template-columns: 1fr;
  }
  
  .home-chart-section {
    grid-template-columns: 1fr;
  }
  
  .home-chart-card {
    height: 350px;
  }
  
  .home-chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .home-chart-tabs {
    align-self: flex-start;
  }
  
  .home-ranking-table {
    font-size: 14px;
  }
  
  .home-table-cell {
    padding: 12px 8px;
  }
  
  .home-store-id {
    font-size: 12px;
  }
}

/* 店铺销售排行榜样式 */
.home-ranking-section {
  margin-top: 20px;
}

.home-ranking-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
}

.home-ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.home-ranking-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.home-ranking-filter {
  display: flex;
  align-items: center;
}

.home-ranking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.home-table-header {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.home-table-row {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.home-table-cell {
  flex: 1;
  padding: 8px 16px;
  display: flex;
  align-items: center;
}

.home-table-cell.rank {
  flex: 0 0 80px;
  justify-content: center;
}

.home-table-cell.store {
  flex: 2;
}

.home-table-cell.sales {
  flex: 1;
  font-weight: 500;
}

.home-table-cell.growth {
  flex: 1;
}

.home-table-cell.status {
  flex: 0 0 100px;
  justify-content: center;
}

.home-rank-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
  font-weight: 500;
  
  &.first {
    background-color: #ffd700;
    color: #fff;
  }
  
  &.second {
    background-color: #c0c0c0;
    color: #fff;
  }
  
  &.third {
    background-color: #cd7f32;
    color: #fff;
  }
}

.home-store-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-store-icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  
  &.blue {
    background-color: #e6f7ff;
  }
  
  &.purple {
    background-color: #f3e5f5;
  }
  
  &.green {
    background-color: #e8f5e8;
  }
  
  &.red {
    background-color: #ffebee;
  }
}

.home-store-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.home-store-name {
  font-weight: 500;
  color: #333;
}

.home-store-id {
  font-size: 12px;
  color: #999;
}

.home-growth {
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.positive {
    color: #52c41a;
  }
  
  &.negative {
    color: #ff4d4f;
  }
}

.home-growth-icon {
  font-size: 12px;
}

.home-status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  &.normal {
    background-color: #e8f5e8;
    color: #52c41a;
  }
  
  &.warning {
    background-color: #fff3e0;
    color: #fa8c16;
  }
}

/* 统计分析卡片样式 */
.home-analysis-cards {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.home-analysis-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.home-analysis-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.home-analysis-tabs {
  display: flex;
  gap: 2px;
}

.home-analysis-tag {
  font-size: 12px;
  padding: 2px 8px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  color: #000;
}

.home-analysis-tag.active {
  font-weight: 600;
  border: none;
  background-color: #40a9ff;
  color: #fff;
}

.home-fund-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.home-fund-stat-item {
  text-align: center;
}

.home-fund-stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.home-fund-stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.home-fund-stat-value-blue {
  color: #1890ff;
}

@media (max-width: 1024px) {
  .home-analysis-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-analysis-cards {
    grid-template-columns: 1fr;
  }
}

.home-transactions-card {
  margin-bottom: 24px;
}

.home-transaction-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.home-transaction-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.home-transaction-card .home-card-content {
  padding-top: 16px;
}

.home-transaction-card .ant-table {
  border-radius: 4px;
  margin-top: 16px;
}

.home-transaction-card .ant-table-thead > tr > th {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.home-transaction-card .ant-table-tbody > tr > td {
  font-size: 13px;
  padding: 10px;
}

.home-view-range-button {
  border: 1px solid #d9d9d9;
  background-color: #f5f5f5;
  color: #333;
  transition: all 0.3s ease;
}

.home-view-range-button:hover {
  border-color: #1890ff;
  color: #1890ff;
  background-color: #e6f7ff;
}

@media (max-width: 1200px) {
  .home-transaction-card .ant-table {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .home-transaction-card .ant-table {
    font-size: 12px;
  }
  
  .home-transaction-card .ant-table-tbody > tr > td {
    padding: 8px;
  }
}

@media (max-width: 576px) {
  .home-transaction-card .home-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .home-view-range-button {
    width: 100%;
  }
}

.home-transaction-detail-modal {
  border-radius: 8px;
}

.home-transaction-detail {
  padding: 20px 0;
}

.home-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.home-detail-id {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.home-status-tag {
  font-size: 14px;
  padding: 4px 12px;
}

.home-detail-content {
  margin-bottom: 20px;
}

.home-detail-section {
  margin-bottom: 24px;
}

.home-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #1890ff;
}

.home-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.home-detail-item {
  display: flex;
  align-items: center;
}

.home-detail-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-right: 12px;
  min-width: 100px;
}

.home-detail-value {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.home-amount-value {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
}

.home-type-tag {
  font-size: 12px;
  padding: 2px 8px;
}

.home-detail-notes {
  font-size: 14px;
  color: #333;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  min-height: 80px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .home-detail-grid {
    grid-template-columns: 1fr;
  }
  
  .home-detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 576px) {
  .home-transaction-detail-modal {
    width: 90% !important;
  }
  
  .home-detail-id {
    font-size: 16px;
  }
  
  .home-section-title {
    font-size: 14px;
  }
  
  .home-detail-value {
    font-size: 13px;
  }
  
  .home-detail-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .home-detail-label {
    margin-bottom: 6px;
    margin-right: 0;
  }
}
</style>