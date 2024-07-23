import { SemanticVersion } from '@eonae/semantic-version';
import { readObj } from '@rsdk/common.node';
import type { Options } from 'ajv';
import { isAbsolute, join } from 'node:path';

import { Logger } from './logging';

export interface MiConfSettingsRaw {
  supported: string[];
  ajv: Options;
}

export class MiConfSettings {
  constructor(
    public readonly supported: SemanticVersion[],
    public readonly ajv: Options,
  ) {}

  public static async load(
    path = 'miconf.config.yml',
  ): Promise<MiConfSettings> {
    const fullpath = isAbsolute(path) ? path : join(process.cwd(), path);

    Logger.debug(`Loading settings from ${fullpath}`);
    const content = (await readObj(fullpath)) as MiConfSettingsRaw;

    return new MiConfSettings(
      content.supported.map((x) => new SemanticVersion(x)),
      content.ajv,
    );
  }
}
