import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useCreateEmployee } from '../../hooks/useEmployees';
import type { Department, ApiError } from '../../types';

const schema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  department: z.enum(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'] as const)
});

type FormData = z.infer<typeof schema>;

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const AddEmployeeModal = ({ isOpen, onClose }: AddEmployeeModalProps) => {
  const { mutate: createEmployee, isPending } = useCreateEmployee();
  
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      department: 'Engineering'
    }
  });

  const onSubmit = (data: FormData) => {
    createEmployee(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error: ApiError) => {
        if (error.errors) {
          Object.keys(error.errors).forEach((key) => {
            const messages = error.errors?.[key];
            if (messages && messages.length > 0) {
              setError(key as keyof FormData, {
                message: messages[0]
              });
            }
          });
        }
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee">
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
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Add Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
};
