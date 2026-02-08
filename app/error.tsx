'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    logger.error('Application error occurred', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="w-16 h-16 text-red-400" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-slate-400">An unexpected error occurred. Please try again.</p>
        </div>
        <button
          onClick={reset}
          className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg transition-all duration-200 font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
