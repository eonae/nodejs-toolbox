import { Options } from 'ajv';
import { join, isAbsolute } from 'path';
import { readObj } from '@eonae/common';
import { SemanticVersion } from '@eonae/semantic-version';

export interface MiConfSettingsRaw {
  supported: string[],
  ajv: Options
}

export class MiConfSettings {
  constructor (
    public readonly supported: SemanticVersion[],
    public readonly ajv: Options
  ) { }

  public static async load (path = 'miconf.config.yml'): Promise<MiConfSettings> {
    const fullpath = isAbsolute(path) ? path : join(process.cwd(), path);
    const content = await readObj(fullpath) as MiConfSettingsRaw;
    return new MiConfSettings(
      content.supported.map(x => new SemanticVersion(x)),
      content.ajv
    );
  }
}
