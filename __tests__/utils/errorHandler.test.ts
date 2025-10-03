import {
  AppError,
  NetworkError,
  handleError,
  withRetry,
  withTimeout,
  getUserFriendlyMessage,
} from '@/utils/errorHandler';

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Error Handler', () => {
  describe('AppError', () => {
    it('should create app error with correct properties', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 'User message', true);
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.userMessage).toBe('User message');
      expect(error.recoverable).toBe(true);
    });
  });

  describe('NetworkError', () => {
    it('should create network error', () => {
      const error = new NetworkError('Connection failed');
      
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.userMessage).toContain('internet connection');
    });
  });

  describe('handleError', () => {
    it('should handle AppError', () => {
      const appError = new AppError('Test', 'TEST', 'User message');
      const result = handleError(appError, 'test context');
      
      expect(result).toBe(appError);
    });

    it('should convert Error to AppError', () => {
      const error = new Error('Test error');
      const result = handleError(error, 'test context');
      
      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe('Test error');
    });

    it('should detect network errors', () => {
      const error = new Error('network request failed');
      const result = handleError(error, 'test context');
      
      expect(result).toBeInstanceOf(NetworkError);
    });
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      
      const result = await withRetry(fn, { maxAttempts: 3 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');
      
      const result = await withRetry(fn, { maxAttempts: 3, delayMs: 10 });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max attempts', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Always fails'));
      
      await expect(
        withRetry(fn, { maxAttempts: 2, delayMs: 10 })
      ).rejects.toThrow();
      
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('withTimeout', () => {
    it('should succeed before timeout', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      
      const result = await withTimeout(fn, 1000, 'test');
      
      expect(result).toBe('success');
    });

    it('should timeout if too slow', async () => {
      const fn = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      
      await expect(
        withTimeout(fn, 100, 'test')
      ).rejects.toThrow('timed out');
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return user message from AppError', () => {
      const error = new AppError('Tech message', 'CODE', 'User message');
      
      expect(getUserFriendlyMessage(error)).toBe('User message');
    });

    it('should return generic message for Error', () => {
      const error = new Error('Technical error');
      
      expect(getUserFriendlyMessage(error)).toBe('Something went wrong. Please try again.');
    });
  });
});
