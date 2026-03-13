import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'neutral' | 'info';
  className?: string;
}

export const Badge = ({ children, variant = 'neutral', className }: BadgeProps) => {
  const variants = {
    success: 'bg-green-100 text-green-700 border-green-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
