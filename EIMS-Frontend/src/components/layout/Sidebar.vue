<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo">EIMS</h1>
    </div>
    <nav class="sidebar-menu">
      <router-link to="/home" class="menu-item">
        <span class="menu-icon">🏠</span>
        <span class="menu-text">首页</span>
      </router-link>
      <router-link to="/tools" class="menu-item">
        <span class="menu-icon">🔧</span>
        <span class="menu-text">工具中心</span>
      </router-link>
      <router-link to="/application" class="menu-item">
        <span class="menu-icon">📱</span>
        <span class="menu-text">应用管理</span>
      </router-link>
      <div class="menu-item has-submenu">
        <span class="menu-icon">⚙️</span>
        <span class="menu-text">系统管理</span>
        <div class="submenu">
          <router-link to="/system/user" class="submenu-item">用户管理</router-link>
          <router-link to="/system/role" class="submenu-item">角色管理</router-link>
          <router-link to="/system/config/basic" class="submenu-item">系统配置</router-link>
          <router-link to="/system/log/operation" class="submenu-item">日志管理</router-link>
          <router-link to="/system/backup/list" class="submenu-item">数据备份</router-link>
          <router-link to="/system/monitor/system" class="submenu-item">系统监控</router-link>
          <router-link to="/system/notification/system" class="submenu-item">通知管理</router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// 侧边栏组件
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #002140;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.router-link-active {
    color: #1890ff;
    background-color: rgba(24, 144, 255, 0.1);
  }
}

.menu-icon {
  margin-right: 12px;
  font-size: 16px;
}

.has-submenu {
  position: relative;
  
  .submenu {
    display: none;
    background-color: #000c17;
    
    .submenu-item {
      display: block;
      padding: 10px 20px 10px 48px;
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      transition: all 0.3s;
      
      &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      &.router-link-active {
        color: #1890ff;
        background-color: rgba(24, 144, 255, 0.1);
      }
    }
  }
  
  &:hover .submenu {
    display: block;
  }
}
</style>