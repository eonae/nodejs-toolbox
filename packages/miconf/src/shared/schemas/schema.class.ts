/* eslint-disable no-console */

import Ajv from 'ajv';

import { isAbsolute, join } from 'path';
import { readObj } from '@libs/common';
import { Config } from '../config.class';

export class Schema<T = unknown> {
  private constructor (
    public readonly content: T
  ) { }

  public static async load<K = unknown> (path: string): Promise<Schema<K>> {
    const fullpath = isAbsolute(path) ? path : join(process.cwd(), path);
    const content = await readObj(fullpath);
    return new Schema(content as K);
  }

  public validate (config: Config<T>): unknown[] {
    const validate = new Ajv({ allErrors: true }).compile(this.content);
    console.log('Validating config...', config.content);
    validate(config.content);
    return validate.errors;
  }
}
