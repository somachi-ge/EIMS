<template>
  <AppLayout>
    <div class="log-analysis-page">
      <a-card title="日志分析">
        <div class="card-content">
          <div class="analysis-filters">
            <a-date-picker v-model:value="dateRange" range-picker style="width: 300px; margin-right: 10px" />
            <a-button type="primary" @click="handleAnalysis">分析</a-button>
          </div>
          <div class="analysis-charts">
            <a-card title="操作类型分布" class="chart-card">
              <div id="operationChart" style="height: 300px;"></div>
            </a-card>
            <a-card title="日志级别分布" class="chart-card">
              <div id="levelChart" style="height: 300px;"></div>
            </a-card>
            <a-card title="操作趋势" class="chart-card full-width">
              <div id="trendChart" style="height: 300px;"></div>
            </a-card>
          </div>
        </div>
      </a-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import AppLayout from '../../../components/layout/AppLayout.vue'

const dateRange = ref<any>([])

onMounted(() => {
  // 初始化图表
  initCharts()
})

const initCharts = () => {
  // 操作类型分布图表
  const operationChart = echarts.init(document.getElementById('operationChart'))
  operationChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [{
      name: '操作类型',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 30, name: '登录' },
        { value: 20, name: '添加' },
        { value: 25, name: '修改' },
        { value: 15, name: '删除' },
        { value: 10, name: '其他' }
      ]
    }]
  })
  
  // 日志级别分布图表
  const levelChart = echarts.init(document.getElementById('levelChart'))
  levelChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [{
      name: '日志级别',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 60, name: '信息' },
        { value: 20, name: '警告' },
        { value: 10, name: '错误' },
        { value: 10, name: '调试' }
      ]
    }]
  })
  
  // 操作趋势图表
  const trendChart = echarts.init(document.getElementById('trendChart'))
  trendChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 132, 101, 134, 90, 230],
      type: 'line'
    }]
  })
  
  // 响应式调整
  window.addEventListener('resize', () => {
    operationChart.resize()
    levelChart.resize()
    trendChart.resize()
  })
}

const handleAnalysis = () => {
  // 执行分析
  console.log('执行分析', dateRange.value)
}
</script>

<style scoped>
.log-analysis-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.analysis-filters {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.analysis-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  height: 350px;
}

.full-width {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .analysis-charts {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: span 1;
  }
  
  .chart-card {
    height: 300px;
  }
}
</style>