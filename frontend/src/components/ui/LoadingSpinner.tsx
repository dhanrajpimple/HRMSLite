import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={`flex w-full items-center justify-center p-8 ${className}`}>
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);
