import type { LucideIcon } from 'lucide-react';
import { Info } from 'lucide-react';

export const EmptyState = ({ 
  title, 
  description, 
  icon: Icon = Info 
}: { 
  title: string; 
  description: string; 
  icon?: LucideIcon 
}) => (
  <div className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-12 text-center">
    <div className="mb-4 rounded-full bg-gray-50 p-3">
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="mb-1 text-base font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);
