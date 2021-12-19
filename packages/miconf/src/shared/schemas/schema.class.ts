/* eslint-disable no-console */

import Ajv from 'ajv';

import { isAbsolute, join } from 'path';
import { readObj } from '@eonae/common';
import { Config } from '../config.class';
import { MiConfSettings } from '../miconf.settings';
import { Logger } from '..';

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

  public async validate (config: Config<T>): Promise<unknown[]> {
    const validate = new Ajv(this.settings.ajv).compile(this.content as any);
    Logger.info('Validating against schema...');

    await validate(config.content);
    return validate.errors;
  }
}
