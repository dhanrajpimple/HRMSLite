import { Menu } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export const Header = ({ title, onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-800/50 bg-black/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-900"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Server Status</span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-semibold text-white">Live System</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
