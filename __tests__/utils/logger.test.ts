import { logger } from '@/utils/logger';

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log info messages', () => {
    logger.info('Test info message', { data: 'test' });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      expect.stringContaining('Test info message'),
      expect.objectContaining({ data: 'test' })
    );
  });

  it('should log error messages', () => {
    const error = new Error('Test error');
    logger.error('Error occurred', error, { context: 'test' });

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR]'),
      expect.stringContaining('Error occurred'),
      error,
      expect.objectContaining({ context: 'test' })
    );
  });

  it('should log warning messages', () => {
    logger.warn('Test warning', { severity: 'medium' });

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[WARN]'),
      expect.stringContaining('Test warning'),
      expect.objectContaining({ severity: 'medium' })
    );
  });

  it('should log debug messages in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    logger.debug('Debug message', { detail: 'test' });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[DEBUG]'),
      expect.stringContaining('Debug message'),
      expect.objectContaining({ detail: 'test' })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should include timestamp in logs', () => {
    logger.info('Test message');

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
      expect.any(String),
      expect.any(Object)
    );
  });

  it('should handle objects in log messages', () => {
    const complexObject = {
      nested: { data: 'value' },
      array: [1, 2, 3],
    };

    logger.info('Complex log', complexObject);

    expect(console.log).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('Complex log'),
      expect.objectContaining(complexObject)
    );
  });
});
