import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const ErrorBanner = ({ message, onRetry }) => (
  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-4">
    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-red-400">{message || 'Something went wrong.'}</p>
    </div>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);
