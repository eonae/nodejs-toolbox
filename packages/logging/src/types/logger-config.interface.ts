import { LogFormat } from './log-format.enum';
import { ILogFormatter } from './log-formatter.interface';
import { LogLevel } from './log-level.enum';
import { GetTraceIdFn } from './logger.interface';

export interface ILoggerConfig {
  level?: LogLevel;
  format?: LogFormat | ILogFormatter;
  getTraceId?: GetTraceIdFn;
}
