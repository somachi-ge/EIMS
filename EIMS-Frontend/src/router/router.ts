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
    component: () => import('../views/auth/Login.vue')
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/tools/Tools.vue')
  },
  {
    path: '/application',
    name: 'Application',
    component: () => import('../views/application/Application.vue')
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('../views/system/System.vue'),
    children: [
      {
        path: 'user',
        name: 'UserList',
        component: () => import('../views/system/user/UserList.vue')
      },
      {
        path: 'role',
        name: 'RoleList',
        component: () => import('../views/system/role/RoleList.vue')
      },
      {
        path: 'role/permission/:id',
        name: 'PermissionAssign',
        component: () => import('../views/system/role/PermissionList.vue')
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
            path: 'log/login',
            name: 'LoginLog',
            component: () => import('../views/system/log/LoginLog.vue')
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
        path: 'notification/message',
        name: 'MessageCenter',
        component: () => import('../views/system/notification/MessageCenter.vue')
      },
      {
        path: 'organization/organizationadmin',
        name: 'OrganizationAdmin',
        component: () => import('../views/system/organization/OrganizationAdmin.vue')
      },
      {
        path: 'organization/organizationchart',
        name: 'OrganizationChart',
        component: () => import('../views/system/organization/OrganizationChart.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/system/profile/Profile.vue')
      },
      {
        path: 'monitor',
        redirect: 'monitor/system'
      },
    ]
  },
  {
    path: '/help',
    name: 'HelpCenter',
    component: () => import('../views/help/HelpCenter.vue')
  },
  {
    path: '/contacts',
    name: 'ContactList',
    component: () => import('../views/contacts/ContactList.vue')
  },
  {
    path: '/error/403',
    name: 'Forbidden',
    component: () => import('../views/error/Forbidden.vue')
  },
  {
    path: '/error/500',
    name: 'ServerError',
    component: () => import('../views/error/ServerError.vue')
  },
  {
    path: '/error/503',
    name: 'ServiceUnavailable',
    component: () => import('../views/error/ServiceUnavailable.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/error/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router