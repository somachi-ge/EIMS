# EIMS移动端开发环境

## 一、移动端技术栈
| 技术/框架      | 版本               | 用途                                          |
| ---------- | ---------------- | ------------------------------------------- |
| Uni-app    | 3.0.0-5000420260318001 | 跨平台移动端开发框架，支持一次开发多端部署（iOS、Android、Web、小程序等） |
| Vue 3      | 3.5.30           | 前端渐进式框架，提供响应式数据绑定和组件化开发                     |
| TypeScript | 5.9.3            | 静态类型检查，提高代码质量和可维护性                          |
| Pinia      | 2.1.7            | 轻量级状态管理库，Vue 3 官方推荐                         |
| dayjs      | 1.11.20          | 轻量级日期处理库                                    |
| uuid       | 13.0.0           | 生成唯一标识符                                     |
| vue-i18n   | 11.3.0           | 国际化支持库                                      |
| sass       | 1.70.0           | CSS预处理器                                     |
| vite       | 5.2.8            | 构建工具                                        |
| vue-tsc    | 3.2.6            | Vue TypeScript 类型检查工具                         |
| @vue/devtools-api | 8.1.0       | Vue 开发工具API                                  |
## 二、项目结构
```
EIMS-Mobile/                                    # 项目根目录
├── src/                                        # 源代码目录
│   ├── components/                             # 公共组件
│   │   ├── auth/                               # 认证相关组件
│   │   │   ├── login-form.vue                  # 登录表单组件
│   │   │   ├── gesture-lock.vue                # 手势密码组件
│   │   │   └── fingerprint-login.vue           # 指纹登录组件
│   │   ├── user/                               # 用户相关组件
│   │   │   ├── user-info.vue                   # 用户信息展示组件
│   │   │   ├── avatar-upload.vue               # 头像上传组件
│   │   │   └── contact-item.vue                # 联系方式项组件
│   │   ├── message/                            # 消息相关组件
│   │   │   ├── message-list.vue                # 消息列表组件
│   │   │   ├── message-item.vue                # 消息项组件
│   │   │   └── notification-badge.vue          # 通知徽章组件
│   │   ├── app/                                # 应用相关组件
│   │   │   ├── app-list.vue                    # 应用列表组件
│   │   │   ├── app-item.vue                    # 应用项组件
│   │   │   └── app-card.vue                    # 应用卡片组件
│   │   ├── platform/                           # 平台相关组件
│   │   │   ├── platform-card.vue               # 平台卡片组件
│   │   │   └── platform-item.vue               # 平台项组件
│   │   └── common/                             # 通用组件
│   │       ├── loading.vue                     # 加载组件
│   │       ├── toast.vue                       # 提示组件
│   │       ├── dialog.vue                      # 对话框组件
│   │       └── empty.vue                       # 空状态组件
│   ├── pages/                                  # 页面文件
│   │   ├── auth/                               # 认证页面
│   │   │   ├── login.vue                       # 登录页面，支持账号密码登录、手势密码登录、指纹登录
│   │   │   ├── register.vue                    # 注册页面
│   │   │   └── forget-password.vue             # 忘记密码页面
│   │   ├── home/                               # 首页相关页面
│   │   │   ├── index.vue                       # 首页，展示主要功能入口和信息
│   │   │   ├── dashboard.vue                   # 数据仪表盘页面
│   │   │   └── quick-actions.vue               # 快捷操作页面
│   │   ├── application/                        # 应用页面
│   │   │   └── application.vue                 # 应用页面
│   │   ├── platform/                           # 平台页面
│   │   │   └── platform.vue                    # 平台页面
│   │   ├── system/                             # 系统页面目录
│   │   │   ├── system.vue                      # 系统首页
│   │   │   ├── user/                           # 用户中心
│   │   │   │   ├── index.vue                   # 用户中心首页，显示个人信息
│   │   │   │   ├── profile.vue                 # 个人资料编辑页面
│   │   │   │   ├── avatar.vue                  # 头像上传页面
│   │   │   │   └── password.vue                # 密码修改页面
│   │   │   ├── message/                        # 消息中心
│   │   │   │   ├── index.vue                   # 消息中心首页，分类显示消息
│   │   │   │   ├── detail.vue                  # 消息详情页面
│   │   │   │   └── notification-settings.vue   # 通知设置页面
│   │   │   └── sysinfo/                        # 系统相关页面
│   │   │       ├── about.vue                   # 关于页面
│   │   │       ├── feedback.vue                # 意见反馈页面
│   │   │       └── help.vue                    # 帮助中心页面
│   ├── static/                                 # 静态资源
│   │   ├── image/                              # 图片资源
│   │   ├── icon/                               # 图标资源
│   │   ├── font/                               # 字体资源
│   │   └── logo.png                            # Logo图片
│   ├── store/                                  # 状态管理
│   │   ├── modules/                            # 模块化状态
│   │   │   ├── user.ts                         # 用户状态，管理用户信息、登录状态、权限等
│   │   │   ├── message.ts                      # 消息状态，管理消息列表、未读消息数等
│   │   │   ├── application.ts                  # 应用状态，管理应用列表、应用状态等
│   │   │   ├── platform.ts                     # 平台状态，管理平台信息、平台状态等
│   │   │   └── system.ts                       # 系统状态，管理系统配置、通知设置等
│   │   └── index.ts                            # 状态管理入口
│   ├── services/                               # 服务层
│   │   ├── api/                                # API 接口
│   │   │   ├── user.ts                         # 用户相关接口
│   │   │   ├── message.ts                      # 消息相关接口
│   │   │   ├── application.ts                  # 应用相关接口
│   │   │   ├── platform.ts                     # 平台相关接口
│   │   │   └── system.ts                       # 系统相关接口
│   │   └── utils/                              # 工具函数
│   │       ├── request.ts                      # 封装网络请求
│   │       └── response.ts                     # 处理响应数据
│   ├── utils/                                  # 通用工具
│   │   ├── storage.ts                          # 存储工具
│   │   ├── encryption.ts                       # 加密工具
│   │   └── validator.ts                        # 验证工具
│   ├── config/                                 # 配置文件
│   │   ├── api.ts                              # API 配置，配置 API 基础路径、接口地址等
│   │   ├── app.ts                              # 应用配置，配置应用名称、版本号、主题等
│   │   └── env.ts                              # 环境配置，配置不同环境的参数
│   ├── App.vue                                 # 应用入口组件
│   ├── main.ts                                 # 应用入口文件
│   ├── env.d.ts                                # Vite环境类型声明文件
│   ├── manifest.json                           # 应用配置文件
│   ├── pages.json                              # 页面路由配置
│   ├── shime-uni.d.ts                          # Uni-app类型声明文件
│   └── uni.scss                                # Uni-app内置样式变量
├── .gitignore                                  # Git忽略文件配置
├── index.html                                  # 应用入口HTML文件
├── package.json                                # 项目配置文件，定义依赖和脚本
├── pnpm-lock.yaml                              # pnpm依赖锁文件
├── shims-uni.d.ts                              # TypeScript类型声明文件
├── tsconfig.json                               # TypeScript配置文件
└── vite.config.ts                              # Vite构建工具配置
```