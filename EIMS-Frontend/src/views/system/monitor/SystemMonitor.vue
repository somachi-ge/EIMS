<template>
  <AppLayout>
    <div class="system-monitor-page">
      <a-card title="系统监控">
        <div class="card-content">
          <div class="monitor-stats">
            <div class="stat-item">
              <div class="stat-value">{{ cpuUsage }}%</div>
              <div class="stat-label">CPU使用率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ memoryUsage }}%</div>
              <div class="stat-label">内存使用率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ diskUsage }}%</div>
              <div class="stat-label">磁盘使用率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ networkSpeed }}</div>
              <div class="stat-label">网络速度</div>
            </div>
          </div>
          <div class="monitor-charts">
            <a-card title="CPU使用趋势" class="chart-card">
              <div id="cpuChart" style="height: 300px;"></div>
            </a-card>
            <a-card title="内存使用趋势" class="chart-card">
              <div id="memoryChart" style="height: 300px;"></div>
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

const cpuUsage = ref('45')
const memoryUsage = ref('68')
const diskUsage = ref('32')
const networkSpeed = ref('1.2 MB/s')

onMounted(() => {
  // 初始化图表
  initCharts()
})

const initCharts = () => {
  // CPU使用趋势图表
  const cpuChart = echarts.init(document.getElementById('cpuChart'))
  cpuChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [{
      data: [30, 45, 35, 50, 40, 55, 45],
      type: 'line'
    }]
  })
  
  // 内存使用趋势图表
  const memoryChart = echarts.init(document.getElementById('memoryChart'))
  memoryChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [{
      data: [60, 62, 65, 68, 66, 70, 68],
      type: 'line'
    }]
  })
  
  // 响应式调整
  window.addEventListener('resize', () => {
    cpuChart.resize()
    memoryChart.resize()
  })
}
</script>

<style scoped>
.system-monitor-page {
  padding: 20px;
}

.card-content {
  padding: 20px;
}

.monitor-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.monitor-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  height: 350px;
}

@media (max-width: 768px) {
  .monitor-charts {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 300px;
  }
}
</style>