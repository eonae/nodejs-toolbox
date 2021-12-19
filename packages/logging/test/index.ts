import { Logger, LogFormat, LogLevel } from '../src';

const main = () => {
  const hfLogger = new Logger(
    'Human Friendly Context',
    { format: LogFormat.friendly, level: LogLevel.verbose }
  );

  const jsonLogger = new Logger(
    'JSON Context',
    { format: LogFormat.friendly, level: LogLevel.verbose }
  );

  const multiMessage: unknown[] = [
    12345,
    null,
    undefined,
    'text text !!!',
    { message: 'this a inner message' },
    new Error('Error message')
  ];

  for (const logger of [hfLogger, jsonLogger]) {
    logger.verbose('verbose message', multiMessage);
    logger.debug('debug message', multiMessage);
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message', multiMessage);
    logger.critical('critical message', multiMessage);
  }
};

main();
