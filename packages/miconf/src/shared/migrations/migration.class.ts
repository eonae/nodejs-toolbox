/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
import type { SemanticVersion } from '@eonae/semantic-version';

import type { Config } from '../config.class';
import { Logger } from '../logging';

import { Direction } from './types';

export interface ConfigMigration<Prev = any, Next = any> {
  from: SemanticVersion;
  to: SemanticVersion;
  up(prev: Prev): Next;
  down(next: Next): Prev;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ConfigMigrationWrapper<Prev = any, Next = any> {
  constructor(private inner: ConfigMigration<Prev, Next>) {}

  public get to(): SemanticVersion {
    return this.inner.to.clone();
  }

  public get from(): SemanticVersion {
    return this.inner.from.clone();
  }

  public leadsTo(version: SemanticVersion, direction: Direction): boolean {
    const { from, to } = this.inner;

    return version.equals(direction === Direction.UP ? to : from);
  }

  public startsFrom(version: SemanticVersion, direction: Direction): boolean {
    const { from, to } = this.inner;

    return version.equals(direction === Direction.UP ? from : to);
  }

  public toString(direction: Direction = Direction.UP): string {
    const to = this.inner.to.toString();
    const from = this.inner.from.toString();

    return direction === Direction.UP ? `${from} -> ${to}` : `${to} -> ${from}`;
  }

  public async applyTo(config: Config, direction: Direction): Promise<Config> {
    // FIXME: test what if there are "this" calls inside of up and down methods.
    const transformation =
      direction === Direction.UP
        ? (x: Prev): Next => this.inner.up(x)
        : (x: Next): Prev => this.inner.down(x);

    Logger.info(`Applying migration ${this.toString(direction)}...`);

    // FIXME: typings
    const updated = await config.apply(transformation as any);

    return updated;
  }
}
