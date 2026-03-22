# EIMS 后端服务

## 项目介绍
EIMS（企业综合管理系统）后端服务，基于 FastAPI 框架开发，提供企业管理所需的 API 接口。

## 技术栈
- Python 3.14.3+
- FastAPI 0.135.1+
- Uvicorn 0.42.0+
- SQLAlchemy 2.0.48+
- SQLite（开发环境）/ PostgreSQL（生产环境）

## 项目结构
```
EIMS-Backend/
├── app/                  # 应用主目录
│   ├── api/              # API路由层
│   ├── core/             # 核心配置
│   ├── models/           # 数据库模型
│   ├── schemas/          # 数据传输对象
│   ├── services/         # 业务逻辑层
│   └── utils/            # 工具函数
├── migrations/           # 数据库迁移文件
├── main.py               # 应用入口
├── requirements.txt      # 依赖包列表
├── requirements-dev.txt  # 开发依赖包
├── .env.example          # 环境变量示例
└── .gitignore            # Git忽略文件
```

## 快速开始

### 1. 安装依赖
```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置环境变量
复制 `.env.example` 文件为 `.env` 并修改相应配置。

### 3. 启动服务
```bash
uvicorn main:app --reload
```

服务将在 `http://localhost:8000` 运行，API 文档可访问 `http://localhost:8000/docs`。

## API 文档
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
