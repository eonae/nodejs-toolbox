import { readObj, saveObj } from '@rsdk/common.node';
import { cloneDeep } from 'lodash';
import { isAbsolute, join } from 'node:path';

import type { Transformation } from './migrations/types';
import { Logger } from './logging';

export class Config<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  constructor(
    public readonly fullpath: string,
    public readonly content: T,
  ) {}

  public static async load<
    K extends Record<string, unknown> = Record<string, unknown>,
  >(path: string): Promise<Config<K>> {
    const fullpath = isAbsolute(path) ? path : join(process.cwd(), path);

    Logger.info(`Loading source file from ${fullpath}`);
    const content = await readObj(fullpath);

    return new Config(fullpath, content as K);
  }

  public async apply(transformation: Transformation): Promise<Config<T>> {
    const transformed = transformation(cloneDeep(this.content)) as T;

    return new Config(this.fullpath, transformed);
  }

  public async save(): Promise<void> {
    await saveObj(this.content, this.fullpath);
  }
}
