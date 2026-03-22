# EIMS企业综合管理系统移动端应用

## 项目简介

EIMS (Enterprise Integrated Management System) 企业综合管理系统移动端应用，基于 Uni-app + Vue 3 + TypeScript 开发，支持多端部署（H5、微信小程序、支付宝小程序等）。

## 技术栈

- **框架**: Uni-app 3.0.0+
- **前端**: Vue 3.5.30+, TypeScript 5.9.3+
- **状态管理**: Pinia 2.1.7+
- **工具库**: dayjs, uuid, vue-i18n
- **构建工具**: Vite 5.2.8
- **样式预处理器**: Sass 1.70.0

## 开发环境要求

- **Node.js**: 16.0.0 或更高版本
- **包管理工具**: pnpm 7.0.0 或更高版本
- **IDE**: Visual Studio Code (推荐)，安装 Vue 3 相关插件

## 安装与运行

### 1. 安装依赖

```bash
# 进入项目目录
cd EIMS-Mobile

# 使用 pnpm 安装依赖
pnpm install
```

### 2. 开发环境运行

#### H5 端

```bash
# 启动 H5 开发服务器
pnpm run dev:h5
```

#### 微信小程序端

```bash
# 启动微信小程序开发服务器
pnpm run dev:mp-weixin
```

#### 其他平台

```bash
# 支付宝小程序
pnpm run dev:mp-alipay

# 百度小程序
pnpm run dev:mp-baidu

# 头条小程序
pnpm run dev:mp-toutiao

# 其他平台请参考 package.json 中的 scripts 命令
```

### 3. 类型检查

```bash
# 执行 TypeScript 类型检查
pnpm run type-check
```

## 项目结构

```
EIMS-Mobile/
├── src/
│   ├── components/        # 组件目录
│   │   ├── app/          # 应用相关组件
│   │   ├── auth/         # 认证相关组件
│   │   ├── common/       # 通用组件
│   │   ├── message/      # 消息相关组件
│   │   ├── platform/     # 平台相关组件
│   │   └── user/         # 用户相关组件
│   ├── config/           # 配置文件
│   ├── pages/            # 页面目录
│   │   ├── application/  # 应用页面
│   │   ├── auth/         # 认证页面
│   │   ├── home/         # 首页相关页面
│   │   ├── platform/     # 平台页面
│   │   └── system/       # 系统页面
│   ├── services/         # 服务层
│   │   ├── api/          # API 接口
│   │   └── utils/        # 工具函数
│   ├── static/           # 静态资源
│   │   ├── font/         # 字体文件
│   │   ├── icon/         # 图标文件
│   │   └── image/        # 图片文件
│   ├── store/            # Pinia 状态管理
│   │   └── modules/      # 状态模块
│   ├── utils/            # 工具函数
│   ├── App.vue           # 应用入口组件
│   ├── main.ts           # 应用入口文件
│   ├── manifest.json     # Uni-app 配置文件
│   ├── pages.json        # 页面路由配置
│   └── uni.scss          # 全局样式
├── index.html            # H5 入口 HTML
├── package.json          # 项目配置文件
├── tsconfig.json         # TypeScript 配置文件
├── vite.config.ts        # Vite 配置文件
└── README.md             # 项目说明文档
```

## 功能模块

### 1. 认证模块
- 登录（账号密码）
- 注册
- 忘记密码
- 指纹登录
- 手势密码

### 2. 首页模块
- 仪表盘
- 快捷操作
- 应用列表

### 3. 应用模块
- 应用管理
- 应用详情

### 4. 平台模块
- 平台管理
- 平台详情

### 5. 系统模块
- 消息中心
- 用户中心
  - 个人资料
  - 头像设置
  - 密码修改
- 系统设置
  - 通知设置
  - 关于我们
  - 帮助中心
  - 意见反馈

## 构建与部署

### 1. 构建 H5 版本

```bash
pnpm run build:h5
```

构建产物将生成在 `dist/build/h5` 目录。

### 2. 构建微信小程序版本

```bash
pnpm run build:mp-weixin
```

构建产物将生成在 `dist/build/mp-weixin` 目录，可直接导入微信开发者工具。

### 3. 构建其他平台版本

```bash
# 支付宝小程序
pnpm run build:mp-alipay

# 百度小程序
pnpm run build:mp-baidu

# 其他平台请参考 package.json 中的 scripts 命令
```

## 注意事项

1. **包管理工具**: 请使用 pnpm 作为包管理工具，禁止使用 npm。
2. **代码规范**: 遵循项目代码规范，使用 4 空格缩进，UTF-8 编码，单行不超过 120 字符。
3. **命名规范**: Vue/TS 组件使用 PascalCase，变量使用 camelCase，CSS 类使用 kebab-case。
4. **安全规范**: 禁止使用 eval/exec，避免全局变量滥用，捕获异常，不记录明文敏感数据。
5. **接口规范**: 遵循 RESTful 风格，统一返回格式 `{"code":0,"message":"","data":{},"request_id":""}`。

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

[Apache 2.0](LICENSE) | [English Version](README.md)

## 联系我们

如有问题或建议，请联系 EIMS 开发团队。

---

**EIMS Team**
*企业综合管理系统移动端应用*