/* eslint-disable no-console */

import { promises as fs } from 'fs';
import { join, isAbsolute } from 'path';
import { SemanticVersion } from '@eonae/semantic-version';
import { MissingSchemasError, AjvError } from '../exceptions';
import { Config } from '../config.class';
import { Schema } from './schema.class';

const SCHEMAS_FILE_PATTERN = /^schema-(\S+).json$/;

export class SchemasSet {
  private constructor (
    private schemas: Map<string, Schema>
  ) { }

  public validate (config: Config, version: SemanticVersion): void {
    const schema = this.schemas.get(version.toString());
    if (!schema) {
      throw new Error(`No schema for <${version.toString()}> found in the set!`);
    }
    const errors = schema.validate(config);
    if (errors) {
      throw new AjvError(`Config validation failed for version <${version.toString()}>!`, errors);
    }
  }

  public validateSufficiency (versions: SemanticVersion[]): void {
    const noSchema = versions.filter(v => !this.schemas.get(v.toString()));
    if (noSchema.length > 0) throw new MissingSchemasError(noSchema);
    console.log('Schemas set validated successfully!');
  }

  public static async load (dir = 'schemas'): Promise<SchemasSet> {
    const fulldir = isAbsolute(dir) ? dir : join(process.cwd(), dir);
    const schemaFiles = (await fs.readdir(fulldir))
      .map(x => {
        const match = SCHEMAS_FILE_PATTERN.test(x);
        if (!match) throw new Error(`<${x}> doen't match schema file pattern!`);
        return x;
      });
    const schemas = await Promise.all(
      schemaFiles.map(async filename => ({
        version: SCHEMAS_FILE_PATTERN.exec(filename)[1],
        schema: await Schema.load(join(fulldir, filename))
      }))
    );

    return new SchemasSet(
      schemas.reduce((acc, x) => acc.set(x.version, x.schema), new Map<string, Schema>())
    );
  }
}
