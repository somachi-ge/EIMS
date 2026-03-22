# EIMS企业综合管理系统前端

## 项目介绍
EIMS（Enterprise Integrated Management System）企业综合管理系统是一个基于Vue 3 + Ant Design Vue的现代化前端项目，用于企业内部的综合管理。

## 技术栈
- Vue 3 (3.5.28+)
- Ant Design Vue (4.2.6+)
- Vite (8.0.1+)
- TypeScript (5.9.3+)
- Vue Router (5.0.3+)
- Pinia (3.0.4+)
- Axios (1.13.5+)
- ECharts (6.0.0+)
- Day.js (1.11.19+)
- SCSS (1.97.3+)

## 项目结构
```
EIMS-Frontend/
├── public/              # 静态资源目录
├── src/                # 源代码目录
│   ├── assets/         # 资源文件
│   ├── components/     # 通用组件
│   ├── views/          # 页面组件
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia状态管理
│   ├── services/       # API服务
│   ├── utils/          # 工具函数
│   ├── hooks/          # 自定义Hooks
│   ├── styles/         # 全局样式
│   ├── types/          # TypeScript类型定义
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── .eslintrc.js        # ESLint配置
├── .prettierrc.js      # Prettier配置
├── index.html          # HTML模板
├── package.json        # 项目依赖
├── tsconfig.json       # TypeScript配置
├── vite.config.ts      # Vite配置
└── README.md           # 项目说明
```

## 开发指南
1. 安装依赖：`pnpm install`
2. 启动开发服务器：`pnpm dev`
3. 构建生产版本：`pnpm build`
4. 预览生产构建：`pnpm preview`

## 注意事项
- 本项目使用pnpm作为包管理工具，禁止使用npm
- 代码风格遵循ESLint和Prettier配置
- 组件命名使用PascalCase，变量使用camelCase，CSS类使用kebab-case
- 代码缩进使用4个空格，单行长度不超过120字符
- 关键逻辑请添加中文注释