import { useState } from 'react';
import { Users, CheckCircle, XCircle, Percent, Coffee } from 'lucide-react';
import { useDashboardStats, useAttendance } from '../hooks/useAttendance';
import { ErrorState } from '../components/ui/ErrorState';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { AttendanceCalendarModal } from '../components/attendance/AttendanceCalendarModal';
import { EmptyState } from '../components/ui/EmptyState';
import type { Employee } from '../types';

import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
}

const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }: StatCardProps) => (
  <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7 shadow-2xl backdrop-blur-xl hover:border-slate-700 transition-all group overflow-hidden relative">
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
      <Icon size={120} />
    </div>
    <div className="flex items-center justify-between relative z-10">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
        <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
      </div>
      <div className={`rounded-2xl p-4 ${bgColorClass} shadow-xl`}>
        <Icon className={`h-7 w-7 ${colorClass}`} />
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/50 p-7">
    <div className="flex items-center justify-between">
      <div className="space-y-4">
        <div className="h-3 w-28 rounded-full bg-slate-800" />
        <div className="h-10 w-20 rounded-xl bg-slate-800" />
      </div>
      <div className="h-14 w-15 rounded-2xl bg-slate-800" />
    </div>
  </div>
);

const Dashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { 
    data: stats, 
    isLoading: isStatsLoading, 
    isError: isStatsError, 
    refetch: refetchStats 
  } = useDashboardStats();


  // Get today's attendance records
  const today = new Date().toISOString().split('T')[0];
  const { 
    data: attendance = [], 
    isLoading: isAttendanceLoading 
  } = useAttendance();

  const todayRecords = attendance.filter(record => 
    record.date === today && record.employee && record.employee.isActive === true
  );


  if (isStatsError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/5 p-12">
        <ErrorState onRetry={() => refetchStats()} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-400 font-medium">Real-time workforce overview and analytics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {isStatsLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Employees" 
              value={stats?.totalEmployees || 0} 
              icon={Users} 
              colorClass="text-blue-400" 
              bgColorClass="bg-blue-500/20" 
            />
            <StatCard 
              title="Present Today" 
              value={stats?.presentToday || 0} 
              icon={CheckCircle} 
              colorClass="text-emerald-400" 
              bgColorClass="bg-emerald-500/20" 
            />
            <StatCard 
              title="Absent Today" 
              value={stats?.absentToday || 0} 
              icon={XCircle} 
              colorClass="text-rose-400" 
              bgColorClass="bg-rose-500/20" 
            />
            <StatCard 
              title="On Holiday" 
              value={stats?.onHolidayToday || 0} 
              icon={Coffee} 
              colorClass="text-amber-400" 
              bgColorClass="bg-amber-500/20" 
            />
            <StatCard 
              title="Attendance Rate" 
              value={`${stats?.attendanceRate || 0}%`} 
              icon={Percent} 
              colorClass="text-violet-400" 
              bgColorClass="bg-violet-500/20" 
            />
          </>
        )}
      </div>

      {/* Today's Attendance Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
             <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
             Today's Attendance
          </h2>
        </div>
        
        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-2xl">
          {isAttendanceLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-slate-800/50" />
              ))}
            </div>
          ) : todayRecords.length > 0 ? (
            <AttendanceTable 
              records={todayRecords} 
              onOpenCalendar={(employee) => setSelectedEmployee(employee)}
            />
          ) : (
            <div className="p-20 text-center">
              <EmptyState 
                title="No records today" 
                description="Add employees and mark attendance to see data here." 
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Attendance Calendar Modal */}
      <AttendanceCalendarModal 
        isOpen={!!selectedEmployee} 
        onClose={() => setSelectedEmployee(null)} 
        employee={selectedEmployee} 
        readOnly={true}
      />
    </div>
  );
};

export default Dashboard;
