import api from './axios';
import type { AttendanceRecord, DashboardStats } from '../types';

export const getAttendance = (employeeId?: string, month?: number, year?: number) => {
  const params = new URLSearchParams();
  if (employeeId) params.append('employeeId', employeeId);
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  
  const queryString = params.toString();
  const url = queryString ? `/attendance?${queryString}` : '/attendance';
  return api.get<never, AttendanceRecord[]>(url);
};

export const markAttendance = (data: Omit<AttendanceRecord, 'id' | 'createdAt' | 'employee'>) => 
  api.post<never, AttendanceRecord>('/attendance', data);

export const getDashboardStats = () => 
  api.get<never, DashboardStats>('/dashboard/stats');
