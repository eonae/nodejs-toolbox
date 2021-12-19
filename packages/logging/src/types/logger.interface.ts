/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel } from './log-level.enum';

export type LogMessages =
| [string]
| [{ [key: string]: any }]
| [string, { [key: string]: any }?];

export type GetTraceIdFn = () => string | null;

export interface ILogger {
  log(level: LogLevel, messages: LogMessages, context?: string): void;

  /**
   * @deprecated
   */
  business(...messages: unknown[]): void;

  verbose(message: string, object?: { [key: string]: any }): void;

  debug(message: string, object?: { [key: string]: any }): void;

  info(message: string): void;

  warn(message: string): void;

  error(object: { [key: string]: any }): void;
  error(message: string): void;
  error(message: string, object: { [key: string]: any }): void;

  critical(object: { [key: string]: any }): void;
  critical(message: string): void;
  critical(message: string, object: { [key: string]: any }): void;
}
