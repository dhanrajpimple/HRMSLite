import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAttendance, useMarkAttendance } from '../../hooks/useAttendance';
import type { Employee } from '../../types';
import { formatDate } from '../../utils/formatters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  readOnly?: boolean;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const AttendanceCalendarModal = ({ isOpen, onClose, employee, readOnly = false }: AttendanceCalendarModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  
  const { data: attendance = [] } = useAttendance(
    employee?.id, 
    viewDate.getMonth() + 1, 
    viewDate.getFullYear()
  );
  const { mutate: markAttendance, isPending } = useMarkAttendance();

  if (!employee) return null;

  const getAttendanceForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return attendance.find(r => r.date === dateStr);
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const record = getAttendanceForDate(date);
      if (record) {
        if (record.status === 'present') return 'calendar-tile-present';
        if (record.status === 'absent') return 'calendar-tile-absent';
        if (record.status === 'holiday') return 'calendar-tile-holiday';
      }
    }
    return null;
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const record = getAttendanceForDate(date);
      if (record) {
        return (
          <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none overflow-hidden">
            <span className="text-[40px] font-black select-none uppercase">
              {record.status[0]}
            </span>
          </div>
        );
      }
    }
    return null;
  };

  const handleDateClick = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const onMark = (status: 'present' | 'absent' | 'holiday') => {
    if (isFutureDate(selectedDate)) {
      return;
    }
    const d = new Date(selectedDate);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    markAttendance({
      employeeId: employee.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      status
    });
  };

  const currentRecord = getAttendanceForDate(selectedDate);
  const futureDateSelected = isFutureDate(selectedDate);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Attendance Calendar: ${employee.fullName}`}>
      <div className="space-y-6">
        <div className="calendar-container overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
          <Calendar
            onChange={!readOnly ? handleDateClick : undefined}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) setViewDate(activeStartDate);
            }}
            value={selectedDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            className="w-full border-none font-inter"
            nextLabel={<ChevronRight className="h-4 w-4" />}
            prevLabel={<ChevronLeft className="h-4 w-4" />}
            next2Label={null}
            prev2Label={null}
          />
        </div>

        {!readOnly && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Date</p>
                <p className="text-lg font-bold text-white">{formatDate(selectedDate)}</p>
              </div>
              {currentRecord && (
                <Badge variant={currentRecord.status === 'present' ? 'success' : currentRecord.status === 'absent' ? 'danger' : 'info'}>
                  {currentRecord.status}
                </Badge>
              )}
            </div>

            {futureDateSelected ? (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Future date: Attendance cannot be marked</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  size="sm" 
                  variant={currentRecord?.status === 'present' ? 'primary' : 'secondary'}
                  onClick={() => onMark('present')}
                  isLoading={isPending}
                >
                  Present
                </Button>
                <Button 
                  size="sm" 
                  variant={currentRecord?.status === 'absent' ? 'danger' : 'secondary'}
                  onClick={() => onMark('absent')}
                  isLoading={isPending}
                >
                  Absent
                </Button>
                <Button 
                  size="sm" 
                  variant={currentRecord?.status === 'holiday' ? 'ghost' : 'secondary'}
                  className={currentRecord?.status === 'holiday' ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                  onClick={() => onMark('holiday')}
                  isLoading={isPending}
                >
                  Holiday
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" /> 
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" /> 
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" /> 
            <span>Holiday</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
