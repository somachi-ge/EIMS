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
            @click="navigateToApplication(app)"
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
  SwapOutlined,
  CodeOutlined,
  TeamOutlined,
  BookOutlined,
} from '@ant-design/icons-vue'

interface Application {
  id: string
  name: string
  icon: any
  color: string
  path?: string
}

const APPLICATIONS: readonly Application[] = [
  { id: 'code', name: '编码规则', icon: CodeOutlined, color: '#cf1322', path: '/coding-rule' },
  { id: 'dictionary', name: '数据字典', icon: BookOutlined, color: '#faad14', path: '/dictionary' },
  { id: 'workflow', name: '工作流', icon: SwapOutlined, color: '#0958d9', path: '/workflow' },
  { id: 'organization', name: '组织管理', icon: TeamOutlined, color: '#7cb305', path: '/system/organization' },
]

const applications = shallowRef<readonly Application[]>(APPLICATIONS)

const navigateToApplication = (app: Application) => {
  if (app.path) {
    if (app.id === 'code') {
      window.open(app.path, '_blank')
    } else {
      message.info(`正在打开 ${app.name}...`)
    }
  } else {
    message.warning(`${app.name} 功能正在开发中...`)
  }
}
</script>

<style scoped>
.application-page {
  width: 100%;
  padding: 1.5%;
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
  width: 100%;
  padding: 1.5%;
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