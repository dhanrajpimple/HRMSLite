import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'neutral' | 'info';
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<BadgeProps['variant']>, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  neutral: 'bg-slate-800 text-slate-400 border-slate-700',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export const Badge = ({ children, variant = 'neutral', className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
