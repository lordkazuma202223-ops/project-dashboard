import { logger } from '@/lib/logger';

describe('Logger', () => {
  beforeEach(() => {
    // Mock console methods
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log debug messages in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    logger.debug('Test debug message', { data: 'test' });
    expect(console.debug).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should log info messages in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    logger.info('Test info message', { data: 'test' });
    expect(console.info).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should log warn messages in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    logger.warn('Test warning message', { data: 'test' });
    expect(console.warn).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should log error messages in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    logger.error('Test error message', new Error('Test error'));
    expect(console.error).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should not log debug messages in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    logger.debug('Test debug message');
    expect(console.debug).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should not log info messages in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    logger.info('Test info message');
    expect(console.info).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should format log entries correctly', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    logger.info('Test message');

    const logCall = (console.info as jest.Mock).mock.calls[0][0];
    expect(logCall).toContain('INFO:');
    expect(logCall).toContain('Test message');

    process.env.NODE_ENV = originalEnv;
  });
});
