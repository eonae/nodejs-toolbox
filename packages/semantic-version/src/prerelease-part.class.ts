import { parseVersionPart } from './parse-version-part.function';

export class PrereleasePart {
  public prefix: string;
  public increment: number;

  constructor(prefix: string, incrementStringOrNumber: number | string) {
    const increment =
      typeof incrementStringOrNumber === 'number'
        ? incrementStringOrNumber
        : parseVersionPart(incrementStringOrNumber);

    if (!prefix && typeof increment === 'number') {
      throw new Error('There can`t be increment part without prefix!');
    }

    if (prefix && typeof increment !== 'number') {
      throw new Error('There can`t be prefix part without increment');
    }

    this.prefix = prefix;
    this.increment = increment;
  }

  toString(): string {
    return this.prefix ? [this.prefix, this.increment].join('.') : '';
  }
}
