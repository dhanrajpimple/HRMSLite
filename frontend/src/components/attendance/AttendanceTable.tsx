import type { AttendanceRecord, Employee } from '../../types';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onOpenCalendar?: (employee: Employee) => void;
}

export const AttendanceTable = ({ records, onOpenCalendar }: AttendanceTableProps) => {
  const headers = ['Employee Name', 'Employee ID', 'Department', 'Date', 'Status', 'Marked At', ...(onOpenCalendar ? ['Action'] : [])];

  return (
    <Table headers={headers}>
      {records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
        <TableRow key={record.id}>
          <TableCell className="font-medium text-white">
            {record.employee?.fullName || 'N/A'}
          </TableCell>
          <TableCell className="text-slate-400">
            {record.employee?.employeeId || 'N/A'}
          </TableCell>
          <TableCell>
            {record.employee?.department ? (
              <Badge variant="info">{record.employee.department}</Badge>
            ) : 'N/A'}
          </TableCell>
          <TableCell className="text-slate-300">{formatDate(record.date)}</TableCell>
          <TableCell>
            <Badge variant={
              record.status === 'present' ? 'success' : 
              record.status === 'absent' ? 'danger' : 'info'
            }>
              {record.status === 'present' ? 'Present' : 
               record.status === 'absent' ? 'Absent' : 'Holiday'}
            </Badge>
          </TableCell>
          <TableCell className="text-xs text-slate-300 font-medium tracking-wider">
            {formatDate(record.createdAt)}
          </TableCell>
          {onOpenCalendar && (
            <TableCell>
              {record.employee && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="flex items-center gap-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition-all font-bold text-[11px] uppercase tracking-widest"
                  onClick={() => onOpenCalendar(record.employee!)}
                >
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  View
                </Button>
              )}
            </TableCell>
          )}
        </TableRow>
      ))}
    </Table>
  );
};
