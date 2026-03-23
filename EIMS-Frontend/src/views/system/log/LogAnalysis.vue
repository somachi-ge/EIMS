<template>
  <div class="log-analysis-page">
      <div class="analysis-cards">
        <a-card class="analysis-card chart-card">
          <div class="card-header">
            <h3 class="card-title">操作类型分布</h3>
            <div class="header-right">
              <div class="analysis-tabs">
                <a-tag 
                  v-for="option in ANALYSIS_OPTIONS" 
                  :key="option.value"
                  color="blue" 
                  :class="['analysis-tag', analysisType === option.value ? 'active' : '']"
                  @click="switchAnalysis(option.value)"
                >
                  {{ option.label }}
                </a-tag>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div id="operationChart" style="height: 300px;"></div>
            <div class="chart-footer">
              <div class="footer-item">
                <span class="footer-label">总操作数</span>
                <span class="footer-value">{{ totalOperations }}</span>
              </div>
              <div class="footer-item">
                <span class="footer-label">成功率</span>
                <span class="footer-value">{{ successRate }}%</span>
              </div>
              <div class="footer-item">
                <span class="footer-label">平均响应时间</span>
                <span class="footer-value">{{ avgResponseTime }}ms</span>
              </div>
            </div>
          </div>
        </a-card>

        <a-card class="analysis-card chart-card">
          <div class="card-header">
            <h3 class="card-title">日志级别分布</h3>
            <div class="header-right">
              <div class="analysis-tabs">
                <a-tag 
                  v-for="option in LEVEL_OPTIONS" 
                  :key="option.value"
                  color="blue" 
                  :class="['analysis-tag', levelType === option.value ? 'active' : '']"
                  @click="switchLevelAnalysis(option.value)"
                >
                  {{ option.label }}
                </a-tag>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div id="levelChart" style="height: 300px;"></div>
            <div class="chart-footer">
              <div class="footer-item">
                <span class="footer-label">总日志数</span>
                <span class="footer-value">{{ totalLogs }}</span>
              </div>
              <div class="footer-item">
                <span class="footer-label">错误率</span>
                <span class="footer-value">{{ errorRate }}%</span>
              </div>
              <div class="footer-item">
                <span class="footer-label">警告率</span>
                <span class="footer-value">{{ warningRate }}%</span>
              </div>
            </div>
          </div>
        </a-card>

        <a-card class="analysis-card chart-card full-width">
          <div class="card-header">
            <h3 class="card-title">操作趋势</h3>
            <div class="header-right">
              <div class="analysis-tabs">
                <a-tag 
                  v-for="option in TREND_OPTIONS" 
                  :key="option.value"
                  color="blue" 
                  :class="['analysis-tag', trendType === option.value ? 'active' : '']"
                  @click="switchTrendAnalysis(option.value)"
                >
                  {{ option.label }}
                </a-tag>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div id="trendChart" style="height: 300px;"></div>
            <div class="chart-footer">
              <div class="footer-item">
                <span class="footer-label">最高操作数</span>
                <span class="footer-value">{{ maxOperations }}</span>
              </div>
              <div class="footer-item">
                <span class="footer-label">最低操作数</span>
                <span class="footer-value">{{ minOperations }}</span>
              </div>
              <div class="footer-item">
                <span class="footer-label">平均操作数</span>
                <span class="footer-value">{{ avgOperations }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const ANALYSIS_OPTIONS = [
  { value: 'day', label: '按日' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' }
]

const LEVEL_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'error', label: '错误' },
  { value: 'warning', label: '警告' }
]

const TREND_OPTIONS = [
  { value: 'operations', label: '操作数' },
  { value: 'errors', label: '错误数' },
  { value: 'response', label: '响应时间' }
]

const analysisType = ref('day')
const levelType = ref('all')
const trendType = ref('operations')

// 统计数据
const totalOperations = ref(1250)
const successRate = ref(92.5)
const avgResponseTime = ref(156)
const totalLogs = ref(2450)
const errorRate = ref(7.5)
const warningRate = ref(15.2)
const maxOperations = ref(156)
const minOperations = ref(45)
const avgOperations = ref(87)

let operationChart: echarts.ECharts | null = null
let levelChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

onMounted(() => {
  // 初始化图表
  initCharts()
  
  // 响应式调整
  window.addEventListener('resize', handleResize)
})

const initCharts = () => {
  // 操作类型分布图表
  const operationChartDom = document.getElementById('operationChart')
  if (operationChartDom) {
    operationChart = echarts.init(operationChartDom)
    updateOperationChart()
  }
  
  // 日志级别分布图表
  const levelChartDom = document.getElementById('levelChart')
  if (levelChartDom) {
    levelChart = echarts.init(levelChartDom)
    updateLevelChart()
  }
  
  // 操作趋势图表
  const trendChartDom = document.getElementById('trendChart')
  if (trendChartDom) {
    trendChart = echarts.init(trendChartDom)
    updateTrendChart()
  }
}

const updateOperationChart = () => {
  if (!operationChart) return
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const total = params.series[0].data.reduce((sum: number, item: any) => sum + item.value, 0)
        const percentage = ((params.value / total) * 100).toFixed(1)
        return `${params.name}<br/>数量: ${params.value}<br/>占比: ${percentage}%`
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
      name: '操作类型',
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
        formatter: '操作类型分布',
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
      data: [
        { value: 30, name: '登录', itemStyle: { color: '#1890ff' } },
        { value: 20, name: '添加', itemStyle: { color: '#52c41a' } },
        { value: 25, name: '修改', itemStyle: { color: '#faad14' } },
        { value: 15, name: '删除', itemStyle: { color: '#ff4d4f' } },
        { value: 10, name: '其他', itemStyle: { color: '#722ed1' } }
      ]
    }]
  }
  
  operationChart.setOption(option)
}

const updateLevelChart = () => {
  if (!levelChart) return
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const total = params.series[0].data.reduce((sum: number, item: any) => sum + item.value, 0)
        const percentage = ((params.value / total) * 100).toFixed(1)
        return `${params.name}<br/>数量: ${params.value}<br/>占比: ${percentage}%`
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
      name: '日志级别',
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
        formatter: '日志级别分布',
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
      data: [
        { value: 60, name: '信息', itemStyle: { color: '#1890ff' } },
        { value: 20, name: '警告', itemStyle: { color: '#faad14' } },
        { value: 10, name: '错误', itemStyle: { color: '#ff4d4f' } },
        { value: 10, name: '调试', itemStyle: { color: '#722ed1' } }
      ]
    }]
  }
  
  levelChart.setOption(option)
}

const updateTrendChart = () => {
  if (!trendChart) return
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: '#1890ff',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLabel: { fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 12 }
    },
    series: [{
      name: '操作数',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230],
      itemStyle: { color: '#1890ff' },
      lineStyle: { width: 2 },
      symbol: 'circle',
      symbolSize: 8,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(24, 144, 255, 0.5)'
        }
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
          { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
        ])
      }
    }]
  }
  
  trendChart.setOption(option)
}

const switchAnalysis = (type: string) => {
  analysisType.value = type
  updateOperationChart()
}

const switchLevelAnalysis = (type: string) => {
  levelType.value = type
  updateLevelChart()
}

const switchTrendAnalysis = (type: string) => {
  trendType.value = type
  updateTrendChart()
}

const handleResize = () => {
  operationChart?.resize()
  levelChart?.resize()
  trendChart?.resize()
}

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  operationChart?.dispose()
  levelChart?.dispose()
  trendChart?.dispose()
})
</script>

<style scoped>
.log-analysis-page {
  width: 100%;
  padding: 1.5%;
}

.analysis-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.analysis-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.analysis-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.card-content {
  padding-top: 16px;
}

.analysis-tabs {
  display: flex;
  gap: 2px;
}

.analysis-tag {
  font-size: 12px;
  padding: 2px 8px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  color: #000;
}

.analysis-tag.active {
  font-weight: 600;
  border: none;
  background-color: #40a9ff;
  color: #fff;
}

.chart-footer {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.footer-item {
  text-align: center;
}

.footer-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.footer-value {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.full-width {
  grid-column: span 2;
}

@media (max-width: 1200px) {
  .analysis-cards {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: span 1;
  }
  
  .log-analysis-page {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .log-analysis-page {
    padding: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .analysis-tabs {
    align-self: flex-start;
  }
}

@media (max-width: 576px) {
  .log-analysis-page {
    padding: 12px;
  }
  
  .chart-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .footer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .footer-label {
    margin-bottom: 0;
  }
}
</style>