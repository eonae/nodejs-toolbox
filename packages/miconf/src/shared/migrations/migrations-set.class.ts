import { promises as fs } from 'fs';
import { join, isAbsolute } from 'path';
import { Constructor } from '@eonae/common';
import { SemanticVersion } from '@eonae/semantic-version';
import { getSequence } from '../../get-sequence.function';
import { ConfigMigration, ConfigMigrationWrapper } from './migration.class';
import { Config } from '../config.class';
import { Direction } from './types';
import { MissingMigrationError } from '../exceptions';
import { Logger } from '..';

const MIGRATION_FILE_PATTERN = /^migration-(\S+)(.js|.ts)$/;

export type NeededMigration = { from: SemanticVersion, to: SemanticVersion };

export const importAndInstantiate = async (fullname: string): Promise<ConfigMigrationWrapper> => {
  const Migration = (await import(fullname)).default as Constructor<ConfigMigration>;
  return new ConfigMigrationWrapper(new Migration());
};

export class MigrationsSet {
  constructor (
    private migrations: ConfigMigrationWrapper[]
  ) { }

  public async migrate (
    config: Config,
    from: SemanticVersion,
    to: SemanticVersion
  ): Promise<Config> {
    const direction = to.isGreaterThan(from) ? Direction.UP : Direction.DOWN;
    const initial = this.migrations.find(x => x.startsFrom(from, direction));
    const final = this.migrations.find(x => x.leadsTo(to, direction));

    const sequence = getSequence(
      this.migrations,
      this.migrations.indexOf(initial),
      this.migrations.indexOf(final)
    );

    Logger.info(`Generated sequence of ${sequence.length} (${direction}) migrations`);

    let result = config;

    for (const migration of sequence) {
      result = await migration.applyTo(config, direction);
    }

    return result;
  }

  public validateSufficiency (versions: SemanticVersion[]): void {
    // FIXME Assuming versions are ordered already.
    const needed = versions.reduce((acc: NeededMigration[], v, i) => {
      if (i !== versions.length - 1) {
        acc.push({ from: v, to: versions[i + 1] });
      }
      return acc;
    }, []);

    const missing = needed
      .filter(
        m => !this.migrations
          .find(x => x.from.equals(m.from) && x.to.equals(m.to))
      );

    if (missing.length > 0) {
      throw new MissingMigrationError(missing);
    }
  }

  public static async load (dir = 'migrations'): Promise<MigrationsSet> {
    const fulldir = isAbsolute(dir) ? dir : join(process.cwd(), dir);

    Logger.info(`Loading migrations from directory: ${fulldir}`);
    const migrationFiles = (await fs.readdir(fulldir))
      .filter(x => MIGRATION_FILE_PATTERN.test(x));

    const migrations = (await Promise.all(
      migrationFiles
        .filter(filename => /.js$/.test(filename))
        .map(filename => importAndInstantiate(join(fulldir, filename)))
    ));
    return new MigrationsSet(migrations);
  }
}
