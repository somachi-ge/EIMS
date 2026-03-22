---
alwaysApply: true
---
# EIMS企业综合管理系统项目规则
## 1. 项目基础
- 项目：EIMS企业综合管理系统
- 技术栈：Python 3.14+/FastAPI 0.135+；Vue 3.5+/Uni-app 3.0+/TS 5.9+；PostgreSQL 18+/Redis 8.6+
- 包管理：前端项目和移动端项目必须使用pnpm作为包管理工具，禁止使用npm；后端项目依赖必须安装到Python虚拟环境中
- 虚拟环境：启动后端项目开发服务器前，必须激活Python虚拟环境
- 目标：AI输出严格遵循企业管理规范与技术约束

## 2. 代码规范
- 格式：4空格缩进，UTF-8编码，单行≤120字符，关键逻辑加中文注释
- 命名：Python用snake_case/类PascalCase；Vue/TS组件PascalCase、变量camelCase、CSS类kebab-case
- 禁止：eval/exec、全局变量滥用、未捕获异常、明文敏感数据日志

## 3. 架构与接口
- 接口：RESTful风格，统一返回{"code":0,"message":"","data":{},"request_id":""}，参数化查询防SQL注入
- 分层：后端Controller→Service→Repository→Domain；前端视图→Hooks→API服务
- 缓存：高频数据先写Redis再批量落库，防护缓存击穿

## 4. 安全与权限
- 认证：PyJWT+OAuth2.0，密码bcrypt哈希，支持MFA
- 权限：RBAC模型，权限细化至按钮级，数据按部门/岗位隔离
- 禁止：危险代码、未授权第三方API、生产数据外发

## 5. AI交互规则
- 输出：全程中文，技术术语可保留英文
- 代码：优先复用现有组件，无语法错误/占位符
- 澄清：需求模糊时主动提问
- 生效范围：*.py/*.vue/*.ts/*.md