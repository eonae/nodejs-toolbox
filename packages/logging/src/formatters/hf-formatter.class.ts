/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';

import { ILogFormatter, LogLevel, LogMessages } from '../types';
import { stringifyObject } from '../helpers';

const LEVEL_COLORS = {
  business: chalk.strikethrough.blueBright,
  critical: chalk.underline.redBright,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.blue,
  debug: chalk.dim.white,
  verbose: chalk.gray
};
const MAX_LEVEL_LENGTH = Math.max(...Object.keys(LEVEL_COLORS).map(k => k.length));

export class HumanFriendlyFormatter implements ILogFormatter {
  format (level: LogLevel, context: string, messages: LogMessages, traceId = ''): string {
    let message: string | undefined;
    let object: { [key: string]: any } | undefined;

    const arg0 = messages[0];
    if (typeof arg0 === 'string') {
      [message, object] = messages as [string, { [key: string]: any } | undefined];
    } else {
      [object] = messages as [{ [key: string]: any }];
    }

    return [
      chalk.green(this._getTimestamp()),
      `${LEVEL_COLORS[level](level.toUpperCase())}${' '.repeat(MAX_LEVEL_LENGTH - level.length)}`,
      [
        context && chalk.magentaBright(context),
        traceId && chalk.cyan(traceId)
      ].filter(Boolean).join(':'),
      message,
      object === undefined ? undefined : stringifyObject(object, true)
    ].filter(Boolean).join(' ');
  }

  private _getTimestamp (): string {
    const now = new Date();
    const dateWithTimezoneOffset = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );

    return new Date(dateWithTimezoneOffset)
      .toISOString()
      .substring(0, 23)
      .replace('T', ' ');
  }
}
