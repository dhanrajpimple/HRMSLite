import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({ 
  message = 'An error occurred while loading data.', 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void;
}) => (
  <div className="flex w-full flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50 p-8 text-center">
    <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
    <p className="mb-4 text-sm font-medium text-red-700">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry} className="flex items-center gap-2">
        <RotateCcw className="h-4 w-4" />
        Retry
      </Button>
    )}
  </div>
);
