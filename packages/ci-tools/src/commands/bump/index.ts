import { Manifest } from '@eonae/project-tools';
import type { Diff, Section } from '@eonae/semantic-version';
import { SemanticVersion } from '@eonae/semantic-version';
import crb from 'conventional-recommended-bump';
import { promisify } from 'node:util';
import simplegit from 'simple-git';

import { diff, isGreaterThan } from './diff.functions';
import type { BumpOptions, CaporalLogger, PrimaryOptions } from './types';

const recommend = promisify(crb);

const git = simplegit(process.cwd());

export const shouldBumpSemantic = (
  curr: SemanticVersion,
  original: SemanticVersion | null,
  recommended: Diff,
): boolean => {
  if (!original) return true;
  return isGreaterThan(recommended, diff(curr, original));
};

export const validateOpts = (opts: BumpOptions): void => {
  if (opts.release && opts.prefix) {
    throw new Error('Incompatible options: --release with --prefix');
  }
  if (opts.original && !opts.section) {
    throw new Error('Incompatible options: --origin without --section');
  }
  if (opts.section === 'increment' && opts.dropIncrement) {
    throw new Error(
      'Incompatible options: --section increment and --dropIncrement',
    );
  }
  if (opts.tagPattern && !/^\S*{{version}}\S*$/.test(opts.tagPattern)) {
    throw new Error('Tag pattern should match "^\\S*{{version}}\\S*"');
  }
};

export const getCurrentVersion = async ({
  current,
}: BumpOptions): Promise<SemanticVersion> => {
  if (current) {
    return new SemanticVersion(current);
  }

  const { content } = await Manifest.load(process.cwd());

  return new SemanticVersion(content.version);
};

export const updateManifests = async (
  version: SemanticVersion,
): Promise<void> => {
  const manifest = await Manifest.load(process.cwd());

  manifest.content.version = version.toString();
  await manifest.save();
};

export const getConventionalBump = async (): Promise<Diff> => {
  const recommended = await recommend({ preset: 'angular' });
  const { releaseType } = recommended as { releaseType: Diff };

  return releaseType;
};

export const getBumped = (
  curr: SemanticVersion,
  proposed: Diff,
  opts: PrimaryOptions,
): SemanticVersion => {
  const original = opts.original ? new SemanticVersion(opts.original) : null;
  const bumped =
    proposed !== 'none' && shouldBumpSemantic(curr, original, proposed)
      ? curr.bump(proposed)
      : curr;

  if (opts.release) return bumped.release();
  if (opts.prefix) return bumped.prefix(opts.prefix);
  if (opts.dropIncrement) return bumped.dropIncrement();

  return bumped;
};

export const getSectionToBump = (
  section: Section | undefined,
): Promise<Diff> => {
  if (section === 'conventional') return getConventionalBump();
  return Promise.resolve(section ?? 'none');
};

export const bump = async (
  _: unknown,
  opts: BumpOptions,
  logger: CaporalLogger,
): Promise<void> => {
  validateOpts(opts);

  const curr = await getCurrentVersion(opts);

  logger.info(`Current version: ${curr.toString()}`);

  const section = await getSectionToBump(opts.section);

  logger.info(`Bump section: ${section}`);

  const bumped = getBumped(curr, section, opts);

  const hasChanged =
    bumped.isGreaterThan(curr) ||
    bumped.prerelease?.prefix !== curr.prerelease?.prefix;

  // FIXME: Make prefix a part of comparison?
  if (!hasChanged) {
    logger.info("Version didn't change.");
    return;
  }

  if (!('noManifestsUpdate' in opts) || !opts.noManifestsUpdate) {
    logger.info('Updating manifests... (only root for now)');
    await updateManifests(bumped);
    logger.info(`Updated: ${curr.toString()} -> ${bumped.toString()}`);
  }

  if (!opts.noCommit) {
    logger.debug('Committing...');
    await git.add('.');
    await git.commit(`chore(bump): ${bumped.toString()}`);
    if (!opts.noTag) {
      const tag = opts.tagPattern
        ? opts.tagPattern.replace('{{version}}', bumped.toString())
        : bumped.toString();

      logger.debug(`Creating tag: ${tag}`);
      try {
        await git.addAnnotatedTag(tag, `version ${bumped.toString()}`);
      } catch (error: any) {
        logger.error(error.message);
        logger.info(
          'As chore commit has succeeded and tagging failed you' +
            'probably need to reset last commit manually',
        );
      }
    }
  }
  // if git tag is already set that means that commit has no sense.
  // Think about tags synchronization (pull before commit, or maybe error if remove is ahead?)
};
