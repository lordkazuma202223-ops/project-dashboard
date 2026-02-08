/**
 * Logger utility for consistent logging across the application
 * In production, these logs should be sent to a monitoring service (e.g., Sentry, LogRocket)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
      // In production, only log errors and warnings
      return level === 'error' || level === 'warn';
    }
    // In development, log everything
    return true;
  }

  private formatLog(entry: LogEntry): string {
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
  }

  private sendToMonitoring(entry: LogEntry): void {
    const isProd = process.env.NODE_ENV === 'production';
    // In production, send to monitoring service
    // Example: Sentry.captureException(entry.data);
    if (typeof window !== 'undefined' && isProd) {
      // Example implementation for a monitoring service
      // fetch('/api/logs', {
      //   method: 'POST',
      //   body: JSON.stringify(entry),
      // });
    }
  }

  debug(message: string, data?: unknown): void {
    const entry: LogEntry = {
      level: 'debug',
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (this.shouldLog('debug')) {
      console.debug(this.formatLog(entry), data);
    }
  }

  info(message: string, data?: unknown): void {
    const entry: LogEntry = {
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (this.shouldLog('info')) {
      console.info(this.formatLog(entry), data);
    }
  }

  warn(message: string, data?: unknown): void {
    const entry: LogEntry = {
      level: 'warn',
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (this.shouldLog('warn')) {
      console.warn(this.formatLog(entry), data);
    }

    this.sendToMonitoring(entry);
  }

  error(message: string, error?: unknown): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      data: error,
      timestamp: new Date().toISOString(),
    };

    if (this.shouldLog('error')) {
      console.error(this.formatLog(entry), error);
    }

    this.sendToMonitoring(entry);
  }
}

// Export singleton instance
export const logger = new Logger();
