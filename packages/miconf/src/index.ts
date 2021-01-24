#!/usr/bin/env node

// There is no harm to pass async functions to action()
/* eslint-disable @typescript-eslint/no-misused-promises */

import { join } from 'path';
import cli from 'caporal';

import { Manifest } from '@eonae/project';
import { migrate, validate } from './commands';

const main = async () => {
  process.on('SIGINT', () => {});
  const manifest = await Manifest.load(join(__dirname, '..'));
  cli
    .version(manifest.content.version)
    .command('migrate', '')
    .argument('<configPath>', '')
    .argument('<from>', '')
    .argument('<to>', '')
    .option('--migrationsDir <migrationsDir>', '')
    .option('--schemasDir <schemasDir>', '')
    .option('--settings <settingsFilse>', '')
    .option('--additional <additionalData>', '')
    .action(migrate)
    .command('validate', '')
    .argument('<configPath', '')
    .argument('<schemaPath>', '')
    .action(validate);

  cli.parse(process.argv);
};

// eslint-disable-next-line no-console
main().catch(console.error);
