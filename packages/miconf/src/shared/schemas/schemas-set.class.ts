/* eslint-disable no-console */

import { promises as fs } from 'fs';
import { join, isAbsolute } from 'path';
import { SemanticVersion } from '@eonae/semantic-version';
import { MissingSchemasError, AjvError } from '../exceptions';
import { Config } from '../config.class';
import { Schema } from './schema.class';
import { MiConfSettings } from '../miconf.settings';
import { Logger } from '../logging';

const SCHEMAS_FILE_PATTERN = /^schema-(\S+).json$/;

export class SchemasSet {
  private constructor (
    private schemas: Map<string, Schema>
  ) { }

  public async validate (config: Config, version: SemanticVersion): Promise<void> {
    const schema = this.schemas.get(version.toString());
    if (!schema) {
      throw new Error(`No schema for <${version.toString()}> found in the set!`);
    }

    const errors = await schema.validate(config);

    if (errors) {
      throw new AjvError(`Config validation failed for version <${version.toString()}>!`, errors);
    }
  }

  public validateSufficiency (versions: SemanticVersion[]): void {
    const noSchema = versions.filter(v => !this.schemas.get(v.toString()));
    if (noSchema.length > 0) {
      throw new MissingSchemasError(noSchema);
    }

    Logger.info('Schemas set validated successfully!');
  }

  public static async load (dir = 'schemas', settings?: MiConfSettings): Promise<SchemasSet> {
    const fulldir = isAbsolute(dir) ? dir : join(process.cwd(), dir);

    Logger.info(`Loading validation schemas from directory: ${fulldir}`);
    const schemaFiles = (await fs.readdir(fulldir))
      .filter(x => SCHEMAS_FILE_PATTERN.test(x));

    const schemas = await Promise.all(
      schemaFiles.map(async filename => ({
        version: SCHEMAS_FILE_PATTERN.exec(filename)[1],
        schema: await Schema.load(
          join(fulldir, filename),
          settings || await MiConfSettings.load()
        )
      }))
    );

    return new SchemasSet(
      schemas.reduce(
        (acc, x) => acc.set(x.version, x.schema),
        new Map<string, Schema>()
      )
    );
  }
}
