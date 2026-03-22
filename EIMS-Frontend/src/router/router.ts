import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/management',
    redirect: '/system'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/login.vue')
  },
  {
    path: '/application',
    name: 'Application',
    component: () => import('../views/application/application.vue')
  },
  {
    path: '/platform',
    name: 'Platform',
    component: () => import('../views/platform/platform.vue')
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('../views/system/system.vue'),
    children: [
      {
        path: 'user',
        name: 'UserList',
        component: () => import('../views/system/user/UserList.vue')
      },
      {
        path: 'user/add',
        name: 'UserAdd',
        component: () => import('../views/system/user/UserAdd.vue')
      },
      {
        path: 'user/edit/:id',
        name: 'UserEdit',
        component: () => import('../views/system/user/UserEdit.vue')
      },
      {
        path: 'user/detail/:id',
        name: 'UserDetail',
        component: () => import('../views/system/user/UserDetail.vue')
      },
      {
        path: 'role',
        name: 'RoleList',
        component: () => import('../views/system/role/RoleList.vue')
      },
      {
        path: 'role/add',
        name: 'RoleAdd',
        component: () => import('../views/system/role/RoleAdd.vue')
      },
      {
        path: 'role/edit/:id',
        name: 'RoleEdit',
        component: () => import('../views/system/role/RoleEdit.vue')
      },
      {
        path: 'role/permission/:id',
        name: 'PermissionAssign',
        component: () => import('../views/system/role/PermissionAssign.vue')
      },
      {
        path: 'department',
        name: 'DepartmentList',
        component: () => import('../views/system/department/DepartmentList.vue')
      },
      {
        path: 'department/add',
        name: 'DepartmentAdd',
        component: () => import('../views/system/department/DepartmentAdd.vue')
      },
      {
        path: 'department/edit/:id',
        name: 'DepartmentEdit',
        component: () => import('../views/system/department/DepartmentEdit.vue')
      },
      {
        path: 'config/basic',
        name: 'BasicConfig',
        component: () => import('../views/system/config/BasicConfig.vue')
      },
      {
        path: 'config/email',
        name: 'EmailConfig',
        component: () => import('../views/system/config/EmailConfig.vue')
      },
      {
        path: 'config/notification',
        name: 'NotificationConfig',
        component: () => import('../views/system/config/NotificationConfig.vue')
      },
      {
        path: 'log/operation',
        name: 'OperationLog',
        component: () => import('../views/system/log/OperationLog.vue')
      },
      {
        path: 'log/system',
        name: 'SystemLog',
        component: () => import('../views/system/log/SystemLog.vue')
      },
      {
        path: 'log/analysis',
        name: 'LogAnalysis',
        component: () => import('../views/system/log/LogAnalysis.vue')
      },
      {
        path: 'backup/config',
        name: 'BackupConfig',
        component: () => import('../views/system/backup/BackupConfig.vue')
      },
      {
        path: 'backup/list',
        name: 'BackupList',
        component: () => import('../views/system/backup/BackupList.vue')
      },
      {
        path: 'backup/restore',
        name: 'RestoreData',
        component: () => import('../views/system/backup/RestoreData.vue')
      },
      {
        path: 'monitor/system',
        name: 'SystemMonitor',
        component: () => import('../views/system/monitor/SystemMonitor.vue')
      },
      {
        path: 'monitor/service',
        name: 'ServiceMonitor',
        component: () => import('../views/system/monitor/ServiceMonitor.vue')
      },
      {
        path: 'monitor/user',
        name: 'UserActivity',
        component: () => import('../views/system/monitor/UserActivity.vue')
      },
      {
        path: 'notification/system',
        name: 'SystemNotification',
        component: () => import('../views/system/notification/SystemNotification.vue')
      },
      {
        path: 'notification/message',
        name: 'MessageCenter',
        component: () => import('../views/system/notification/MessageCenter.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router