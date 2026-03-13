import { Trash2, Edit2, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { Employee } from '../../types';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatters';
import { useUpdateEmployee } from '../../hooks/useEmployees';
import { clsx } from 'clsx';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable = ({ employees, onEdit, onDelete }: EmployeeTableProps) => {
  const headers = ['Employee', 'Status', 'Department', 'Joined Date', 'Actions'];
  const { mutate: updateEmployee } = useUpdateEmployee();

  const toggleStatus = (employee: Employee) => {
    updateEmployee({
      id: employee.id,
      data: { isActive: !employee.isActive }
    });
  };

  return (
    <Table headers={headers}>
      {employees.map((employee) => (
        <TableRow key={employee.id}>
          <TableCell className="font-bold text-white py-5">
            <span className="text-slate-400 font-mono text-[11px] block mb-1">ID: {employee.employeeId}</span>
            {employee.fullName}
          </TableCell>
          <TableCell>
            <button
              onClick={() => toggleStatus(employee)}
              className={clsx(
                "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                employee.isActive 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
              )}
            >
              {employee.isActive ? (
                <><ShieldCheck className="h-3 w-3" /> Active</>
              ) : (
                <><ShieldAlert className="h-3 w-3" /> Inactive</>
              )}
            </button>
          </TableCell>
          <TableCell>
            <Badge variant="info">{employee.department}</Badge>
          </TableCell>
          <TableCell className="text-slate-400 text-sm font-medium">{formatDate(employee.createdAt)}</TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(employee)}
                className="text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all rounded-lg"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(employee)}
                className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
};
