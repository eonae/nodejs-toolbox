/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructor, enumValues } from '@libs/common';
import {
  GetTraceIdFn,
  ILogFormatter,
  ILogger,
  ILoggerConfig,
  LogFormat,
  LogLevel,
  LogMessages
} from '../types';
import { HumanFriendlyFormatter, JSONFormatter } from '../formatters';

const DEFAULT_CONTEXT = 'DEFAULT';
const DEFAULT_LEVEL = LogLevel.info;
const DEFAULT_FORMAT = LogFormat.friendly;
const LEVELS = enumValues(LogLevel);
const FORMATTERS = new Map<LogFormat, new() => ILogFormatter>()
  .set(LogFormat.json, JSONFormatter)
  .set(LogFormat.friendly, HumanFriendlyFormatter);

export class Logger implements ILogger {
  private readonly context: string;

  private readonly levelIndex: number;

  private readonly formatter: ILogFormatter;

  private readonly getTraceId?: GetTraceIdFn;

  constructor (
    context: string | Constructor = DEFAULT_CONTEXT,
    config: ILoggerConfig = {}
  ) {
    this.context = typeof context === 'function' ? context.name : context;

    const {
      level = process.env.LOG_LEVEL,
      format = process.env.LOG_FORMAT,
      getTraceId
    } = config;

    this.getTraceId = getTraceId;

    this.levelIndex = LEVELS.includes(level)
      ? LEVELS.indexOf(level)
      : LEVELS.indexOf(DEFAULT_LEVEL);

    if (typeof format === 'object') {
      this.formatter = format;

      return;
    }

    const Formatter = FORMATTERS.get(format as LogFormat || DEFAULT_FORMAT);

    if (!Formatter) {
      throw new Error(`Unknown format: ${format}`);
    }

    this.formatter = new Formatter();
  }

  /**
   * @deprecated
   */
  business (message: string, object?: object): void {
    this.log(LogLevel.business, [message, object]);
  }

  verbose (message: string, object?: object): void {
    this.log(LogLevel.verbose, [message, object]);
  }

  debug (message: string, object?: object): void {
    this.log(LogLevel.debug, [message, object]);
  }

  info (message: string): void {
    this.log(LogLevel.info, [message]);
  }

  warn (message: string): void {
    this.log(LogLevel.warn, [message]);
  }

  error(object: object): void;
  error(message: string): void;
  error(message: string, object: object): void;
  error (messageOrObject: string | object, object?: object): void {
    this.log(LogLevel.error, [messageOrObject, object] as LogMessages);
  }

  critical(object: object): void
  critical(message: string): void
  critical(message: string, object: object): void
  critical (messageOrObject: string | object, object?: object): void {
    this.log(LogLevel.critical, [messageOrObject, object] as LogMessages);
  }

  log (
    level: LogLevel,
    messages: LogMessages,
    context: string = this.context
  ): void {
    if (LEVELS.indexOf(level) > this.levelIndex) {
      return;
    }

    const traceId = this.getTraceId?.();
    const formattedMessage = this.formatter.format(level, context, messages, traceId);
    process.stdout.write(formattedMessage);
    process.stdout.write('\n'); // If windows?
  }
}
