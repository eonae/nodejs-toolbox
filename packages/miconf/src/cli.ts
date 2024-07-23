#!/usr/bin/env node

// There is no harm to pass async functions to action()
/* eslint-disable @typescript-eslint/no-misused-promises */

import { Manifest } from '@eonae/project-tools';
import cli from 'caporal';
import { join } from 'node:path';

import { migrate, validate } from './commands';

const main = async (): Promise<void> => {
  process.on('SIGINT', () => {});
  const manifest = await Manifest.load(join(__dirname, '..'));

  // FIXME: Fix typings or move from caporal to commander
  cli
    .version(manifest.content.version)
    .command('migrate', '')
    .argument('<configPath>', '')
    .argument('<from>', '')
    .argument('<to>', '')
    .option('--migrationsDir <migrationsDir>', '')
    .option('--schemasDir <schemasDir>', '')
    .option('--settings <settingsFile>', '')
    .option('--additional <additionalData>', '')
    .action(migrate as any)
    .command('validate', '')
    .argument('<configPath', '')
    .argument('<schemaPath>', '')
    .action(validate as any);

  cli.parse(process.argv);
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(console.error);
