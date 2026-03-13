import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  message = 'An error occurred while loading data.',
  onRetry,
}: ErrorStateProps) => (
  <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
    <AlertCircle className="mb-3 h-8 w-8 text-rose-500" />
    <p className="mb-4 text-sm font-medium text-rose-400">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry} className="flex items-center gap-2">
        <RotateCcw className="h-4 w-4" />
        Retry
      </Button>
    )}
  </div>
);
