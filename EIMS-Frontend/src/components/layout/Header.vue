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
        <a-menu-item key="platform" @click="navigateTo('/platform')">平台</a-menu-item>
        <a-menu-item key="app" @click="navigateTo('/application')">应用</a-menu-item>
        <a-menu-item key="management" @click="navigateTo('/management')">管理</a-menu-item>
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
            <a-menu-item key="profile">
              <UserOutlined />
              <span>个人中心</span>
            </a-menu-item>
            <a-menu-item key="password">
              <LockOutlined />
              <span>修改密码</span>
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
import { BellOutlined, DownOutlined, UpOutlined, UserOutlined, LockOutlined, LogoutOutlined, UsergroupAddOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const isDropdownVisible = ref(false)

// 计算当前选中的菜单项
const selectedKey = computed(() => {
  const path = route.path
  if (path === '/home' || path === '/') return 'home'
  if (path === '/platform') return 'platform'
  if (path === '/application') return 'app'
  if (path === '/help') return 'help-center'
  if (path === '/contacts') return 'contacts'
  if (path === '/system/notification/message') return 'message-center'
  if (path === '/management' || path.startsWith('/system')) return 'management'
  return ''
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
  font-size: 24px;
  font-weight: 600;
}

.nav-menu {
  border-bottom: none;
  font-size: 16px; /* 调整这里的字体大小 */
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