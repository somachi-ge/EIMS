<template>
  <AppLayout>
    <div class="home-page">
      <a-card title="系统概览" class="stat-card">
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-value">128</div>
            <div class="stat-label">用户总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">32</div>
            <div class="stat-label">部门数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">8</div>
            <div class="stat-label">角色数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">156</div>
            <div class="stat-label">操作日志</div>
          </div>
        </div>
      </a-card>
      
      <div class="chart-section">
        <a-card title="用户活跃度" class="chart-card">
          <div id="activityChart" style="height: 300px;"></div>
        </a-card>
        <a-card title="系统状态" class="chart-card">
          <div id="systemChart" style="height: 300px;"></div>
        </a-card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import AppLayout from '../../components/layout/AppLayout.vue'

onMounted(() => {
  // 初始化用户活跃度图表
  const activityChart = echarts.init(document.getElementById('activityChart'))
  activityChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 132, 101, 134, 90, 230, 210],
      type: 'line'
    }]
  })
  
  // 初始化系统状态图表
  const systemChart = echarts.init(document.getElementById('systemChart'))
  systemChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [{
      name: '系统状态',
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
        { value: 60, name: '正常' },
        { value: 20, name: '警告' },
        { value: 10, name: '错误' },
        { value: 10, name: '离线' }
      ]
    }]
  })
  
  // 响应式调整
  window.addEventListener('resize', () => {
    activityChart.resize()
    systemChart.resize()
  })
})
</script>

<style scoped>
.home-page {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
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

.chart-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  height: 350px;
}

@media (max-width: 768px) {
  .chart-section {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 300px;
  }
}
</style>