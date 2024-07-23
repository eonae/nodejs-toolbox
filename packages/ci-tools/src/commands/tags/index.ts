import { SemanticVersion } from '@eonae/semantic-version';
import simplegit from 'simple-git';

export type PrimaryTagsOptions = {
  release?: boolean;
  last?: boolean;
  filter?: string;
  semantic?: string;
};

export interface CaporalLogger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export type TagsOptions = PrimaryTagsOptions;

const git = simplegit(process.cwd());

// export const validateOpts = (opts: TagsOptions): void => {
//   // validate
// }

type FilterFunc<T> = (x: T) => boolean;

const alwaysTrue: FilterFunc<string> = () => true;

export const tags = async (
  _: unknown,
  opts: TagsOptions,
  logger: CaporalLogger,
): Promise<void> => {
  // validateOpts(opts);

  const testRegexp =
    (regex: RegExp): FilterFunc<string> =>
    (x) =>
      regex.test(x);

  const filterByRegexp: FilterFunc<string> = opts.filter
    ? testRegexp(new RegExp(opts.filter))
    : alwaysTrue;

  const RELEASE_PATTERN = /^\d{1,5}\.\d{1,5}\.\d{1,5}$/;

  const releaseOnly: FilterFunc<string> = opts.release
    ? testRegexp(RELEASE_PATTERN)
    : alwaysTrue;

  const { all } = await git.tags();
  const filtered = all.filter((x) => filterByRegexp(x) && releaseOnly(x));

  if (!opts.last) {
    logger.info(filtered.join(' '));
    return;
  }

  const latest = filtered
    .map((x) => new SemanticVersion(x))
    .reduce(
      (acc: SemanticVersion | null, x) =>
        !acc || x.isGreaterThan(acc) ? x : acc,
      null,
    );

  if (!latest) {
    throw new Error(
      'No tags found with specified filter. So there are no --last.',
    );
  }

  logger.info(latest.toString());

  // if git tag is already set that means that commit has no sense.
  // Think about tags syncronization (pull before commit, or maybe error if remove is ahead?)
};
