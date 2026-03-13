import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from '../api/attendance';
import { toast } from 'react-hot-toast';
import type { ApiError } from '../types';

export const useAttendance = (employeeId?: string, month?: number, year?: number) => {
  return useQuery({
    queryKey: ['attendance', employeeId, month, year],
    queryFn: () => attendanceApi.getAttendance(employeeId, month, year),
    staleTime: 30000,
    retry: 2,
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Attendance marked successfully');
    },
    onError: (error: ApiError) => {
      if (error.status === 409) {
        toast.error('Attendance already marked for this employee on this date.');
      } else {
        toast.error(error.message || 'Failed to mark attendance');
      }
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: attendanceApi.getDashboardStats,
    staleTime: 30000,
    retry: 2,
  });
};
