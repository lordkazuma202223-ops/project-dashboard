'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      logger.error('Uncaught error occurred', event.error);
      // In production, sent to error tracking service (e.g., Sentry)
    };

    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection occurred', event.reason);
      // In production, sent to error tracking service (e.g., Sentry)
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return <>{children}</>;
}
