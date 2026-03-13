# HRMS Lite

> A production-grade, full-stack **Human Resource Management System** for managing employees and tracking daily attendance. Features a premium dark-mode dashboard with glassmorphism UI effects and a high-performance REST API.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Design Philosophy](#-design-philosophy)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Dashboard Analytics
- **Real-time statistics** — Total active employees, present/absent/holiday counts, and attendance rate at a glance.
- **Today's attendance feed** — Instantly see who is in and who is out, with quick links to individual calendars.
- **Skeleton loading states** — Premium shimmer animations while data is being fetched.

### Employee Management
- **Full CRUD** — Create, read, update, and delete employee records with optimistic UI updates.
- **Active/Inactive toggle** — Seamlessly archive employees; inactive employees are automatically hidden from attendance views.
- **Real-time search** — Filter by name, email, employee ID, or department with instant results.
- **Form validation** — Client-side via Zod schemas + server-side via Pydantic validators with clear error messages.

### Attendance Tracking
- **Interactive calendar** — A colour-coded grid for every employee (🟢 Present · 🔴 Absent · 🔵 Holiday).
- **Click to mark** — Select any past or current date to instantly mark or overwrite attendance status.
- **Future date guard** — Prevents accidental attendance entries for dates that haven't occurred yet.
- **Upsert logic** — Existing records are updated in place; no duplicate entries.

---

## 🏗 Architecture

```
┌──────────────────┐        HTTP / JSON        ┌──────────────────┐
│                  │ ◄────────────────────────► │                  │
│  React SPA       │                            │  FastAPI Server  │
│  (Vite + TS)     │                            │  (Uvicorn)       │
│                  │                            │                  │
└──────────────────┘                            └────────┬─────────┘
                                                         │
                                                         │ SQLAlchemy ORM
                                                         ▼
                                                ┌──────────────────┐
                                                │   PostgreSQL     │
                                                └──────────────────┘
```

The application follows a clean **3-layer architecture** on the backend:

| Layer | Directory | Responsibility |
|-------|-----------|---------------|
| **Routers** | `app/routers/` | HTTP request handling, input parsing, status codes |
| **Services** | `app/services/` | Business logic, validation rules, data orchestration |
| **Models** | `app/models/` | ORM models, database schema, relationships |

The frontend uses a **feature-based** component structure with dedicated hooks and API modules for separation of concerns.

---

## 🛠 Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** `0.111` | High-performance async REST API framework |
| **Python** `3.11+` | Runtime with modern type-hint support |
| **SQLAlchemy** `2.0` | ORM with mapped column types and relationships |
| **Alembic** `1.13` | Database migration management |
| **Pydantic** `v2` | Request/response validation with camelCase aliasing |
| **PostgreSQL** | Production-grade relational database |
| **Uvicorn** | ASGI server with multi-worker support |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React** `19` | UI component library |
| **TypeScript** `5.9` | Static type safety across the codebase |
| **Vite** `8` | Lightning-fast dev server and build tool |
| **Tailwind CSS** `v4` | Utility-first styling with custom dark theme |
| **TanStack React Query** | Server-state management with caching |
| **React Hook Form + Zod** | Performant forms with schema-based validation |
| **Axios** | HTTP client with interceptors for error handling |
| **Lucide React** | Consistent SVG icon library |

---

## 📂 Project Structure

```
pythonfullstack/
├── backend/
│   ├── app/
│   │   ├── core/               # Settings, exceptions
│   │   │   ├── config.py       # Pydantic-based environment settings
│   │   │   └── exceptions.py   # Custom exception hierarchy
│   │   ├── models/             # SQLAlchemy ORM models
│   │   │   ├── employee.py
│   │   │   └── attendance.py
│   │   ├── routers/            # FastAPI route handlers
│   │   │   ├── employees.py
│   │   │   ├── attendance.py
│   │   │   └── dashboard.py
│   │   ├── schemas/            # Pydantic request/response models
│   │   │   ├── employee.py
│   │   │   ├── attendance.py
│   │   │   └── common.py
│   │   ├── services/           # Business logic layer
│   │   │   ├── employee_service.py
│   │   │   └── attendance_service.py
│   │   ├── database.py         # Engine, session factory, Base
│   │   └── main.py             # FastAPI app entry point
│   ├── alembic/                # Database migrations
│   ├── .env.example            # Example environment config
│   ├── Dockerfile              # Production container image
│   ├── Procfile                # Heroku/Render process file
│   └── requirements.txt        # Python dependencies (pinned)
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios client & API modules
│   │   ├── components/
│   │   │   ├── attendance/     # Calendar modal, table, mark modal
│   │   │   ├── employees/      # Add/edit/delete modals, table
│   │   │   ├── layout/         # Sidebar, header, app shell
│   │   │   └── ui/             # Reusable primitives (Button, Input, Modal…)
│   │   ├── hooks/              # React Query custom hooks
│   │   ├── pages/              # Route-level page components
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Shared helpers (cn, formatters)
│   ├── index.html
│   ├── vite.config.ts
│   ├── vercel.json             # SPA rewrite rules for Vercel
│   └── package.json
│
├── .gitignore
└── readme.md                   # ← You are here
```

---

## 📋 Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | `18+` |
| **npm** | `9+` |
| **Python** | `3.11+` |
| **PostgreSQL** | `14+` |
| **Git** | Latest |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pythonfullstack
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# → Edit .env with your DATABASE_URL and other settings

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.  
Interactive docs at **http://localhost:8000/docs** (Swagger UI) and **http://localhost:8000/redoc** (ReDoc).

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Create a .env file with:
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

The UI will be available at **http://localhost:5173**.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `CORS_ORIGINS` | ❌ | `["http://localhost:5173"]` | Allowed CORS origins (JSON array) |
| `ENVIRONMENT` | ❌ | `production` | `development` enables SQL echo & debug logging |
| `LOG_LEVEL` | ❌ | `INFO` | Python logging level |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | ❌ | `http://localhost:8000/api` | Backend API base URL |

---

## 📡 API Reference

Base URL: `http://localhost:8000/api`

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health probe |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | List all employees (optional `?search=` query) |
| `POST` | `/api/employees` | Create a new employee |
| `PUT` | `/api/employees/{id}` | Update an employee by UUID |
| `DELETE` | `/api/employees/{id}` | Delete an employee by UUID |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/attendance` | List attendance records (filter by `employeeId`, `date`, `month`, `year`) |
| `POST` | `/api/attendance` | Mark or update attendance (upsert) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/stats` | Get today's aggregated statistics |

> 📖 Full interactive API documentation is available at `/docs` (Swagger UI) when the server is running.

---

## 🚢 Deployment

### Backend — Docker

```bash
cd backend
docker build -t hrms-backend .
docker run -p 8000:8000 --env-file .env hrms-backend
```

### Backend — Heroku / Render

The included `Procfile` is compatible with Heroku and Render:

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend — Vercel

The frontend includes a `vercel.json` with SPA rewrite rules. Deploy with:

```bash
cd frontend
npx vercel --prod
```

Set `VITE_API_BASE_URL` to your deployed backend URL in the Vercel environment settings.

### Frontend — Static Build

```bash
cd frontend
npm run build    # Output in dist/
```

The `dist/` folder can be served by any static hosting provider (Nginx, S3, Cloudflare Pages, etc.).

---

## 🎨 Design Philosophy

The application follows a **"Premium Dark"** design language:

- **Deep backgrounds** — `#020617` (slate-950) and `#0f172a` (slate-900) for a rich, immersive feel.
- **Glassmorphism** — Semi-transparent backgrounds with `backdrop-blur` for layered depth.
- **Neon accents** — Emerald (present), Rose (absent), Blue (holiday) for clear status indication.
- **Micro-animations** — Hover scales, pulse indicators, gradient glows, and skeleton loading states.
- **Consistent dark palette** — All UI components use the same slate/dark colour system with no light-theme leaks.
- **Typography** — Inter font with heavy (900) weights, aggressive letter-spacing, and uppercase labels.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "feat: add my feature"`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

Please follow the existing code style and ensure all changes pass linting before submitting.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
