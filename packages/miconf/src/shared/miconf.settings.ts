import { join, isAbsolute } from 'path';
import { readObj } from '@libs/common';
import { SemanticVersion } from '@eonae/semantic-version';

export class MiConfSettings {
  constructor (
    public readonly supported: SemanticVersion[]
  ) { }

  public static async load (path = 'miconf.config.yml'): Promise<MiConfSettings> {
    const fullpath = isAbsolute(path) ? path : join(process.cwd(), path);
    const content = await readObj(fullpath) as { supported: string[] };
    return new MiConfSettings(content.supported.map(x => new SemanticVersion(x)));
  }
}
