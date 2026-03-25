<template>
  <a-layout-header class="header">
    <div class="header-left">
      <div class="logo">
        <div class="logo-link" @click="navigateTo('/home')">
          <img src="../../assets/icons/logo_color.svg" alt="星珩·企业综合管理系统" class="logo-icon" />
          <span class="logo-text">星珩·企业综合管理系统</span>
        </div>
      </div>
      <a-menu
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
        class="nav-menu"
        :selected-keys="[selectedKey]"
      >
        <a-menu-item key="home" @click="navigateTo('/home')">首页</a-menu-item>
        <a-menu-item key="application" @click="navigateTo('/application')">应用</a-menu-item>
        <a-menu-item key="tools" @click="navigateTo('/tools')">工具</a-menu-item>
        <a-menu-item key="management" @click="navigateTo('/management')">管理</a-menu-item>
        <template v-if="isCodingRulePage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="coding-rule" @click="navigateTo('/coding-rule')">编码规则</a-menu-item>
        </template>
        <template v-if="isProfilePage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="profile" @click="navigateTo('/system/profile')">个人中心</a-menu-item>
        </template>
        <template v-if="isUserListPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="user-list" @click="navigateTo('/system/user')">用户管理</a-menu-item>
        </template>
        <template v-if="isRoleListPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="role-list" @click="navigateTo('/system/role')">角色管理</a-menu-item>
        </template>
        <template v-if="isPermissionListPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="permission-list" @click="navigateTo('/system/role/permission/1')">权限管理</a-menu-item>
        </template>
        <template v-if="isLogAnalysisPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="log-analysis" @click="navigateTo('/system/log/analysis')">日志分析</a-menu-item>
        </template>
        <template v-if="isOperationLogPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="operation-log" @click="navigateTo('/system/log/operation')">操作日志</a-menu-item>
        </template>
        <template v-if="isSystemLogPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="system-log" @click="navigateTo('/system/log/system')">系统日志</a-menu-item>
        </template>
        <template v-if="isLoginLogPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="login-log" @click="navigateTo('/system/log/login')">登录日志</a-menu-item>
        </template>
        <template v-if="isBackupListPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="backup-list" @click="navigateTo('/system/backup/list')">备份列表</a-menu-item>
        </template>
        <template v-if="isRestoreDataPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="restore-data" @click="navigateTo('/system/backup/restore')">恢复数据</a-menu-item>
        </template>
        <template v-if="isHelpCenterPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="help-center" @click="navigateTo('/help')">帮助中心</a-menu-item>
        </template>
        <template v-if="isContactsPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="contacts" @click="navigateTo('/contacts')">通讯录</a-menu-item>
        </template>
        <template v-if="isMessageCenterPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="message-center" @click="navigateTo('/system/notification/message')">消息中心</a-menu-item>
        </template>
        <template v-if="isOrganizationAdminPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="organization-admin" @click="navigateTo('/system/organization/organizationadmin')">架构管理</a-menu-item>
        </template>
        <template v-if="isOrganizationChartPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="organization-chart" @click="navigateTo('/system/organization/organizationchart')">组织架构</a-menu-item>
        </template>
        <template v-if="isBasicConfigPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="basic-config" @click="navigateTo('/system/config/basic')">基础配置</a-menu-item>
        </template>
        <template v-if="isEmailConfigPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="email-config" @click="navigateTo('/system/config/email')">邮件配置</a-menu-item>
        </template>
        <template v-if="isNotificationConfigPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="notification-config" @click="navigateTo('/system/config/notification')">通知配置</a-menu-item>
        </template>
        <template v-if="isSystemMonitorPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="system-monitor" @click="navigateTo('/system/monitor/system')">系统监控</a-menu-item>
        </template>
        <template v-if="isServiceMonitorPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="service-monitor" @click="navigateTo('/system/monitor/service')">服务监控</a-menu-item>
        </template>
        <template v-if="isUserActivityPage">
          <a-menu-item class="nav-divider">|</a-menu-item>
          <a-menu-item key="user-activity" @click="navigateTo('/system/monitor/user')">用户活动</a-menu-item>
        </template>
      </a-menu>
    </div>
    <div class="header-right">
      <a-tooltip title="消息通知">
        <a-button type="text" class="action-btn" @click="navigateTo('/system/notification/message')">
          <BellOutlined />
        </a-button>
      </a-tooltip>
      <a-tooltip title="通讯录">
        <a-button type="text" class="action-btn" @click="navigateTo('/contacts')">
          <UsergroupAddOutlined />
        </a-button>
      </a-tooltip>
      <a-dropdown trigger="click" @visibleChange="handleDropdownVisibleChange">
        <a class="user-menu" href="#">
          <img src="../../assets/images/chongzhi.zu.png" alt="祖冲之" class="user-avatar" />
          <span class="user-name">祖冲之</span>
          <component :is="isDropdownVisible ? UpOutlined : DownOutlined" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile" @click="navigateTo('/system/profile')">
              <UserOutlined />
              <span>个人中心</span>
            </a-menu-item>
            <a-menu-item key="help" @click="navigateTo('/help')">
              <QuestionCircleOutlined />
              <span>帮助中心</span>
            </a-menu-item>
            <a-menu-item key="logout">
              <LogoutOutlined />
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BellOutlined, DownOutlined, UpOutlined, UserOutlined, LogoutOutlined, UsergroupAddOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const isDropdownVisible = ref(false)

// 计算当前选中的菜单项
const selectedKey = computed(() => {
  const path = route.path
  if (path === '/home' || path === '/') return 'home'
  if (path === '/application') return 'application'
  if (path === '/tools') return 'tools'
  if (path === '/help') return 'help-center'
  if (path === '/contacts') return 'contacts'
  if (path === '/system/notification/message') return 'message-center'
  if (path === '/system/log/analysis') return 'log-analysis'
  if (path === '/system/log/operation') return 'operation-log'
  if (path === '/system/log/system') return 'system-log'
  if (path === '/system/log/login') return 'login-log'
  if (path === '/system/backup/list') return 'backup-list'
  if (path === '/system/backup/restore') return 'restore-data'
  if (path === '/system/user') return 'user-list'
  if (path === '/system/role') return 'role-list'
  if (path.startsWith('/system/role/permission/')) return 'permission-list'
  if (path === '/system/organization/organizationadmin') return 'organization-admin'
  if (path === '/system/organization/organizationchart') return 'organization-chart'
  if (path === '/system/profile') return 'profile'
  if (path === '/system/config/basic') return 'basic-config'
  if (path === '/system/config/email') return 'email-config'
  if (path === '/system/config/notification') return 'notification-config'
  if (path === '/system/monitor/system') return 'system-monitor'
  if (path === '/system/monitor/service') return 'service-monitor'
  if (path === '/system/monitor/user') return 'user-activity'
  if (path === '/management' || path.startsWith('/system')) return 'management'
  if (path === '/coding-rule') return 'coding-rule'
  return ''
})

// 判断是否在编码规则页面
const isCodingRulePage = computed(() => {
  return route.path === '/coding-rule'
})

// 判断是否在帮助中心页面
const isHelpCenterPage = computed(() => {
  return route.path === '/help'
})

// 判断是否在通讯录页面
const isContactsPage = computed(() => {
  return route.path === '/contacts'
})

// 判断是否在消息中心页面
const isMessageCenterPage = computed(() => {
  return route.path === '/system/notification/message'
})

// 判断是否在日志分析页面
const isLogAnalysisPage = computed(() => {
  return route.path === '/system/log/analysis'
})

// 判断是否在操作日志页面
const isOperationLogPage = computed(() => {
  return route.path === '/system/log/operation'
})

// 判断是否在系统日志页面
const isSystemLogPage = computed(() => {
  return route.path === '/system/log/system'
})

// 判断是否在登录日志页面
const isLoginLogPage = computed(() => {
  return route.path === '/system/log/login'
})

// 判断是否在备份列表页面
const isBackupListPage = computed(() => {
  return route.path === '/system/backup/list'
})

// 判断是否在恢复数据页面
const isRestoreDataPage = computed(() => {
  return route.path === '/system/backup/restore'
})

// 判断是否在用户列表页面
const isUserListPage = computed(() => {
  return route.path === '/system/user'
})

// 判断是否在角色列表页面
const isRoleListPage = computed(() => {
  return route.path === '/system/role'
})

// 判断是否在权限列表页面
const isPermissionListPage = computed(() => {
  return route.path.startsWith('/system/role/permission/')
})

// 判断是否在组织管理页面
const isOrganizationAdminPage = computed(() => {
  return route.path === '/system/organization/organizationadmin'
})

// 判断是否在组织架构页面
const isOrganizationChartPage = computed(() => {
  return route.path === '/system/organization/organizationchart'
})

// 判断是否在个人中心页面
const isProfilePage = computed(() => {
  return route.path === '/system/profile'
})

// 判断是否在基础配置页面
const isBasicConfigPage = computed(() => {
  return route.path === '/system/config/basic'
})

// 判断是否在邮件配置页面
const isEmailConfigPage = computed(() => {
  return route.path === '/system/config/email'
})

// 判断是否在通知配置页面
const isNotificationConfigPage = computed(() => {
  return route.path === '/system/config/notification'
})

// 判断是否在系统监控页面
const isSystemMonitorPage = computed(() => {
  return route.path === '/system/monitor/system'
})

// 判断是否在服务监控页面
const isServiceMonitorPage = computed(() => {
  return route.path === '/system/monitor/service'
})

// 判断是否在用户活动页面
const isUserActivityPage = computed(() => {
  return route.path === '/system/monitor/user'
})

// 导航到指定路由
const navigateTo = (path: string) => {
  router.push(path)
}

const handleDropdownVisibleChange = (visible: boolean) => {
  isDropdownVisible.value = visible
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.logo {
  margin-right: 16px;
}

.logo-link {
  display: flex;
  align-items: center;
  color: #1890ff;
}

.logo-icon {
  width: 44px;
  height: 44px;
  margin-right: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
}

.nav-menu {
  border-bottom: none;
  font-size: 16px; /* 调整这里的字体大小 */
  flex: 1;
  min-width: 0;
}

.nav-divider {
  pointer-events: none;
  color: #d9d9d9;
  margin: 0 8px;
}

.header-right {
  display: flex;
  align-items: center;
}

.action-btn {
  margin-right: 8px;
  font-size: 20px;
  
  &:hover {
    background-color: transparent !important;
    color: #1890ff !important;
  }
}

.user-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
  padding: 0 8px;
  height: 64px;
  line-height: 64px;
  text-decoration: none;
  
  &:hover {
    color: #1890ff;
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.user-name {
  margin-right: 4px;
  font-size: 16px;
  text-decoration: none;
}
</style>