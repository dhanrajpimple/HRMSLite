export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  isActive?: boolean;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: string;
  status: 'present' | 'absent' | 'holiday';
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onHolidayToday: number;
  attendanceRate: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: { field: string; message: string }[];
}

export type Department = 'Engineering' | 'Marketing' | 'Sales' | 'HR' | 'Finance' | 'Operations' | 'Design' | 'Product';
