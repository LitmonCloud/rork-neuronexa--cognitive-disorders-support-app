type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = __DEV__;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `${prefix} ${message}${contextStr}`;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      const entry: LogEntry = {
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        context,
      };
      this.addLog(entry);
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    this.addLog(entry);
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    this.addLog(entry);
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };
    this.addLog(entry);
    console.error(this.formatMessage('error', message, context), error);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

export function logTaskAction(action: string, taskId: string, details?: Record<string, unknown>): void {
  logger.info(`Task ${action}`, { taskId, ...details });
}

export function logAIInteraction(type: string, success: boolean, duration?: number): void {
  logger.info('AI Interaction', { type, success, duration });
}

export function logUserAction(action: string, screen: string, details?: Record<string, unknown>): void {
  logger.debug('User Action', { action, screen, ...details });
}

export function logError(context: string, error: Error, additionalInfo?: Record<string, unknown>): void {
  logger.error(`Error in ${context}`, error, additionalInfo);
}
