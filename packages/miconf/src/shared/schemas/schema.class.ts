/* eslint-disable no-console */

import Ajv from 'ajv';

import { isAbsolute, join } from 'path';
import { readObj } from '@eonae/common';
import { Config } from '../config.class';
import { MiConfSettings } from '../miconf.settings';

export class Schema<T = unknown> {
  private constructor (
    public readonly content: T,
    public settings: MiConfSettings
  ) { }

  public static async load<K = unknown> (
    path: string,
    settings?: MiConfSettings
  ): Promise<Schema<K>> {
    const fullpath = isAbsolute(path) ? path : join(process.cwd(), path);
    return new Schema(
      await readObj(fullpath) as K,
      settings || await MiConfSettings.load()
    );
  }

  public validate (config: Config<T>): unknown[] {
    const validate = new Ajv(this.settings.ajv).compile(this.content);
    console.log('Validating config...', config.content);
    validate(config.content);
    return validate.errors;
  }
}
