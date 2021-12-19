import { Config, CaporalLogger, Schema, AjvError, MiConfSettings, Logger } from '../shared';

export interface ValidateAgruments {
  configPath: string;
  schemaPath: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ValidateOptions { }

export const validate = async (
  args: ValidateAgruments,
  opts: ValidateOptions,
  logger: CaporalLogger
): Promise<void> => {
  Logger.set(logger);

  logger.debug('Validating...');
  const { configPath, schemaPath } = args;

  const settings = await MiConfSettings.load();
  const config = await Config.load(configPath);
  const schema = await Schema.load(schemaPath, settings);

  const errors = await schema.validate(config);
  if (errors) {
    throw new AjvError('Validation failed!', errors);
  }
};
