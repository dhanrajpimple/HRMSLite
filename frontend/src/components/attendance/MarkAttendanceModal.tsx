import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useMarkAttendance } from '../../hooks/useAttendance';
import { useEmployees } from '../../hooks/useEmployees';

const schema = z.object({
  employeeId: z.string().min(1, 'Select an employee'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['present', 'absent'] as const)
});

type FormData = z.infer<typeof schema>;

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarkAttendanceModal = ({ isOpen, onClose }: MarkAttendanceModalProps) => {
  const { data: employees = [] } = useEmployees();
  const { mutate: markAttendance, isPending } = useMarkAttendance();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      status: 'present'
    }
  });

  const onSubmit = (data: FormData) => {
    markAttendance(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  const employeeOptions = employees.map(emp => ({
    label: emp.fullName,
    value: emp.id
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark Attendance">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Employee"
          placeholder="Select an employee"
          options={employeeOptions}
          error={errors.employeeId?.message}
          {...register('employeeId')}
        />
        <Input
          label="Date"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />
        <Select
          label="Status"
          options={[
            { label: 'Present', value: 'present' },
            { label: 'Absent', value: 'absent' }
          ]}
          error={errors.status?.message}
          {...register('status')}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Mark Attendance
          </Button>
        </div>
      </form>
    </Modal>
  );
};
