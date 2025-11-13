import { logger } from '@/utils/logger';

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log info messages', () => {
    logger.info('Test info message', { data: 'test' });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] \[INFO\] Test info message {"data":"test"}/)
    );
  });

  it('should log error messages', () => {
    const error = new Error('Test error');
    logger.error('Error occurred', error, { context: 'test' });

    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] \[ERROR\] Error occurred {"context":"test"}/),
      error
    );
  });

  it('should log warning messages', () => {
    logger.warn('Test warning', { severity: 'medium' });

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] \[WARN\] Test warning {"severity":"medium"}/)
    );
  });

  it('should log debug messages in development', () => {
    logger.debug('Debug message', { detail: 'test' });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[.*\] \[DEBUG\] Debug message {"detail":"test"}/)
    );
  });

  it('should include timestamp in logs', () => {
    logger.info('Test message');

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] Test message/)
    );
  });

  it('should handle objects in log messages', () => {
    const complexObject = {
      nested: { data: 'value' },
      array: [1, 2, 3],
    };

    logger.info('Complex log', complexObject);

    const call = (console.log as jest.Mock).mock.calls[0][0];
    expect(call).toContain('[INFO]');
    expect(call).toContain('Complex log');
    expect(call).toContain('"nested"');
    expect(call).toContain('"array"');
  });
});
