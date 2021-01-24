/* eslint-disable no-console */
import { SemanticVersion } from '@eonae/semantic-version';
import { Config } from '../config.class';
import { Direction } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class ConfigMigration<Prev = any, Next = any> {
  abstract from (): SemanticVersion;

  abstract to (): SemanticVersion;

  abstract up (prev: Prev): Next;

  abstract down (next: Next): Prev;

  public leadsTo (version: SemanticVersion, direction: Direction): boolean {
    return version.equals(direction === Direction.UP ? this.to() : this.from());
  }

  public startsFrom (version: SemanticVersion, direction: Direction): boolean {
    return version.equals(direction === Direction.UP ? this.from() : this.to());
  }

  public toString (direction: Direction = Direction.UP): string {
    const to = this.to().toString();
    const from = this.from().toString();
    return direction === Direction.UP ? `${from} -> ${to}` : `${to} -> ${from}`;
  }

  public applyTo (config: Config, direction: Direction): Config {
    // FIXME test what if there are "this" calls inside of up and down methods.
    const transformation = direction === Direction.UP
      ? (x: Prev) => this.up(x)
      : (x: Next) => this.down(x);
    console.log(`Migrating config ${this.toString(direction)}...`);
    const updated = config.apply(transformation);
    console.log({ was: config.content, now: updated.content });
    return updated;
  }
}
