<template>
  <MainLayout>
    <div class="application-page">
      <div class="application-grid">
        <div 
          v-for="(app, index) in applications" 
          :key="app.id"
          class="application-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <a-card
            :style="{ backgroundColor: app.color, border: 'none' }"
            class="application-card"
            hoverable
            @click="handleApplicationClick(app)"
          >
            <div class="application-icon">
              <component :is="app.icon" />
            </div>
          </a-card>
          <div class="application-name">{{ app.name }}</div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../../components/layout/MainLayout.vue'
import { shallowRef } from 'vue'
import { message } from 'ant-design-vue'
import {
  TeamOutlined,
  ProjectOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  AccountBookOutlined,
  ToolOutlined,
  SwapOutlined,
  ScheduleOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ControlOutlined,
  LineChartOutlined,
} from '@ant-design/icons-vue'

interface Application {
  id: string
  name: string
  icon: any
  color: string
  path?: string
}

const APPLICATIONS: readonly Application[] = [
  { id: 'cooffice', name: '协同办公系统', icon: TeamOutlined, color: '#1890ff', path: '/cooffice' },
  { id: 'project', name: '项目管理系统', icon: ProjectOutlined, color: '#52c41a', path: '/project' },
  { id: 'crm', name: '客户关系系统', icon: CustomerServiceOutlined, color: '#faad14', path: '/crm' },
  { id: 'hr', name: '人力资源系统', icon: UserOutlined, color: '#f5222d', path: '/hr' },
  { id: 'finance', name: '财务管理系统', icon: AccountBookOutlined, color: '#722ed1', path: '/finance' },
  { id: 'asset', name: '资产管理系统', icon: ToolOutlined, color: '#13c2c2', path: '/asset' },
  { id: 'supplychain', name: '供应链管理系统', icon: SwapOutlined, color: '#fa541c', path: '/supplychain' },
  { id: 'schedule', name: '计划排程系统', icon: ScheduleOutlined, color: '#eb2f96', path: '/schedule' },
  { id: 'warehouse', name: '仓库管理系统', icon: EnvironmentOutlined, color: '#1890ff', path: '/warehouse' },
  { id: 'production', name: '生产管理系统', icon: SettingOutlined, color: '#52c41a', path: '/production' },
  { id: 'quality', name: '质量管理系统', icon: CheckCircleOutlined, color: '#faad14', path: '/quality' },
  { id: 'equipment', name: '设备管理系统', icon: ControlOutlined, color: '#f5222d', path: '/equipment' },
  { id: 'energy', name: '能源管理系统', icon: LineChartOutlined, color: '#722ed1', path: '/energy' },
]

const applications = shallowRef<readonly Application[]>(APPLICATIONS)

const handleApplicationClick = (app: Application) => {
  if (app.path) {
    message.info(`正在打开 ${app.name}...`)
  } else {
    message.warning(`${app.name} 功能正在开发中...`)
  }
}
</script>

<style scoped>
.application-page {
  padding: 24px;
}

.application-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.application-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.application-card {
  width: 70px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.application-card:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.application-icon {
  font-size: 32px;
}

.application-name {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 8px;
  color: #333;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
}

@media (max-width: 1200px) {
  .application-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .application-page {
    padding: 16px;
  }
  
  .application-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 20px;
  }
  
  .application-card {
    width: 60px;
  }
  
  .application-icon {
    font-size: 28px;
  }
  
  .application-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .application-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 16px;
  }
  
  .application-card {
    width: 56px;
  }
  
  .application-icon {
    font-size: 24px;
  }
  
  .application-name {
    font-size: 12px;
  }
}
</style>