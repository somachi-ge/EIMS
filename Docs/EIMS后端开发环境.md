# EIMS后端开发环境

## 一、后端技术栈

| 技术/框架          | 版本       | 用途                             |
| -------------- | -------- | ------------------------------ |
| Python         | 3.14.3+  | 主要开发语言，提供丰富的生态系统和强大的库支持        |
| FastAPI        | 0.135.1+ | 现代化的Web框架，提供自动API文档生成、类型提示和高性能 |
| Uvicorn        | 0.42.0+  | ASGI服务器，用于运行FastAPI应用              |
| python-multipart | 0.0.22+  | 用于处理multipart/form-data请求，支持文件上传     |
| Pydantic       | 2.12.5+   | 数据验证和序列化库，为FastAPI提供类型检查支持     |
| python-dotenv  | 1.2.2+   | 从.env文件加载环境变量，用于配置管理           |
| SQLAlchemy     | 2.0.48+  | ORM框架，简化数据库操作                  |
| pandas         | 3.0.1+   | 数据处理和分析库，用于处理结构化数据           |
| PyJWT          | 2.12.1+  | 用于生成和验证JWT令牌                   |
| email-validator | 2.3.0+  | 用于验证电子邮件地址格式的库              |
| SQLite         | 3.51.2+  | 开发环境数据库，轻量级、无需额外配置，适合开发和测试     |
| PostgreSQL     | 18.2+    | 生产环境数据库，企业级关系型数据库，支持复杂查询和事务    |
| bcrypt         | 5.0.0+    | 密码哈希，对密码进行加密存储                 |
| Alembic        | 1.18.4+    | 数据库迁移工具                        |
| Loguru         | 0.7.3+    | 现代化的日志库                        |
| Black          | 26.3.1+ | Python代码格式化工具，保持代码风格一致     |
| Ruff           | 0.15.7+   | Python代码linting工具，检查代码质量和风格    |

## 二、项目结构

```
EIMS-Backend/                             # 项目根目录
├── app/                                  # 应用主目录
│   ├── api/                              # API路由层
│   │   ├── v1/                           # API版本控制
│   │   │   ├── auth/                     # 认证领域接口
│   │   │   │   └── auth.py               # 认证相关接口
│   │   │   ├── user/                     # 用户领域接口
│   │   │   │   ├── users.py              # 用户管理接口
│   │   │   │   └── roles.py              # 角色权限接口
│   │   │   ├── organization/             # 组织领域接口
│   │   │   │   └── departments.py        # 部门管理接口
│   │   │   ├── system/                   # 系统领域接口
│   │   │   │   ├── system.py             # 系统配置接口
│   │   │   │   ├── logs.py               # 日志管理接口
│   │   │   │   ├── backup.py             # 备份恢复接口
│   │   │   │   ├── monitor.py            # 系统监控接口
│   │   │   │   └── notifications.py      # 通知管理接口
│   │   │   └── __init__.py               # API版本初始化
│   │   └── dependencies.py               # API依赖项
│   ├── core/                             # 核心配置
│   │   ├── config.py                     # 应用配置
│   │   ├── security.py                   # 安全相关功能
│   │   └── database.py                   # 数据库连接
│   ├── models/                           # 数据库模型
│   │   ├── user.py                       # 用户模型
│   │   ├── role.py                       # 角色模型
│   │   ├── permission.py                 # 权限模型
│   │   ├── department.py                 # 部门模型
│   │   ├── log.py                        # 日志模型
│   │   └── notification.py               # 通知模型
│   ├── schemas/                          # 数据传输对象
│   │   ├── user.py                       # 用户相关DTO
│   │   ├── role.py                       # 角色相关DTO
│   │   ├── department.py                 # 部门相关DTO
│   │   └── common.py                     # 通用DTO
│   ├── services/                         # 业务逻辑层
│   │   ├── auth/                         # 认证领域
│   │   │   └── auth_service.py           # 认证服务
│   │   ├── user/                         # 用户领域
│   │   │   ├── user_service.py           # 用户服务
│   │   │   └── role_service.py           # 角色服务
│   │   ├── organization/                 # 组织领域
│   │   │   └── department_service.py     # 部门服务
│   │   ├── system/                       # 系统领域
│   │   │   ├── system_service.py         # 系统配置服务
│   │   │   ├── log_service.py            # 日志服务
│   │   │   ├── backup_service.py         # 备份服务
│   │   │   ├── monitor_service.py        # 监控服务
│   │   │   └── notification_service.py   # 通知服务
│   ├── utils/                            # 工具函数
│   │   ├── exceptions.py                 # 异常处理
│   │   ├── helpers.py                    # 辅助函数
│   │   └── validators.py                 # 数据验证
│   └── __init__.py                       # 应用包初始化文件
├── migrations/                           # 数据库迁移文件
├── main.py                               # 应用入口
├── requirements.txt                      # 依赖包列表
├── requirements-dev.txt                  # 开发依赖包
├── .env.example                          # 环境变量示例
├── .gitignore                            # Git忽略文件
└── README.md                             # 项目说明文档
```
