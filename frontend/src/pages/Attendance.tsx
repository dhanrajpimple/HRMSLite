import { useState } from 'react';
import { Users, Calendar, Search } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { AttendanceCalendarModal } from '../components/attendance/AttendanceCalendarModal';
import type { Employee } from '../types';

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { data: employees = [], isLoading, isError, refetch } = useEmployees();

  const filteredEmployees = employees.filter((emp) =>
    emp.isActive !== false && (
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">Attendance System</h1>
          <p className="text-slate-400 font-medium italic">Select an employee to manage their performance and calendar.</p>
        </div>
      </div>

      {/* Search Bar - Modern Glass style */}
      <div className="relative group max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter by name, ID or department..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-2xl shadow-blue-500/5">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-slate-800/50" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 flex justify-center">
            <ErrorState onRetry={() => refetch()} />
          </div>
        ) : filteredEmployees.length > 0 ? (
          <Table headers={['Employee Profile', 'Department', 'Employee ID', 'Management']}>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-bold text-white py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                      {employee.fullName.charAt(0)}
                    </div>
                    <span>{employee.fullName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="info">{employee.department}</Badge>
                </TableCell>
                <TableCell className="text-slate-400 font-mono font-medium tracking-wider">
                  {employee.employeeId}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex items-center gap-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition-all font-bold text-[11px] uppercase tracking-widest"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    Mark Attendance
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        ) : (
          <div className="p-20 text-center">
            <EmptyState
              title="No employees found"
              description="Try adjusting your search terms or add employees in the Employees tab."
              icon={Users}
            />
          </div>
        )}
      </div>

      {/* Attendance Calendar Modal */}
      <AttendanceCalendarModal 
        isOpen={!!selectedEmployee} 
        onClose={() => setSelectedEmployee(null)} 
        employee={selectedEmployee} 
      />
    </div>
  );
};

export default Attendance;
