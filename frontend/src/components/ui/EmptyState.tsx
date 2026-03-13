import type { LucideIcon } from 'lucide-react';
import { Info } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export const EmptyState = ({ title, description, icon: Icon = Info }: EmptyStateProps) => (
  <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 p-12 text-center">
    <div className="mb-4 rounded-full bg-slate-800 p-3">
      <Icon className="h-8 w-8 text-slate-500" />
    </div>
    <h3 className="mb-1 text-base font-semibold text-white">{title}</h3>
    <p className="text-sm text-slate-400">{description}</p>
  </div>
);
