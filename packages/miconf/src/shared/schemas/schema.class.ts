import { readObj } from '@rsdk/common.node';
import type { ErrorObject } from 'ajv';
import Ajv from 'ajv';
import { isAbsolute, join } from 'node:path';

import type { Config } from '../config.class';
import { Logger } from '../logging';
import { MiConfSettings } from '../miconf.settings';

export class Schema<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  private constructor(
    public readonly content: T,
    public settings: MiConfSettings,
  ) {}

  public static async load<
    K extends Record<string, unknown> = Record<string, unknown>,
  >(path: string, settings?: MiConfSettings): Promise<Schema<K>> {
    const fullpath = isAbsolute(path) ? path : join(process.cwd(), path);

    return new Schema(
      (await readObj(fullpath)) as K,
      settings || (await MiConfSettings.load()),
    );
  }

  public async validate(config: Config<T>): Promise<ErrorObject[] | null> {
    const validate = new Ajv(this.settings.ajv).compile(this.content);

    Logger.info('⏳ Validating against schema...');

    validate(config.content);
    return validate.errors ?? null;
  }
}
