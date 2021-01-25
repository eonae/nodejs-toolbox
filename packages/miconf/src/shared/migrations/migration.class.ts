/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
import { SemanticVersion } from '@eonae/semantic-version';
import { Config } from '../config.class';
import { Direction } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConfigMigration<Prev = any, Next = any> {
  from: SemanticVersion;
  to: SemanticVersion;
  up (prev: Prev): Next;
  down (next: Next): Prev;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ConfigMigrationWrapper<Prev = any, Next = any> {
  constructor (
    private inner: ConfigMigration<Prev, Next>
  ) {}

  public get to (): SemanticVersion {
    return this.inner.to.clone();
  }

  public get from (): SemanticVersion {
    return this.inner.from.clone();
  }

  public leadsTo (version: SemanticVersion, direction: Direction): boolean {
    const { from, to } = this.inner;
    return version.equals(direction === Direction.UP ? to : from);
  }

  public startsFrom (version: SemanticVersion, direction: Direction): boolean {
    const { from, to } = this.inner;
    return version.equals(direction === Direction.UP ? from : to);
  }

  public toString (direction: Direction = Direction.UP): string {
    const to = this.inner.to.toString();
    const from = this.inner.from.toString();
    return direction === Direction.UP ? `${from} -> ${to}` : `${to} -> ${from}`;
  }

  public applyTo (config: Config, direction: Direction): Config {
    // FIXME test what if there are "this" calls inside of up and down methods.
    const transformation = direction === Direction.UP
      ? (x: Prev) => this.inner.up(x)
      : (x: Next) => this.inner.down(x);
    console.log(`Migrating config ${this.toString(direction)}...`);
    const updated = config.apply(transformation);
    console.log({ was: config.content, now: updated.content });
    return updated;
  }
}
