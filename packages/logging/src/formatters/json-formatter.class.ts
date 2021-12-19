/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel, ILogFormatter, LogMessages } from '../types';
import { normalizeObject, removeCircular } from '../helpers';

export class JSONFormatter implements ILogFormatter {
  format (level: LogLevel, context: string, messages: LogMessages, traceId?: string): string {
    let message: string | undefined;
    let object: { [key: string]: any } | undefined;

    const arg0 = messages[0];
    if (typeof arg0 === 'string') {
      [message, object] = messages as [string, { [key: string]: any } | undefined];
    } else {
      [object] = messages as [{ [key: string]: any }];
    }

    const log = {
      timestamp: Date.now(),
      level,
      traceId,
      context,
      message,
      object
    };

    return JSON.stringify(normalizeObject(log), removeCircular());
  }
}
