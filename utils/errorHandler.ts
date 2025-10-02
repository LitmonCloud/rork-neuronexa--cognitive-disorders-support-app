import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public recoverable: boolean = true,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(
      message,
      'NETWORK_ERROR',
      'Unable to connect. Please check your internet connection and try again.',
      true,
      context
    );
    this.name = 'NetworkError';
  }
}

export class AIServiceError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(
      message,
      'AI_SERVICE_ERROR',
      'Nexa is having trouble right now. Using fallback responses.',
      true,
      context
    );
    this.name = 'AIServiceError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(
      message,
      'STORAGE_ERROR',
      'Unable to save your data. Please try again.',
      true,
      context
    );
    this.name = 'StorageError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field: string, context?: Record<string, unknown>) {
    super(
      message,
      'VALIDATION_ERROR',
      `Please check your ${field} and try again.`,
      true,
      { field, ...context }
    );
    this.name = 'ValidationError';
  }
}

export function handleError(error: unknown, context: string): AppError {
  logger.error(`Error in ${context}`, error instanceof Error ? error : new Error(String(error)));

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new NetworkError(error.message, { originalError: error.message });
    }

    if (error.message.includes('storage') || error.message.includes('AsyncStorage')) {
      return new StorageError(error.message, { originalError: error.message });
    }

    return new AppError(
      error.message,
      'UNKNOWN_ERROR',
      'Something went wrong. Please try again.',
      true,
      { originalError: error.message }
    );
  }

  return new AppError(
    String(error),
    'UNKNOWN_ERROR',
    'Something went wrong. Please try again.',
    true
  );
}

export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    return 'Something went wrong. Please try again.';
  }

  return 'An unexpected error occurred.';
}

export function isRecoverableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.recoverable;
  }
  return true;
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const appError = handleError(error, context);
    
    if (fallback !== undefined && appError.recoverable) {
      logger.warn(`Using fallback for ${context}`, { error: appError.message });
      return fallback;
    }
    
    throw appError;
  }
}

export function logAndContinue(error: unknown, context: string): void {
  const appError = handleError(error, context);
  logger.warn(`Non-critical error in ${context}`, { 
    code: appError.code,
    message: appError.message,
  });
}
