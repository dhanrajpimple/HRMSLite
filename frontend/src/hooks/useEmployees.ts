import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as employeeApi from '../api/employees';
import { toast } from 'react-hot-toast';
import type { ApiError } from '../types';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getEmployees,
    staleTime: 30000,
    retry: 2,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee added successfully');
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(error.message || 'Failed to add employee');
      }
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => employeeApi.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully');
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(error.message || 'Failed to update employee');
      }
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeeApi.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete employee');
    },
  });
};
