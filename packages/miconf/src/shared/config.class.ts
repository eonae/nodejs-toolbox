import { cloneDeep } from 'lodash';
import { join, isAbsolute } from 'path';
import { readObj, saveObj } from '@eonae/common';
import { Transformation } from './migrations/types';

export class Config<T = unknown> {
  constructor (
    public readonly fullpath: string,
    public readonly content: T
  ) { }

  public apply (transformation: Transformation): Config<T> {
    const transformed = transformation(cloneDeep(this.content)) as T;
    return new Config(this.fullpath, transformed);
  }

  public static async load<K = unknown> (path: string): Promise<Config<K>> {
    const fullpath = isAbsolute(path) ? path : join(process.cwd(), path);
    const content = await readObj(fullpath);
    return new Config(fullpath, content as K);
  }

  public async save (): Promise<void> {
    await saveObj(this.content, this.fullpath);
  }
}
