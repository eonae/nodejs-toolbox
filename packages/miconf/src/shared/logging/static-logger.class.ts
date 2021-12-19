import { CaporalLogger } from './caporal-logger.interface';

export class Logger {
  static _logger: CaporalLogger = null;

  static set (logger: CaporalLogger): void {
    Logger._logger = logger;
  }

  static debug (message: string): void {
    Logger.check();
    Logger._logger.debug(message);
  }

  static info (message: string): void {
    Logger.check();
    Logger._logger.info(message);
  }

  static warn (message: string): void {
    Logger.check();
    Logger._logger.warn(message);
  }

  static error (message: string): void {
    Logger.check();
    Logger._logger.error(message);
  }

  private static check (): void {
    if (!Logger._logger) {
      throw new Error('Logger not initialized!');
    }
  }
}
