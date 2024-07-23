import { readObj, saveObj } from '@rsdk/common.node';
import { existsSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

import type { ManifestContent } from './manifest-content.interface';

export class Manifest {
  constructor(
    private readonly fullpath: string,
    public readonly content: ManifestContent,
  ) {}

  public static async load(dir: string): Promise<Manifest> {
    const fullpath = Manifest.getFullpath(dir);
    const content = await readObj(fullpath);

    return new Manifest(fullpath, content as ManifestContent);
  }

  private static getFullpath = (dir: string): string => {
    const absOrRelative = join(dir, 'package.json');
    const fullpath = isAbsolute(absOrRelative)
      ? absOrRelative
      : join(process.cwd(), absOrRelative);
    if (!existsSync(fullpath)) {
      throw new Error(`Manifest file <${fullpath}> doesn't exist.`);
    }
    return fullpath;
  };

  public save(): Promise<void> {
    return saveObj(this.content, this.fullpath);
  }
}
