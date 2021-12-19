import { LogLevel } from './log-level.enum';

export interface ILogFormatter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format (level: LogLevel, context: string, messages: any[], traceId?: string): string;
}
