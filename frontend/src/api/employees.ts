import api from './axios';
import type { Employee } from '../types';

export const getEmployees = () => api.get<never, Employee[]>('/employees');

export const createEmployee = (data: Omit<Employee, 'id' | 'createdAt'>) => 
  api.post<never, Employee>('/employees', data);

export const updateEmployee = (id: string, data: Partial<Omit<Employee, 'id' | 'createdAt'>>) => 
  api.put<never, Employee>(`/employees/${id}`, data);

export const deleteEmployee = (id: string) => 
  api.delete<never, void>(`/employees/${id}`);
