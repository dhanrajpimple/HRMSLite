import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmptyState } from '../components/ui/EmptyState';
import { AddEmployeeModal } from '../components/employees/AddEmployeeModal';
import { EditEmployeeModal } from '../components/employees/EditEmployeeModal';
import { DeleteEmployeeModal } from '../components/employees/DeleteEmployeeModal';
import type { Employee } from '../types';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const { data: employees = [], isLoading, isError, refetch } = useEmployees();

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">Workforce Directory</h1>
          <p className="text-slate-400 font-medium">Detailed overview of all registered team members.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)} 
          className="flex items-center gap-2 px-6 py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add New Member
        </Button>
      </div>

      {/* Search Bar - Modern Glass style */}
      <div className="relative group max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, ID or department..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-2xl">
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
          <EmployeeTable 
            employees={filteredEmployees} 
            onEdit={(emp) => setEditingEmployee(emp)}
            onDelete={(emp) => setDeletingEmployee(emp)} 
          />
        ) : (
          <div className="p-20 text-center">
            <EmptyState
              title={searchTerm ? "No results found" : "Directory is empty"}
              description={searchTerm ? "Adjust your filters and try again." : "Start by adding your first team member."}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <EditEmployeeModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
      />

      <DeleteEmployeeModal 
        isOpen={!!deletingEmployee} 
        onClose={() => setDeletingEmployee(null)} 
        employee={deletingEmployee} 
      />
    </div>
  );
};

export default Employees;
