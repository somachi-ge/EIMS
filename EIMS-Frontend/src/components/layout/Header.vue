<template>
  <header class="header">
    <div class="header-left">
      <button class="menu-toggle" @click="toggleMenu">
        ☰
      </button>
    </div>
    <div class="header-right">
      <div class="header-actions">
        <button class="action-btn">
          🔔
        </button>
        <button class="action-btn">
          ⚙️
        </button>
        <div class="user-menu">
          <span class="user-name">管理员</span>
          <div class="user-dropdown">
            <a href="#">个人中心</a>
            <a href="#">修改密码</a>
            <a href="#">退出登录</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const toggleMenu = () => {
  // 切换菜单逻辑
  console.log('Toggle menu')
}
</script>

<style scoped>
.header {
  height: 64px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: 20px;
  color: #666;
  
  &:hover {
    color: #1890ff;
  }
}

.user-menu {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  .user-name {
    margin-right: 8px;
    color: #333;
  }
  
  .user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 8px 0;
    min-width: 120px;
    display: none;
    z-index: 1000;
    
    a {
      display: block;
      padding: 8px 16px;
      color: #333;
      text-decoration: none;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f5f5f5;
        color: #1890ff;
      }
    }
  }
  
  &:hover .user-dropdown {
    display: block;
  }
}
</style>