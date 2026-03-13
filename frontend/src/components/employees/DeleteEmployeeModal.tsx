import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDeleteEmployee } from '../../hooks/useEmployees';
import type { Employee } from '../../types';

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export const DeleteEmployeeModal = ({ isOpen, onClose, employee }: DeleteEmployeeModalProps) => {
  const { mutate: deleteEmployee, isPending } = useDeleteEmployee();

  const handleDelete = () => {
    if (!employee) return;
    deleteEmployee(employee.id, {
      onSuccess: () => onClose()
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Employee">
      <div className="space-y-4">
        <p className="text-sm text-slate-400">
          Are you sure you want to delete <span className="font-semibold text-white">{employee?.fullName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isPending}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
