<template>
  <div class="organization-chart-container">
    <a-config-provider :locale="zhCN">
      <div class="organization-chart-page">
        <a-card class="organization-chart-card">
          <div class="organization-chart-actions">
            <a-button type="primary" @click="handleRefreshChart">刷新架构</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #52c41a;" @click="handleCollapseChart">折叠架构</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #1890ff;" @click="handleExpandChart">展开架构</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #fa8c16; color: white;" @click="handleExportImage">导出图片</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #722ed1;" @click="handleExportPDF">导出PDF</a-button>
            <a-button type="primary" style="margin-left: 8px; background-color: #13c2c2;" @click="navigateToOrganizationAdmin">架构管理</a-button>
          </div>
          
          <div class="organization-chart-wrapper">
            <a-spin :spinning="isLoading" tip="加载组织架构数据...">
              <div ref="chartRef" class="organization-chart-content"></div>
            </a-spin>
          </div>
        </a-card>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import * as echarts from 'echarts';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

// 加载状态
const isLoading = ref(false);

// 路由实例
const router = useRouter();

// 图表实例
let chartInstance: echarts.ECharts | null = null;
// 图表容器引用
const chartRef = ref<HTMLElement | null>(null);

interface OrganizationNode {
  name: string;
  children?: OrganizationNode[];
}

/**
 * 生成模拟组织架构数据
 */
const generateMockOrganizationData = (): OrganizationNode => {
  return {
    name: '总公司',
    children: [
      {
        name: '分公司1',
        children: [
          {
            name: '部门1-1',
            children: [
              { name: '小组1-1-1' },
              { name: '小组1-1-2' }
            ]
          },
          {
            name: '部门1-2',
            children: [
              { name: '小组1-2-1' }
            ]
          }
        ]
      },
      {
        name: '分公司2',
        children: [
          {
            name: '部门2-1',
            children: [
              { name: '小组2-1-1' },
              { name: '小组2-1-2' },
              { name: '小组2-1-3' }
            ]
          },
          {
            name: '部门2-2'
          },
          {
            name: '部门2-3',
            children: [
              { name: '小组2-3-1' }
            ]
          }
        ]
      },
      {
        name: '分公司3',
        children: [
          {
            name: '部门3-1',
            children: [
              { name: '小组3-1-1' },
              { name: '小组3-1-2' }
            ]
          }
        ]
      }
    ]
  };
};

/**
 * 获取组织架构数据
 */
const fetchOrganizationData = async (): Promise<OrganizationNode> => {
  try {
    isLoading.value = true;
    // 使用模拟数据，不与后端通信
    const mockData = generateMockOrganizationData();
    return mockData;
  } catch (error) {
    console.error('获取组织架构数据失败:', error);
    message.error('获取组织架构数据失败，请稍后重试');
    return { name: '无数据', children: [] };
  } finally {
    isLoading.value = false;
  }
};

/**
 * 初始化组织架构图
 */
const initOrganizationChart = async () => {
  if (!chartRef.value) return;
  
  try {
    // 销毁现有实例
    if (chartInstance) {
      chartInstance.dispose();
    }
    
    // 创建新实例
    chartInstance = echarts.init(chartRef.value);
    
    // 获取组织架构数据
    const data = await fetchOrganizationData();
    
    // 配置项
    const chartOption = {
      backgroundColor: '#f5f5f5',
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [data],
          top: '1%',
          left: '15%',
          bottom: '1%',
          right: '25%',
          symbolSize: 7,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            backgroundColor: '#ffffff',
            borderColor: '#d9d9d9',
            borderWidth: 1,
            borderRadius: 4,
            padding: [5, 10, 5, 10],
            fontSize: 12,
            overflow: 'none',
            ellipsis: false
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
              backgroundColor: '#ffffff',
              borderColor: '#d9d9d9',
              borderWidth: 1,
              borderRadius: 4,
              padding: [5, 10, 5, 10],
              fontSize: 12,
              overflow: 'none',
              ellipsis: false,
              show: true
            }
          },
          emphasis: {
            focus: 'descendant',
            label: {
              backgroundColor: '#e6f7ff',
              borderColor: '#1890ff',
              borderWidth: 1
            }
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
    
    // 渲染图表
    chartInstance.setOption(chartOption);
  } catch (error) {
    console.error('初始化组织架构图失败:', error);
    message.error('初始化组织架构图失败，请稍后重试');
  }
};

/**
 * 刷新组织架构图
 */
const handleRefreshChart = async () => {
  await initOrganizationChart();
  message.success('组织架构已刷新');
};

/**
 * 折叠组织架构图
 */
const handleCollapseChart = async () => {
  if (!chartInstance) return;
  
  try {
    isLoading.value = true;
    // 获取组织架构数据
    const data = await fetchOrganizationData();
    
    // 配置项，设置为只显示根节点
    const chartOption = {
      backgroundColor: '#f5f5f5',
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [data],
          top: '1%',
          left: '15%',
          bottom: '1%',
          right: '25%',
          symbolSize: 7,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            backgroundColor: '#ffffff',
            borderColor: '#d9d9d9',
            borderWidth: 1,
            borderRadius: 4,
            padding: [5, 10, 5, 10],
            fontSize: 12,
            overflow: 'none',
            ellipsis: false
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
              backgroundColor: '#ffffff',
              borderColor: '#d9d9d9',
              borderWidth: 1,
              borderRadius: 4,
              padding: [5, 10, 5, 10],
              fontSize: 12,
              overflow: 'none',
              ellipsis: false,
              show: true
            }
          },
          emphasis: {
            focus: 'descendant',
            label: {
              backgroundColor: '#e6f7ff',
              borderColor: '#1890ff',
              borderWidth: 1
            }
          },
          expandAndCollapse: true,
          initialTreeDepth: 2, // 2 表示折叠至第2层
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
    
    // 应用配置项
    chartInstance.setOption(chartOption);
    
    message.success('组织架构已折叠');
  } catch (error) {
    console.error('折叠组织架构失败:', error);
    message.error('折叠组织架构失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

/**
 * 展开组织架构图
 */
const handleExpandChart = async () => {
  if (!chartInstance) return;
  
  try {
    isLoading.value = true;
    // 获取组织架构数据
    const data = await fetchOrganizationData();
    
    // 配置项，设置为展开所有层级
    const chartOption = {
      backgroundColor: '#f5f5f5',
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [data],
          top: '1%',
          left: '15%',
          bottom: '1%',
          right: '25%',
          symbolSize: 7,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            backgroundColor: '#ffffff',
            borderColor: '#d9d9d9',
            borderWidth: 1,
            borderRadius: 4,
            padding: [5, 10, 5, 10],
            fontSize: 12,
            overflow: 'none',
            ellipsis: false
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
              backgroundColor: '#ffffff',
              borderColor: '#d9d9d9',
              borderWidth: 1,
              borderRadius: 4,
              padding: [5, 10, 5, 10],
              fontSize: 12,
              overflow: 'none',
              ellipsis: false,
              show: true
            }
          },
          emphasis: {
            focus: 'descendant',
            label: {
              backgroundColor: '#e6f7ff',
              borderColor: '#1890ff',
              borderWidth: 1
            }
          },
          expandAndCollapse: true,
          initialTreeDepth: -1, // -1 表示展开所有层级
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
    
    // 应用配置项
    chartInstance.setOption(chartOption);
    
    message.success('组织架构已展开');
  } catch (error) {
    console.error('展开组织架构失败:', error);
    message.error('展开组织架构失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

/**
 * 导出组织架构图片
 */
const handleExportImage = () => {
  if (!chartInstance) return;
  
  try {
    // 获取图片URL
    const imageUrl = chartInstance.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#f5f5f5'
    });
    
    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = `组织架构图_${new Date().toISOString().slice(0, 10)}.png`;
    downloadLink.click();
    
    message.success('组织架构图片导出成功');
  } catch (error) {
    console.error('导出图片失败:', error);
    message.error('导出图片失败');
  }
};

/**
 * 导出组织架构PDF
 */
const handleExportPDF = () => {
  // 暂时注释掉，因为可能缺少依赖
  message.info('PDF导出功能需要安装html2canvas和jspdf依赖');
};

/**
 * 监听窗口大小变化，调整图表大小
 */
const handleChartResize = () => {
  chartInstance?.resize();
};

/**
 * 跳转到组织管理页面
 */
const navigateToOrganizationAdmin = () => {
  router.push('/system/organization/organizationadmin');
};

// 生命周期钩子
onMounted(async () => {
  await initOrganizationChart();
  window.addEventListener('resize', handleChartResize);
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', handleChartResize);
});
</script>

<style scoped>
.organization-chart-container {
  width: 100%;
  padding: 1.5%;
}

.organization-chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.organization-chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.organization-chart-actions {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.organization-chart-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
}

.organization-chart-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.organization-chart-wrapper {
  position: relative;
  width: 100%;
  height: 800px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.organization-chart-content {
  width: 100%;
  height: 100%;
  min-height: 800px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .organization-chart-page {
    padding: 20px;
  }
}

@media (max-width: 992px) {
  .organization-chart-page {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .organization-chart-page {
    padding: 12px;
  }
  
  .organization-chart-actions {
    flex-direction: column;
  }
  
  .organization-chart-actions :deep(.ant-btn) {
    width: 100%;
    margin-left: 0 !important;
  }
  
  .organization-chart-content {
    height: 600px;
  }
}

@media (max-width: 576px) {
  .organization-chart-page {
    padding: 12px;
  }
  
  .organization-chart-content {
    height: 500px;
  }
}
</style>