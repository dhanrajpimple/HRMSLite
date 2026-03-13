# HRMS Lite - Full Stack Employee & Attendance Management System

A premium, full-stack Human Resource Management System (HRMS) built to manage employees and track daily attendance. It features a stunning dark-mode UI with glassmorphism effects and a robust, high-performance API.

## 🚀 Features

### **Dashboard Analytics**
- Real-time statistics: Total Active Employees, Present Today, Absent Today, On Holiday, and Attendance Rate.
- "Today's Attendance" view filtering to show exactly who is in and who is out.
- Quick-access Calendar views for all employees.

### **Employee Management**
- **Add & Edit**: Manage employee details including Full Name, Employee ID (Unique), Email, and Department.
- **Active/Inactive Toggle**: Easily mark employees as inactive. Inactive employees are seamlessly hidden from the Dashboard and Attendance marking views to prevent accidental data entry.
- **Form Validation**: Strict validation for emails, ID lengths, and required fields.

### **Attendance Tracking**
- **Visual Calendar**: A beautiful, color-coded interactive calendar grid for every employee (Green = Present, Red = Absent, Blue = Holiday).
- **Mark Attendance**: Click on any past or present date to mark or update attendance status.
- **Data Integrity**: Prevents marking attendance for future dates. Easily overwrite existing records for corrections.

## 🛠️ Technology Stack

### **Frontend**
- **React.js** (Vite) for blazing-fast performance.
- **Tailwind CSS v4** for modern, premium dark themes, gradients, and glassmorphism.
- **Lucide React** for crisp, scalable icons.
- **React Query** for intelligent data caching and state management.
- **React Hook Form & Zod** for robust form handling and validation.
- **React Calendar** for custom-styled attendance block grids.

### **Backend**
- **FastAPI** for a high-performance, asynchronous REST API.
- **Python 3.11+**
- **SQLAlchemy 2.0** for modern ORM capabilities.
- **PostgreSQL** for reliable relational data storage.
- **Alembic** for database migrations.
- **Pydantic v2** for robust data validation and serialization.

## ⚙️ Setup & Installation

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd pythonfullstack
```

### **2. Backend Setup**
Navigate to the backend directory, install dependencies, and run the server:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up your .env file with your DATABASE_URL
# Run Migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```
The FastAPI backend will be running at `http://localhost:8000`.

### **3. Frontend Setup**
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will be running at `http://localhost:5173`. Make sure you have a `.env` file in the frontend directory pointing to the backend API (`VITE_API_BASE_URL=http://localhost:8000/api`).

## 🎨 Design Philosophy
The application adheres to a "Premium Dark" design language:
- Heavily utilizes `#0f172a` (slate-900) and `#020617` (slate-950) for deep backgrounds.
- Employs glassmorphism (semi-transparent backgrounds with backdrop blur) to create a layered, modern feel.
- Uses subtle animations, gradient borders, and bright, high-contrast neon accents (Emerald, Rose, Blue) for clear status indications.
