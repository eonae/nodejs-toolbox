import type { CaporalLogger } from './caporal-logger.interface';

export class Logger {
  static _logger: CaporalLogger | null = null;

  static set(logger: CaporalLogger): void {
    this._logger = logger;
  }

  static debug(message: string): void {
    this._logger?.debug(message);
  }

  static info(message: string): void {
    this._logger?.info(message);
  }

  static warn(message: string): void {
    this._logger?.warn(message);
  }

  static error(message: string): void {
    this._logger?.error(message);
  }
}
