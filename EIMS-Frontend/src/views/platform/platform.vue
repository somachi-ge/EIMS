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
  AppstoreOutlined,
  ForkOutlined,
  WifiOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  IdcardOutlined,
  LockOutlined,
  LinkOutlined,
  ApiOutlined,
  GatewayOutlined,
  SwapOutlined,
  ControlOutlined,
  VideoCameraOutlined,
  CodeOutlined,
  ToolOutlined,
  ShoppingOutlined,
  SettingOutlined,
  KeyOutlined,
  SafetyOutlined,
  CompassOutlined,
  CloudOutlined,
  BlockOutlined,
  BookOutlined
} from '@ant-design/icons-vue'

interface Platform {
  name: string
  icon: any
  color: string
}

const PLATFORM_DATA: Platform[] = [
  { name: '基础设施平台', icon: AppstoreOutlined, color: '#cf1322' },
  { name: '网络管理平台', icon: ForkOutlined, color: '#7cb305' },
  { name: '物联接入平台', icon: WifiOutlined, color: '#d4380d' },
  { name: '统一数据平台', icon: DatabaseOutlined, color: '#d48806' },
  { name: '数据治理平台', icon: LineChartOutlined, color: '#c41d7f' },
  { name: '身份认证平台', icon: IdcardOutlined, color: '#d4b106' },
  { name: '访问管理平台', icon: LockOutlined, color: '#389e0d' },
  { name: '系统集成平台', icon: LinkOutlined, color: '#1d39c4' },
  { name: '接口管理平台', icon: ApiOutlined, color: '#08979c' },
  { name: '服务总线平台', icon: GatewayOutlined, color: '#531dab' },
  { name: '工作流平台', icon: SwapOutlined, color: '#0958d9' },
  { name: '数据资产平台', icon: CloudOutlined, color: '#d46b08' },
  { name: '设备接入平台', icon: ControlOutlined, color: '#cf1322' },
  { name: '数字孪生平台', icon: VideoCameraOutlined, color: '#7cb305' },
  { name: '算法管理平台', icon: CodeOutlined, color: '#d4380d' },
  { name: '模型管理平台', icon: DatabaseOutlined, color: '#d48806' },
  { name: '量子技术平台', icon: SettingOutlined, color: '#c41d7f' },
  { name: '区块链平台', icon: BlockOutlined, color: '#d4b106' },
  { name: '应用开发平台', icon: CodeOutlined, color: '#389e0d' },
  { name: '生态协作平台', icon: LinkOutlined, color: '#1d39c4' },
  { name: '应用治理平台', icon: SettingOutlined, color: '#08979c' },
  { name: '应用程序商城', icon: ShoppingOutlined, color: '#531dab' },
  { name: '统一运维平台', icon: ToolOutlined, color: '#0958d9' },
  { name: '运营管控平台', icon: CompassOutlined, color: '#d46b08' },
  { name: '合规审计平台', icon: BookOutlined, color: '#cf1322' },
  { name: '安全可信平台', icon: SafetyOutlined, color: '#7cb305' },
  { name: '安全治理平台', icon: KeyOutlined, color: '#d4380d' },
  { name: '画像管理平台', icon: LineChartOutlined, color: '#d48806' }
]

const platforms = shallowRef<Platform[]>(PLATFORM_DATA)
</script>

<style scoped>
.platform-page {
  padding: 24px;
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