# EIMS前端开发环境

## 一、前端技术栈

| 技术/框架             | 版本       | 用途                              |
| ----------------- | -------- | ------------------------------- |
| Vue 3             | 3.5.28+  | 采用组合式API，提供更好的TypeScript支持和性能优化 |
| Ant Design Vue    | 4.2.6+   | 企业级UI组件库，提供丰富的表单、表格、弹窗等组件       |
| Vite              | 8.0.1+   | 现代前端构建工具，提供快速的开发体验和优化的生产构建      |
| TypeScript        | 5.9.3+   | 静态类型检查，提高代码质量和开发效率              |
| Responsive Design | -        | 响应式设计，确保在不同屏幕尺寸下的良好显示效果         |
| Vue Router        | 5.0.3+   | 路由管理，实现页面之间的导航                  |
| Pinia             | 3.0.4+   | 状态管理，替代Vuex，提供更简洁的API           |
| Axios             | 1.13.5+  | HTTP客户端，用于与后端API通信              |
| ESLint            | 10.0.1+  | 代码质量检查工具，确保代码风格一致性              |
| Prettier          | 3.8.1+   | 代码格式化工具，保持代码格式统一                |
| ECharts           | 6.0.0+   | 数据可视化图表库，用于展示各种数据图表             |
| Day.js            | 1.11.19+ | 轻量级日期处理库，用于日期格式化和计算             |
| SCSS              | 1.97.3+  | CSS预处理器，提供变量、嵌套、混合等高级特性         |
## 二、项目结构
```
EIMS-Frontend/                               # 项目根目录
├── public/                                  # 静态资源目录
├── src/                                     # 源代码目录
│   ├── assets/                              # 资源文件（图片、图标等）
│   │   ├── fonts/                           # 字体文件
│   │   ├── icons/                           # 图标文件
│   │   ├── images/                          # 图片文件
│   │   └── styles/                          # 样式文件
│   ├── components/                          # 通用组件
│   │   ├── layout/                          # 布局组件
│   │   │   ├── AppLayout.vue                # 应用布局组件
│   │   │   ├── MainLayout.vue               # 主布局组件
│   │   │   ├── Sidebar.vue                  # 侧边栏组件
│   │   │   ├── Header.vue                   # 头部组件
│   │   │   └── Breadcrumb.vue               # 面包屑组件
│   │   ├── common/                          # 通用组件
│   │   │   ├── TablePagination.vue          # 表格分页组件
│   │   │   ├── FormModal.vue                # 表单模态框组件
│   │   │   ├── ConfirmDialog.vue            # 确认对话框组件
│   │   │   └── Notification.vue             # 通知组件
│   │   └── system/                          # 系统相关组件
│   │       ├── UserForm.vue                 # 用户表单组件
│   │       ├── RoleForm.vue                 # 角色表单组件
│   │       ├── DepartmentForm.vue           # 部门表单组件
│   │       └── PermissionTree.vue           # 权限树组件
│   ├── views/                               # 页面组件
│   │   ├── application/                     # 应用管理
│   │   │   └── application.vue              # 应用管理页面
│   │   ├── auth/                            # 认证管理
│   │   │   └── login.vue                    # 登录页面
│   │   ├── platform/                        # 平台管理
│   │   │   └── platform.vue                 # 平台管理页面
│   │   ├── home/                            # 首页
│   │   │   └── index.vue                    # 首页页面
│   │   └── system/                          # 系统管理
│   │       ├── system.vue                   # 系统管理主页面
│   │       ├── user/                        # 用户管理
│   │       │   ├── UserList.vue             # 用户列表页面
│   │       │   ├── UserAdd.vue              # 添加用户页面
│   │       │   ├── UserEdit.vue             # 编辑用户页面
│   │       │   └── UserDetail.vue           # 用户详情页面
│   │       ├── role/                        # 角色权限管理
│   │       │   ├── RoleList.vue             # 角色列表页面
│   │       │   ├── RoleAdd.vue              # 添加角色页面
│   │       │   ├── RoleEdit.vue             # 编辑角色页面
│   │       │   └── PermissionAssign.vue     # 权限分配页面
│   │       ├── department/                  # 部门管理
│   │       │   ├── DepartmentList.vue       # 部门列表页面
│   │       │   ├── DepartmentAdd.vue        # 添加部门页面
│   │       │   └── DepartmentEdit.vue       # 编辑部门页面
│   │       ├── config/                      # 系统配置
│   │       │   ├── BasicConfig.vue          # 基础配置页面
│   │       │   ├── EmailConfig.vue          # 邮件配置页面
│   │       │   └── NotificationConfig.vue   # 通知配置页面
│   │       ├── log/                         # 日志管理
│   │       │   ├── OperationLog.vue         # 操作日志页面
│   │       │   ├── SystemLog.vue            # 系统日志页面
│   │       │   └── LogAnalysis.vue          # 日志分析页面
│   │       ├── backup/                      # 数据备份与恢复
│   │       │   ├── BackupConfig.vue         # 备份配置页面
│   │       │   ├── BackupList.vue           # 备份列表页面
│   │       │   └── RestoreData.vue          # 数据恢复页面
│   │       ├── monitor/                     # 系统监控
│   │       │   ├── SystemMonitor.vue        # 系统监控页面
│   │       │   ├── ServiceMonitor.vue       # 服务监控页面
│   │       │   └── UserActivity.vue         # 用户活动页面
│   │       └── notification/                # 通知管理
│   │           ├── SystemNotification.vue   # 系统通知页面
│   │           └── MessageCenter.vue        # 消息中心页面
│   ├── router/                              # 路由配置
│   │   └── router.ts                        # 路由配置文件
│   ├── stores/                              # Pinia状态管理
│   │   ├── user.ts                          # 用户相关状态
│   │   ├── role.ts                          # 角色相关状态
│   │   ├── department.ts                    # 部门相关状态
│   │   ├── config.ts                        # 系统配置状态
│   │   ├── log.ts                           # 日志相关状态
│   │   ├── backup.ts                        # 备份相关状态
│   │   ├── monitor.ts                       # 监控相关状态
│   │   └── notification.ts                  # 通知相关状态
│   ├── services/                            # API服务
│   │   ├── api/                             # API接口
│   │   │   ├── user.ts                      # 用户API
│   │   │   ├── role.ts                      # 角色API
│   │   │   ├── department.ts                # 部门API
│   │   │   ├── config.ts                    # 配置API
│   │   │   ├── log.ts                       # 日志API
│   │   │   ├── backup.ts                    # 备份API
│   │   │   ├── monitor.ts                   # 监控API
│   │   │   └── notification.ts              # 通知API
│   │   ├── request.ts                       # Axios请求配置
│   │   └── interceptors.ts                  # 请求拦截器
│   ├── utils/                               # 工具函数
│   │   ├── auth.ts                          # 认证相关
│   │   ├── storage.ts                       # 存储相关
│   │   ├── validator.ts                     # 验证相关
│   │   ├── formatter.ts                     # 格式化相关
│   │   └── http.ts                          # HTTP相关
│   ├── hooks/                               # 自定义Hooks
│   ├── styles/                              # 全局样式
│   │   └── global.scss                      # 全局样式文件
│   ├── types/                               # TypeScript类型定义
│   ├── App.vue                              # 根组件
│   └── main.ts                              # 入口文件
├── .eslintrc.js                             # ESLint配置
├── .prettierrc.js                           # Prettier配置
├── index.html                               # HTML模板
├── package.json                             # 项目依赖
├── tsconfig.json                            # TypeScript配置
├── vite.config.ts                           # Vite配置
└── README.md                                # 项目说明
```
