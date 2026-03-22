
# EIMS Enterprise Integrated Management System

- **Language**: [English](README.md) | [中文](README-zh-CN.md)
- **License**: Apache 2.0
- **Python**: 3.14+
- **Vue**: 3.5+
- **FastAPI**: 0.135+

---

## 🌟 Project Overview

**EIMS (Enterprise Integrated Management System)** is a comprehensive management system for enterprises and public institutions, built with a modern technology stack, providing a modular and scalable enterprise management solution.

### Core Features

- 🔐 **Secure and Reliable** - JWT + OAuth2.0 based authentication, RBAC permission model, data isolation by department/position
- 📱 **Multi-platform Support** - Web + Mobile (Uni-app) full coverage
- 🏗️ **Modular Design** - Layered architecture, easy to extend and maintain
- 📊 **Data-driven** - Integrated business intelligence capabilities
- 🔧 **Easy to Deploy** - Support Docker containerized deployment

---

## 🏗️ Technical Architecture

```
┌──────────────────────────────────────────────────┐
│        Frontend (Vue 3 + Ant Design Vue)         │
│   Vite · TypeScript · Pinia · Vue Router         │
├──────────────────────────────────────────────────┤
│              Backend (FastAPI)                    │
│   RESTful API · SQLAlchemy · JWT/RBAC            │
├──────────────────────────────────────────────────┤
│            Data Storage Layer                      │
│   PostgreSQL 18+ · Redis 8.6+                     │
└──────────────────────────────────────────────────┘
```

### Backend Tech Stack

| Technology/Framework | Version   | Purpose                                  |
| ------------------- | --------- | ---------------------------------------- |
| Python              | 3.14+     | Primary development language             |
| FastAPI             | 0.135+    | Modern web framework                     |
| SQLAlchemy          | 2.0+      | ORM framework, simplifies database operations |
| PostgreSQL          | 18+       | Production database                      |
| Redis               | 8.6+      | Cache layer                              |
| PyJWT               | 2.12+     | JWT token generation and verification   |
| Alembic             | 1.18+     | Database migration tool                  |

### Frontend Tech Stack

| Technology/Framework | Version   | Purpose                                  |
| ------------------- | --------- | ---------------------------------------- |
| Vue 3               | 3.5+      | Composition API, better TypeScript support |
| Ant Design Vue      | 4.2+      | Enterprise UI component library          |
| Vite                | 7.3+      | Modern frontend build tool               |
| TypeScript          | 5.9+      | Static type checking                     |
| Pinia               | 3.0+      | State management, replaces Vuex          |
| Vue Router          | 5.0+      | Route management                         |
| ECharts             | 6.0+      | Data visualization chart library         |

---

## 📦 Feature Modules

### 1. System Management Module

| Feature Module       | Main Features                                  |
| ------------------ | ---------------------------------------------- |
| User Management    | User CRUD, status management, password reset  |
| Role & Permission  | Role creation, permission assignment, permission matrix |
| Department Management | Organizational structure, position management, personnel association |
| System Configuration | Basic configuration, email configuration, notification configuration |
| Log Management     | Operation logs, system logs, log analysis     |
| Data Backup        | Auto backup, manual backup, data recovery     |
| System Monitoring  | Performance monitoring, service monitoring, user activity monitoring |
| Notification Management | System announcements, message center, push management |

### 2. Mobile Features

- Mobile-adaptive login
- Personal information management
- Message notification push
- Responsive design
- Offline access capability

### 3. Reserved Core Modules

- Enterprise Resource Planning (ERP)
- Customer Relationship Management (CRM)
- Human Resource Management (HRM)
- Project Management (PM)
- Financial Management (FM)
- Supply Chain Management (SCM)
- Customer Service Management (CSM)
- Business Intelligence (BI)

---

## 🚀 Quick Start

### Environment Requirements

- Python 3.14+
- Node.js 20+
- PostgreSQL 18+ (or SQLite for quick testing)
- pnpm (frontend package manager)

### Backend Development Environment

Detailed steps please refer to [EIMS后端开发环境.md](Docs/EIMS后端开发环境.md)

```bash
# Enter backend directory
cd EIMS-Backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env file, configure database connection, etc.

# Start development server
python main.py
```

### Frontend Development Environment

Detailed steps please refer to [EIMS前端开发环境.md](Docs/EIMS前端开发环境.md)

```bash
# Enter frontend directory
cd EIMS-Frontend

# Install dependencies (must use pnpm)
pnpm install

# Start development server
pnpm dev
```

### Mobile Development Environment

Detailed steps please refer to [EIMS移动端开发环境.md](Docs/EIMS移动端开发环境.md)

---

## 📁 Project Structure

```
EIMS/
├── EIMS-Backend/           # Backend project
│   ├── app/                # Application main directory
│   │   ├── api/            # API routing layer
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Data transfer objects
│   │   ├── services/       # Business logic layer
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migration files
│   └── main.py             # Application entry
├── EIMS-Frontend/          # Frontend project
│   ├── src/
│   │   ├── components/     # Common components
│   │   ├── views/          # Page components
│   │   ├── router/         # Route configuration
│   │   ├── stores/         # Pinia state management
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── EIMS-Mobile/            # Mobile project
├── Docs/                   # Documentation directory
│   ├── EIMS功能清单.md
│   ├── EIMS后端开发环境.md
│   ├── EIMS前端开发环境.md
│   └── EIMS移动端开发环境.md
└── README-zh-CN.md
```

---

## 🔒 Security Specifications

- **Authentication Method**: PyJWT + OAuth2.0
- **Password Encryption**: bcrypt hashing
- **Permission Model**: RBAC, permissions down to button level
- **Data Isolation**: Data isolation by department/position
- **SQL Injection Protection**: Use parameterized queries
- **Sensitive Data**: Prohibit plaintext logging

---

## 📄 Development Specifications

### Code Specifications

- **Indentation**: 4 spaces
- **Encoding**: UTF-8
- **Line Length**: ≤ 120 characters
- **Comments**: Key logic with Chinese comments

### Naming Conventions

- **Python**: snake_case (variables/functions), PascalCase (classes)
- **Vue/TypeScript**: PascalCase (components), camelCase (variables), kebab-case (CSS classes)

---

## 📄 License

[Apache 2.0](LICENSE) | [中文版](LICENSE-zh-CN)
