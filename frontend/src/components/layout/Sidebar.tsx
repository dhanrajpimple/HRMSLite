import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  User as UserIcon
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Employees', path: '/employees', icon: Users },
  { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
];

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-slate-800/50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center px-6 border-b border-slate-800/50 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <span className="text-white font-black text-lg">H</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 p-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                )}
              >
                <item.icon className={clsx(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  "group-[.active]:text-white text-slate-500"
                )} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Admin Badge */}
          <div className="border-t border-slate-800/50 p-6 bg-slate-950/50">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900/50 border border-slate-800/50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-white">Admin User</p>
                <p className="truncate text-[10px] uppercase tracking-wider text-slate-500 font-bold">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
