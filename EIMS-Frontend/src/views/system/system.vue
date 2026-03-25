<template>
  <MainLayout>
    <div v-if="$route.path === '/system'" class="system-page">
      <div class="system-grid">
        <div 
          v-for="(system, index) in systems" 
          :key="system.name" 
          class="system-item"
          @click="handleSystemClick(system.name)"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <a-card 
            :style="{ backgroundColor: system.color, border: 'none' }" 
            class="system-card"
            hoverable
          >
            <div class="system-icon">
              <component :is="system.icon" />
            </div>
          </a-card>
          <div class="system-name">{{ system.name }}</div>
        </div>
      </div>
      <a-modal
        v-model:visible="dataManagementModalVisible"
        :width="'25%'"
        :footer="null"
        :mask-closable="false"
        :closable="true"
      >
        <div style="display: flex; justify-content: center; gap: 40px; padding: 20px 0;">
          <div class="modal-system-item" @click="handleBackupList">
            <a-card 
              :style="{ backgroundColor: '#1890ff', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <TableOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">备份列表</div>
          </div>
          <div class="modal-system-item" @click="handleDataRestore">
            <a-card 
              :style="{ backgroundColor: '#eb2f96', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <ReloadOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">数据恢复</div>
          </div>

        </div>
      </a-modal>
      <a-modal
        v-model:visible="systemManagementModalVisible"
        :width="'30%'"
        :footer="null"
        :mask-closable="false"
        :closable="true"
      >
        <div style="display: flex; justify-content: center; gap: 40px; padding: 20px 0;">
          <div class="modal-system-item" @click="handleUserManagement">
            <a-card 
              :style="{ backgroundColor: '#f5222d', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <UserOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">用户管理</div>
          </div>
          <div class="modal-system-item" @click="handleRoleManagement">
            <a-card 
              :style="{ backgroundColor: '#722ed1', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <ProfileOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">角色管理</div>
          </div>
          <div class="modal-system-item" @click="handlePermissionManagement">
            <a-card 
              :style="{ backgroundColor: '#13c2c2', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <LockOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">权限管理</div>
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model:visible="systemLogsModalVisible"
        :width="'40%'"
        :footer="null"
        :mask-closable="false"
        :closable="true"
      >
        <div style="display: flex; justify-content: center; gap: 40px; padding: 20px 0;">
          <div class="modal-system-item" @click="handleLoginLogs">
            <a-card 
              :style="{ backgroundColor: '#722ed1', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <LoginOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">登录日志</div>
          </div>
          <div class="modal-system-item" @click="handleOperationLogs">
            <a-card 
              :style="{ backgroundColor: '#52c41a', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <InteractionOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">操作日志</div>
          </div>
          <div class="modal-system-item" @click="handleSystemLog">
            <a-card 
              :style="{ backgroundColor: '#fa8c16', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <MonitorOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">系统日志</div>
          </div>
          <div class="modal-system-item" @click="handleLogAnalysis">
            <a-card 
              :style="{ backgroundColor: '#1890ff', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <AreaChartOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">日志分析</div>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model:visible="systemSettingsModalVisible"
        :width="'30%'"
        :footer="null"
        :mask-closable="false"
        :closable="true"
      >
        <div style="display: flex; justify-content: center; gap: 40px; padding: 20px 0;">
          <div class="modal-system-item" @click="handleBasicConfig">
            <a-card 
              :style="{ backgroundColor: '#1890ff', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <SettingOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">基础配置</div>
          </div>
          <div class="modal-system-item" @click="handleEmailConfig">
            <a-card 
              :style="{ backgroundColor: '#722ed1', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <MailOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">邮件配置</div>
          </div>
          <div class="modal-system-item" @click="handleNotificationConfig">
            <a-card 
              :style="{ backgroundColor: '#13c2c2', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <BellOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">通知配置</div>
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model:visible="monitoringModalVisible"
        :width="'30%'"
        :footer="null"
        :mask-closable="false"
        :closable="true"
      >
        <div style="display: flex; justify-content: center; gap: 40px; padding: 20px 0;">
          <div class="modal-system-item" @click="handleSystemMonitor">
            <a-card 
              :style="{ backgroundColor: '#1890ff', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <MonitorOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">系统监控</div>
          </div>
          <div class="modal-system-item" @click="handleServiceMonitor">
            <a-card 
              :style="{ backgroundColor: '#722ed1', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <InteractionOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">服务监控</div>
          </div>
          <div class="modal-system-item" @click="handleUserActivity">
            <a-card 
              :style="{ backgroundColor: '#13c2c2', border: 'none' }" 
              class="modal-system-card"
              hoverable
            >
              <div class="modal-system-icon">
                <UserOutlined />
              </div>
            </a-card>
            <div class="modal-system-name">用户活动</div>
          </div>
        </div>
      </a-modal>
    </div>
    <router-view v-else></router-view>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../../components/layout/MainLayout.vue'
import { shallowRef, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  ProfileOutlined,
  LockOutlined,
  ReloadOutlined,
  ConsoleSqlOutlined,
  TableOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LoginOutlined,
  InteractionOutlined,
  MonitorOutlined,
  AreaChartOutlined,
  BellOutlined,
  MailOutlined
} from '@ant-design/icons-vue'

interface System {
  name: string
  icon: any
  color: string
  path?: string
}

const systemData: System[] = [
  { name: '权限配置', icon: SettingOutlined, color: '#08979c' },
  { name: '数据维护', icon: TableOutlined, color: '#531dab' },
  { name: '日志管理', icon: ConsoleSqlOutlined, color: '#d46b08' },
  { name: '监控中心', icon: MonitorOutlined, color: '#13c2c2' },
  { name: '系统设置', icon: SettingOutlined, color: '#722ed1' },
  { name: '帮助中心', icon: QuestionCircleOutlined, color: '#1890ff' }
]

// 权限管理需要先选择角色，因此映射到角色列表页面
// 在角色列表中可以选择角色并进入权限分配页面
const ROUTE_MAP: Record<string, string> = {
  '用户管理': '/system/user',
  '角色管理': '/system/role',
  '权限管理': '/system/role/permission/1',
  '系统日志': '/system/log/system',
  '日志分析': '/system/log/analysis',
  '操作日志': '/system/log/operation',
  '登录日志': '/system/log/login',

  '备份列表': '/system/backup/list',
  '数据恢复': '/system/backup/restore',
  '架构管理': '/system/organization/organizationadmin',
  '组织架构': '/system/organization/organizationchart',
  '编码规则': '/system/config/basic',
  '系统设置': '/system/settings',
  '监控中心': '/system/monitor',
  '系统监控': '/system/monitor/system',
  '服务监控': '/system/monitor/service',
  '用户活动': '/system/monitor/user',
  '基础配置': '/system/config/basic',
  '邮件配置': '/system/config/email',
  '通知配置': '/system/config/notification',
  '帮助中心': '/help'
}

const router = useRouter()
const systems = shallowRef<System[]>(systemData)
const dataManagementModalVisible = ref(false)
const systemManagementModalVisible = ref(false)
const systemLogsModalVisible = ref(false)
const systemSettingsModalVisible = ref(false)
const monitoringModalVisible = ref(false)

const handleSystemClick = (systemName: string) => {
  if (systemName === '数据维护') {
    dataManagementModalVisible.value = true
  } else if (systemName === '权限配置') {
    systemManagementModalVisible.value = true
  } else if (systemName === '日志管理') {
    systemLogsModalVisible.value = true
  } else if (systemName === '系统设置') {
    systemSettingsModalVisible.value = true
  } else if (systemName === '监控中心') {
    monitoringModalVisible.value = true
  } else if (systemName === '帮助中心') {
    const path = ROUTE_MAP[systemName]
    if (path) {
      try {
        window.open(path, '_blank')
      } catch (error) {
        console.error('页面打开失败:', error)
      }
    }
  } else {
    const path = ROUTE_MAP[systemName]
    if (path) {
      try {
        router.push(path)
      } catch (error) {
        console.error('页面跳转失败:', error)
      }
    }
  }
}


const handleDataRestore = () => {
  const path = ROUTE_MAP['数据恢复']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}

const handleBackupList = () => {
  const path = ROUTE_MAP['备份列表']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}

const handleUserManagement = () => {
  const path = ROUTE_MAP['用户管理']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}

const handleRoleManagement = () => {
  const path = ROUTE_MAP['角色管理']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}

const handlePermissionManagement = () => {
  const path = ROUTE_MAP['权限管理']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}

const handleLogAnalysis = () => {
  const path = ROUTE_MAP['日志分析']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}

const handleOperationLogs = () => {
  const path = ROUTE_MAP['操作日志']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}

const handleSystemLog = () => {
  const path = ROUTE_MAP['系统日志']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}

const handleLoginLogs = () => {
  const path = ROUTE_MAP['登录日志']
  if (path) {
    try {
      router.push(path)
    } catch (error) {
      console.error('页面跳转失败:', error)
    }
  }
}



const handleBasicConfig = () => {
  const path = ROUTE_MAP['基础配置']
  if (path) {
    try {
      window.open(path, '_blank')
    } catch (error) {
      console.error('页面打开失败:', error)
    }
  }
}

const handleEmailConfig = () => {
  const path = ROUTE_MAP['邮件配置']
  if (path) {
    try {
      window.open(path, '_blank')
    } catch (error) {
      console.error('页面打开失败:', error)
    }
  }
}

const handleNotificationConfig = () => {
  const path = ROUTE_MAP['通知配置']
  if (path) {
    try {
      window.open(path, '_blank')
    } catch (error) {
      console.error('页面打开失败:', error)
    }
  }
}

const handleSystemMonitor = () => {
  const path = ROUTE_MAP['系统监控']
  if (path) {
    try {
      window.open(path, '_blank')
    } catch (error) {
      console.error('页面打开失败:', error)
    }
  }
}

const handleServiceMonitor = () => {
  const path = ROUTE_MAP['服务监控']
  if (path) {
    try {
      window.open(path, '_blank')
    } catch (error) {
      console.error('页面打开失败:', error)
    }
  }
}

const handleUserActivity = () => {
  const path = ROUTE_MAP['用户活动']
  if (path) {
    try {
      window.open(path, '_blank')
    } catch (error) {
      console.error('页面打开失败:', error)
    }
  }
}
</script>

<style scoped>
.system-page {
  width: 100%;
  padding: 1.5%;
}

.system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.system-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  cursor: pointer;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.system-card {
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

.system-card:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.system-icon {
  font-size: 32px;
}

.system-name {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 8px;
  color: #333;
  width: 100%;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

/* 模态框中的按钮样式 */
.modal-system-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.modal-system-card {
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

.modal-system-card:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.modal-system-icon {
  font-size: 32px;
}

.modal-system-name {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 8px;
  color: #333;
  width: 100%;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .modal-system-card {
    width: 60px;
  }
  
  .modal-system-icon {
    font-size: 28px;
  }
  
  .modal-system-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .modal-system-card {
    width: 56px;
  }
  
  .modal-system-icon {
    font-size: 24px;
  }
  
  .modal-system-name {
    font-size: 12px;
  }
}

@media (max-width: 1200px) {
  .system-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .system-page {
    padding: 16px;
  }
  
  .system-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 20px;
  }
  
  .system-card {
    width: 60px;
  }
  
  .system-icon {
    font-size: 28px;
  }
  
  .system-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .system-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 16px;
  }
  
  .system-card {
    width: 56px;
  }
  
  .system-icon {
    font-size: 24px;
  }
  
  .system-name {
    font-size: 12px;
  }
}
</style>