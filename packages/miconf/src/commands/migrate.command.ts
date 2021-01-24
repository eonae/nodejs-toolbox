import { SemanticVersion } from '@eonae/semantic-version';
import {
  Config,
  MiConfSettings,
  MigrationsSet,
  SchemasSet,
  CaporalLogger
} from '../shared';

export interface MigrateArguments {
  configPath: string;
  from: string;
  to: string;
}

export interface MigrateOptions {
  migrationsDir?: string;
  schemasDir?: string;
  settingsFile?: string;
  additional?: Record<string, unknown>;
}

export const migrate = async (
  args: MigrateArguments,
  opts: MigrateOptions,
  logger: CaporalLogger
): Promise<void> => {
  logger.debug('Migrating...');
  const { configPath } = args;
  const { migrationsDir, schemasDir, settingsFile } = opts;
  const from = new SemanticVersion(args.from);
  const to = new SemanticVersion(args.to);

  const settings = await MiConfSettings.load(settingsFile);
  const schemas = await SchemasSet.load(schemasDir);
  const migrations = await MigrationsSet.load(migrationsDir);
  migrations.validateSufficiency(settings.supported);
  schemas.validateSufficiency(settings.supported);

  const config = await Config.load(configPath);
  schemas.validate(config, from);

  const updated = migrations.migrate(config, from, to);
  schemas.validate(updated, to);
  await updated.save();
};
