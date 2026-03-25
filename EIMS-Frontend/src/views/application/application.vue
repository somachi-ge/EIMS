<template>
  <MainLayout>
    <div class="platform-page">
      <div class="platform-grid">
        <div 
          v-for="(platform, index) in platforms" 
          :key="platform.name" 
          class="platform-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <a-card 
            :style="{ backgroundColor: platform.color, border: 'none' }" 
            class="platform-card"
            hoverable
          >
            <div class="platform-icon">
              <component :is="platform.icon" />
            </div>
          </a-card>
          <div class="platform-name">{{ platform.name }}</div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../../components/layout/MainLayout.vue'
import { shallowRef } from 'vue'
import {
  SwapOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  AccountBookOutlined,
  ToolOutlined,
  ScheduleOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ControlOutlined,
  LineChartOutlined,
  CodeOutlined,
  TeamOutlined,
  ProjectOutlined,
} from '@ant-design/icons-vue'

interface Platform {
  name: string
  icon: any
  color: string
}

const PLATFORM_ITEMS: Platform[] = [
  { name: '协同办公', icon: TeamOutlined, color: '#1890ff' },
  { name: '项目管理', icon: ProjectOutlined, color: '#52c41a' },
  { name: '客户关系', icon: CustomerServiceOutlined, color: '#faad14' },
  { name: '人力资源', icon: UserOutlined, color: '#f5222d' },
  { name: '财务管理', icon: AccountBookOutlined, color: '#722ed1' },
  { name: '资产管理', icon: ToolOutlined, color: '#13c2c2' },
  { name: '供应链管理', icon: SwapOutlined, color: '#fa541c' },
  { name: '计划排程', icon: ScheduleOutlined, color: '#eb2f96' },
  { name: '仓库管理', icon: EnvironmentOutlined, color: '#1890ff' },
  { name: '生产管理', icon: SettingOutlined, color: '#52c41a' },
  { name: '质量管理', icon: CheckCircleOutlined, color: '#faad14' },
  { name: '设备管理', icon: ControlOutlined, color: '#f5222d' },
  { name: '能源管理', icon: LineChartOutlined, color: '#722ed1' },
]

const platforms = shallowRef<Platform[]>(PLATFORM_ITEMS)
</script>

<style scoped>
.platform-page {
  width: 100%;
  padding: 1.5%;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.platform-item {
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

.platform-card {
  width: 70px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.platform-card:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.platform-icon {
  font-size: 32px;
}

.platform-name {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 8px;
  color: #333;
  width: 100%;
  line-height: 1.4;
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1200px) {
  .platform-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .platform-page {
  width: 100%;
  padding: 1.5%;
  }
  
  .platform-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 20px;
  }
  
  .platform-card {
    width: 60px;
  }
  
  .platform-icon {
    font-size: 28px;
  }
  
  .platform-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .platform-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 16px;
  }
  
  .platform-card {
    width: 56px;
  }
  
  .platform-icon {
    font-size: 24px;
  }
  
  .platform-name {
    font-size: 12px;
  }
}
</style>