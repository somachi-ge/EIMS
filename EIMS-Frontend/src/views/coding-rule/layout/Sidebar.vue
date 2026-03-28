<template>
  <div class="sidebar" :class="{ 'collapsed': collapsed }">
    <a-menu
      mode="inline"
      :open-keys="openKeys"
      :selected-keys="selectedKeys"
      @open-change="handleOpenChange"
      @select="handleSelect"
      class="sidebar-menu"
      :inline-collapsed="collapsed"
    >
      <a-menu-item key="dashboard">
        <template #icon><DashboardOutlined /></template>
        <span>编码概览</span>
      </a-menu-item>
      <a-sub-menu key="rule">
        <template #title>
          <span>
            <UnorderedListOutlined />
            <span>规则管理</span>
          </span>
        </template>
        <a-menu-item key="rule-list">规则列表</a-menu-item>
        <a-menu-item key="rule-add">新增规则</a-menu-item>
        <a-menu-item key="rule-import-export">导入导出</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="coding">
        <template #title>
          <span>
            <CodeOutlined />
            <span>编码管理</span>
          </span>
        </template>
        <a-menu-item key="coding-generate">编码生成</a-menu-item>
        <a-menu-item key="coding-complement">编码补号</a-menu-item>
        <a-menu-item key="coding-bind">绑定解绑</a-menu-item>
        <a-menu-item key="coding-recovery">作废恢复</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="parse">
        <template #title>
          <span>
            <SearchOutlined />
            <span>编码解析</span>
          </span>
        </template>
        <a-menu-item key="parse-single">编码解析</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="log">
        <template #title>
          <span>
            <FileTextOutlined />
            <span>日志管理</span>
          </span>
        </template>
        <a-menu-item key="log-list">操作日志</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="setting">
        <template #title>
          <span>
            <SettingOutlined />
            <span>系统管理</span>
          </span>
        </template>
        <a-menu-item key="setting-system">通用设置</a-menu-item>
        <a-menu-item key="setting-integration">系统集成</a-menu-item>
        <a-menu-item key="setting-api">API接口</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="help">
        <template #title>
          <span>
            <QuestionCircleOutlined />
            <span>帮助反馈</span>
          </span>
        </template>
        <a-menu-item key="help-feedback">帮助反馈</a-menu-item>
      </a-sub-menu>
    </a-menu>
    
    <!-- 缩起/展开按钮 -->
    <div class="sidebar-toggle">
      <a-button 
        type="text" 
        @click="toggleSidebar"
        class="toggle-btn"
        :title="collapsed ? '展开' : '缩起'"
      >
        <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  DashboardOutlined,
  UnorderedListOutlined,
  CodeOutlined,
  SearchOutlined,
  FileTextOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();

// 菜单状态管理
const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>(['dashboard']);
const collapsed = ref(false);

// 路由映射表
const routeMap: Record<string, string> = {
  'dashboard': '/coding-rule',
  'rule-list': '/coding-rule/rule-management/list',
  'rule-add': '/coding-rule/rule-management/add',
  'rule-import-export': '/coding-rule/rule-management/import-export',
  'coding-generate': '/coding-rule/generator',
  'coding-complement': '/coding-rule/generator/complement',
  'coding-bind': '/coding-rule/generator/bind',
  'coding-recovery': '/coding-rule/generator/recovery',
  'parse-single': '/coding-rule/parse',
  'log-list': '/coding-rule/log',
  'setting-system': '/coding-rule/setting',
  'setting-integration': '/coding-rule/integration',
  'setting-api': '/coding-rule/api',
  'help-feedback': '/coding-rule/help'
};

// 根据当前路由设置选中状态
const updateSelectedKeys = () => {
    const currentPath = route.path;
    // 特殊处理规则编辑、详情页面，激活规则列表
    if (currentPath.startsWith('/coding-rule/rule-management/edit/') || currentPath.startsWith('/coding-rule/rule-management/detail/')) {
        selectedKeys.value = ['rule-list'];
        openKeys.value = ['rule'];
        return;
    }
    // 特殊处理新增规则页面，激活新增规则
    if (currentPath === '/coding-rule/rule-management/add') {
        selectedKeys.value = ['rule-add'];
        openKeys.value = ['rule'];
        return;
    }
    
    // 先按路径长度排序，确保更具体的路径优先匹配
    const sortedRouteMap = Object.entries(routeMap)
        .sort((a, b) => b[1].length - a[1].length);
    
    for (const [key, path] of sortedRouteMap) {
        // 移除路径末尾的斜杠，确保匹配更准确
        const normalizedCurrentPath = currentPath.replace(/\/$/, '');
        const normalizedPath = path.replace(/\/$/, '');
        
        if (normalizedCurrentPath === normalizedPath || normalizedCurrentPath.startsWith(normalizedPath + '/')) {
            selectedKeys.value = [key];
            // 如果是有子菜单的项，自动展开
            if (key.startsWith('rule')) {
                openKeys.value = ['rule'];
            } else if (key.startsWith('coding-')) {
                openKeys.value = ['coding'];
            } else if (key.startsWith('parse-')) {
                openKeys.value = ['parse'];
            } else if (key.startsWith('log-')) {
                openKeys.value = ['log'];
            } else if (key.startsWith('setting-')) {
                openKeys.value = ['setting'];
            } else if (key.startsWith('help-')) {
                openKeys.value = ['help'];
            }
            break;
        }
    }
};

// 初始化时设置选中状态
updateSelectedKeys();

// 监听路由变化
watch(() => route.path, updateSelectedKeys);

// 处理菜单展开/折叠
const handleOpenChange = (keys: string[]) => {
  openKeys.value = keys;
};

// 处理菜单选择
const handleSelect = ({ key }: { key: string }) => {
  selectedKeys.value = [key];
  const path = routeMap[key];
  if (path) {
    router.push(path);
  }
};

// 切换侧边栏展开/缩起
const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.09);
  overflow-y: auto;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-menu {
  height: calc(100% - 50px);
  border-right: none;
  padding: 16px 0;
}

/* 菜单样式优化 */
.sidebar-menu :deep(.ant-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 4px 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.sidebar-menu :deep(.ant-menu-item:not(.ant-menu-item-selected):hover) {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
}

.sidebar-menu :deep(.ant-menu-item-selected) {
  background-color: #1890ff !important;
  color: #fff !important;
}

.sidebar-menu :deep(.ant-menu-item-selected:hover) {
  background-color: #40a9ff !important;
  color: #fff !important;
}

/* 子菜单样式 */
.sidebar-menu :deep(.ant-menu-submenu-title) {
  height: 48px;
  line-height: 48px;
  margin: 4px 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.sidebar-menu :deep(.ant-menu-submenu-title:hover) {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
}

.sidebar-menu :deep(.ant-menu-submenu-title.ant-menu-item-selected) {
  background-color: #1890ff !important;
  color: #fff !important;
}

.sidebar-menu :deep(.ant-menu-submenu-title.ant-menu-item-selected:hover) {
  background-color: #40a9ff !important;
  color: #fff !important;
}

.sidebar-menu :deep(.ant-menu-sub) {
  background-color: #fafafa !important;
  margin: 0 8px;
  overflow: hidden;
}

.sidebar-menu :deep(.ant-menu-sub .ant-menu-item) {
  margin: 0;
  font-size: 13px;
  padding-left: 52px !important;
}

.sidebar-menu :deep(.ant-menu-sub .ant-menu-item:hover) {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
}

/* 图标样式 */
.sidebar-menu :deep(.anticon) {
  font-size: 18px;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.sidebar-menu :deep(.ant-menu-item-selected .anticon) {
  color: #fff !important;
}

/* 缩起/展开按钮 */
.sidebar-toggle {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e8e8e8;
  background-color: #fff;
}

.toggle-btn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 18px;
}

.toggle-btn:hover {
  background-color: #f0f0f0;
  color: #1890ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  
  .sidebar.collapsed {
    width: 64px;
  }
  
  .sidebar-menu :deep(.ant-menu-item) {
    height: 44px;
    line-height: 44px;
  }
  
  .sidebar-menu :deep(.ant-menu-submenu-title) {
    height: 44px;
    line-height: 44px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 180px;
  }
  
  .sidebar.collapsed {
    width: 64px;
  }
}
</style>