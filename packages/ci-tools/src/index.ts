#!/usr/bin/env node
/* eslint-disable prettier/prettier */

import { Manifest } from '@eonae/project-tools';
import cli from 'caporal';
import { join } from 'node:path';

import { tags } from './commands/tags';
import { bump } from './commands';

const main = async (): Promise<void> => {
  process.on('SIGINT', () => {});
  const manifest = await Manifest.load(join(__dirname, '..'));

  cli
    .version(manifest.content.version)
    .description('CI tools +++')
    .command(
      'bump',
      `Bumps package or monorepo version. Examples:
  
# Does nothing.
$ ci-tools bump

# Strips prerelease part if exists.
$ ci-tools bump --release

# Sets prerelease to beta.0
$ ci-tools bump --prefix beta

# Throws error
$ ci-tools bump --release --prefix xxx       # --release removed prerelease part and --prefix sets it - conflict.
$ ci-tools --original 1.34.0                 # --original is useless without --section)
$ ci-tools --section major --original 1.2.3  # Error if current version is greater than original. 

# Bumps patch component and drops increment to 0. 
$ ci-tools bump --section patch --dropIncrement

# Bumps minor component.
$ ci-tools bump --section minor

# Bumps minor component if current version equals original or is only patch ahead.
$ ci-tools bump --section minor --original 1.2.3`,
    )
    .option(
      '--section <section>',
      'major | minor | patch | increment | conventional',
    )
    .option(
      '--current <current>',
      'Current version. If provided will not need package.json to get current version.',
    )
    .option('--original <original>', 'Original version will cause skipping bump it it`s already bumped')
    .option('--prefix <prefix>', 'Will set specified prefix and increment = 0.')
    .option('--release', 'Will remove prefix and increment.')
    .option('--dropIncrement', 'Will drop increment section.')
    .option('--noTag', 'Skip creating git tags.')
    .option('--dryRun', 'Just print bumped version to output')
    .option('--noCommit', 'Skip committing. Will apply --noTag automatically.')
    .option('--tagPattern <tagPattern>', 'Specify pattern for annotated tags. Like: "release-{{version}}"')
    .action(bump)

    .command('tags', 'Gets git tags')
    .option('--filter <filter>', 'Pattern to filter tags.')
    .option('--release', 'Filter only versions with prefixes.')
    .option('--last', 'Gets only last tag (latest version).')
    .action(tags);

  // Не уверен, что гибкости достаточно для сложных случаев с обратными мержами, надо будет проверить.

  cli.parse(process.argv);
};


// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(console.error);
