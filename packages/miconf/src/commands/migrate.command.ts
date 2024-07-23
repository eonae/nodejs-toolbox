import { SemanticVersion } from '@eonae/semantic-version';

import type { CaporalLogger } from '../shared';
import { Config, MiConfSettings, MigrationsSet, SchemasSet } from '../shared';
import { Logger } from '../shared/logging';

export type MigrateArguments = {
  configPath: string;
  from: string;
  to: string;
};

export type MigrateOptions = {
  migrationsDir?: string;
  schemasDir?: string;
  settingsFile?: string;
  additional?: Record<string, unknown>;
};

export const migrate = async (
  args: MigrateArguments,
  opts: MigrateOptions,
  logger: CaporalLogger,
): Promise<void> => {
  Logger.set(logger);

  const { configPath } = args;
  const { migrationsDir, schemasDir, settingsFile } = opts;

  const from = new SemanticVersion(args.from);
  const to = new SemanticVersion(args.to);

  logger.debug(`Preparing migration from ${args.from} to ${args.to}`);

  const settings = await MiConfSettings.load(settingsFile);

  const schemas = await SchemasSet.load(schemasDir, settings);

  schemas.validateSufficiency(settings.supported);

  const migrations = await MigrationsSet.load(migrationsDir);

  migrations.validateSufficiency(settings.supported);

  const config = await Config.load(configPath);

  await schemas.validate(config, from);

  const updated = await migrations.migrate(config, from, to);

  await schemas.validate(updated, to);
  await updated.save();
};
