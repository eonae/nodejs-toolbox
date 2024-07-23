/* eslint-disable no-console */

import type { SemanticVersion } from '@eonae/semantic-version';
import { promises as fs } from 'node:fs';
import { isAbsolute, join } from 'node:path';

import type { Config } from '../config.class';
import { AjvError, MissingSchemasError } from '../exceptions';
import { Logger } from '../logging';
import { MiConfSettings } from '../miconf.settings';

import { Schema } from './schema.class';

const SCHEMAS_FILE_PATTERN = /^schema-(\S+).json$/;

export class SchemasSet {
  private constructor(private schemas: Map<string, Schema>) {}

  public static async load(
    dir = 'schemas',
    settings?: MiConfSettings,
  ): Promise<SchemasSet> {
    const fulldir = isAbsolute(dir) ? dir : join(process.cwd(), dir);

    Logger.info(`Loading validation schemas from directory: ${fulldir}`);
    const files = await fs.readdir(fulldir);
    const schemaFiles = files.filter((x) => SCHEMAS_FILE_PATTERN.test(x));

    const schemas = await Promise.all(
      schemaFiles.map(async (filename) => {
        const version = SCHEMAS_FILE_PATTERN.exec(filename)?.[1];
        if (!version) {
          throw new Error(
            `Can't retrieve schema version from filename: ${filename}`,
          );
        }

        return {
          version,
          schema: await Schema.load(
            join(fulldir, filename),
            settings || (await MiConfSettings.load()),
          ),
        };
      }),
    );

    return new SchemasSet(
      schemas.reduce(
        (acc, x) => acc.set(x.version, x.schema),
        new Map<string, Schema>(),
      ),
    );
  }

  public async validate(
    config: Config,
    version: SemanticVersion,
  ): Promise<void> {
    const schema = this.schemas.get(version.toString());
    if (!schema) {
      throw new Error(
        `No schema for <${version.toString()}> found in the set!`,
      );
    }

    const errors = await schema.validate(config);

    if (errors) {
      throw new AjvError(
        `Config validation failed for version <${version.toString()}>!`,
        errors,
      );
    }
  }

  public validateSufficiency(versions: SemanticVersion[]): void {
    const noSchema = versions.filter((v) => !this.schemas.get(v.toString()));
    if (noSchema.length > 0) {
      throw new MissingSchemasError(noSchema);
    }

    Logger.info('Schemas set validated successfully!');
  }
}
