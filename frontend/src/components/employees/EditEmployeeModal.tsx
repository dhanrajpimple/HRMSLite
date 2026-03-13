import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useUpdateEmployee } from '../../hooks/useEmployees';
import type { Employee, Department, ApiError } from '../../types';

const schema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  department: z.enum(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'] as const),
  isActive: z.boolean()
});

type FormData = z.infer<typeof schema>;

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const DEPARTMENTS: { label: string; value: Department }[] = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Sales', value: 'Sales' },
  { label: 'HR', value: 'HR' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Design', value: 'Design' },
  { label: 'Product', value: 'Product' },
];

export const EditEmployeeModal = ({ isOpen, onClose, employee }: EditEmployeeModalProps) => {
  const { mutate: updateEmployee, isPending } = useUpdateEmployee();
  
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (employee) {
      reset({
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        email: employee.email,
        department: employee.department as Department,
        isActive: employee.isActive ?? true
      });
    }
  }, [employee, reset]);

  const onSubmit = (data: FormData) => {
    if (!employee) return;
    updateEmployee(
      { id: employee.id, data },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error: ApiError) => {
          if (error.errors) {
            error.errors.forEach((err) => {
              if (err.field) {
                setError(err.field as keyof FormData, {
                  message: err.message,
                });
              }
            });
          }
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Employee Details">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Employee ID"
          placeholder="EMP001"
          error={errors.employeeId?.message}
          {...register('employeeId')}
        />
        <Input
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Email Address"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          label="Department"
          options={DEPARTMENTS}
          error={errors.department?.message}
          {...register('department')}
        />
        
        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-300 pointer-events-none select-none">
            Active Employee
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
