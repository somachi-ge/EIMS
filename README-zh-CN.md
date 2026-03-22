
# EIMS 企业综合管理系统

- **语言**: [中文](README-zh-CN.md) | [English](README.md)
- **许可证**: Apache 2.0
- **Python**: 3.14+
- **Vue**: 3.5+
- **FastAPI**: 0.135+

---

## 🌟 项目简介

**EIMS (Enterprise Integrated Management System)** 是一个面向企事业单位的综合管理系统，采用现代化的技术栈构建，提供模块化、可扩展的企业管理解决方案。

### 核心特性

- 🔐 **安全可靠** - 基于 JWT + OAuth2.0 的身份认证，RBAC 权限模型，数据按部门/岗位隔离
- 📱 **多端支持** - Web 端 + 移动端（Uni-app）全覆盖
- 🏗️ **模块化设计** - 分层架构，易于扩展和维护
- 📊 **数据驱动** - 集成商业智能分析能力
- 🔧 **易于部署** - 支持 Docker 容器化部署

---

## 🏗️ 技术架构

```
┌──────────────────────────────────────────────────┐
│           前端 (Vue 3 + Ant Design Vue)          │
│   Vite · TypeScript · Pinia · Vue Router         │
├──────────────────────────────────────────────────┤
│              后端 (FastAPI)                        │
│   RESTful API · SQLAlchemy · JWT/RBAC            │
├──────────────────────────────────────────────────┤
│            数据存储层                                │
│   PostgreSQL 18+ · Redis 8.6+                     │
└──────────────────────────────────────────────────┘
```

### 后端技术栈

| 技术/框架          | 版本       | 用途                             |
| -------------- | -------- | ------------------------------ |
| Python         | 3.14+    | 主要开发语言                       |
| FastAPI        | 0.135+   | 现代化 Web 框架                   |
| SQLAlchemy     | 2.0+     | ORM 框架，简化数据库操作              |
| PostgreSQL     | 18+      | 生产环境数据库                      |
| Redis          | 8.6+     | 缓存层                           |
| PyJWT          | 2.12+    | JWT 令牌生成与验证                 |
| Alembic        | 1.18+    | 数据库迁移工具                       |

### 前端技术栈

| 技术/框架             | 版本       | 用途                              |
| ----------------- | -------- | ------------------------------- |
| Vue 3             | 3.5+     | 组合式 API，更好的 TypeScript 支持     |
| Ant Design Vue    | 4.2+     | 企业级 UI 组件库                    |
| Vite              | 7.3+     | 现代前端构建工具                      |
| TypeScript        | 5.9+     | 静态类型检查                         |
| Pinia             | 3.0+     | 状态管理，替代 Vuex                 |
| Vue Router        | 5.0+     | 路由管理                           |
| ECharts           | 6.0+     | 数据可视化图表库                      |

---

## 📦 功能模块

### 一、系统管理模块

| 功能模块 | 主要功能 |
| ------ | ------ |
| 用户管理 | 用户增删改查、状态管理、密码重置 |
| 角色权限 | 角色创建、权限分配、权限矩阵 |
| 部门管理 | 组织结构、岗位管理、人员关联 |
| 系统配置 | 基础配置、邮件配置、通知配置 |
| 日志管理 | 操作日志、系统日志、日志分析 |
| 数据备份 | 自动备份、手动备份、数据恢复 |
| 系统监控 | 性能监控、服务监控、用户活动监控 |
| 通知管理 | 系统公告、消息中心、推送管理 |

### 二、移动端功能

- 移动端适配登录
- 个人信息管理
- 消息通知推送
- 响应式设计
- 离线访问能力

### 三、预留核心模块

- 企业资源规划（ERP）
- 客户关系管理（CRM）
- 人力资源管理（HRM）
- 项目管理（PM）
- 财务管理（FM）
- 供应链管理（SCM）
- 客户服务管理（CSM）
- 商业智能（BI）

---

## 🚀 快速开始

### 环境要求

- Python 3.14+
- Node.js 20+
- PostgreSQL 18+（或 SQLite 用于快速测试）
- pnpm（前端包管理工具）

### 后端开发环境

详细步骤请参考 [EIMS后端开发环境.md](Docs/EIMS后端开发环境.md)

```bash
# 进入后端目录
cd EIMS-Backend

# 创建并激活虚拟环境
python -m venv venv
.\venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 启动开发服务器
python main.py
```

### 前端开发环境

详细步骤请参考 [EIMS前端开发环境.md](Docs/EIMS前端开发环境.md)

```bash
# 进入前端目录
cd EIMS-Frontend

# 安装依赖（必须使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev
```

### 移动端开发环境

详细步骤请参考 [EIMS移动端开发环境.md](Docs/EIMS移动端开发环境.md)

---

## 📁 项目结构

```
EIMS/
├── EIMS-Backend/           # 后端项目
│   ├── app/                # 应用主目录
│   │   ├── api/            # API 路由层
│   │   ├── core/           # 核心配置
│   │   ├── models/         # 数据库模型
│   │   ├── schemas/        # 数据传输对象
│   │   ├── services/       # 业务逻辑层
│   │   └── utils/          # 工具函数
│   ├── migrations/         # 数据库迁移文件
│   └── main.py             # 应用入口
├── EIMS-Frontend/          # 前端项目
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── views/          # 页面组件
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── services/       # API 服务
│   │   └── utils/          # 工具函数
│   └── package.json
├── EIMS-Mobile/            # 移动端项目
├── Docs/                   # 文档目录
│   ├── EIMS功能清单.md
│   ├── EIMS后端开发环境.md
│   ├── EIMS前端开发环境.md
│   └── EIMS移动端开发环境.md
└── README-zh-CN.md
```

---

## 🔒 安全规范

- **认证方式**：PyJWT + OAuth2.0
- **密码加密**：bcrypt 哈希
- **权限模型**：RBAC，权限细化至按钮级
- **数据隔离**：按部门/岗位隔离数据
- **SQL 注入防护**：使用参数化查询
- **敏感数据**：禁止明文日志

---

## 📄 开发规范

### 代码规范

- **缩进**：4 空格
- **编码**：UTF-8
- **单行长度**：≤ 120 字符
- **注释**：关键逻辑加中文注释

### 命名规范

- **Python**：snake_case（变量/函数）、PascalCase（类）
- **Vue/TypeScript**：PascalCase（组件）、camelCase（变量）、kebab-case（CSS 类）

---

## 📄 许可证

[Apache 2.0](LICENSE) | [English Version](README.md)

