import { Config, CaporalLogger, Schema, AjvError } from '../shared';

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
  logger.debug('Validating...');
  const { configPath, schemaPath } = args;

  const config = await Config.load(configPath);
  const schema = await Schema.load(schemaPath);

  const errors = schema.validate(config);
  if (errors) {
    // eslint-disable-next-line no-console
    console.error('Errors:', errors);
    throw new AjvError('Validation failed!', errors);
  }
};
