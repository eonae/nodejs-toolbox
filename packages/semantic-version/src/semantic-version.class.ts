import { PrereleasePart } from './prerelease-part.class';
import { SemanticPart } from './semantic-part.class';
import { Diff, VersionData } from './types';

const SEMANTIC_VERSION_PATTERN = /^\d{1,5}\.\d{1,5}\.\d{1,5}(-[a-z]{1,15}\.\d{1,5})?$/;

export class SemanticVersion {
  semantic: SemanticPart;

  prerelease: PrereleasePart;

  constructor (version: VersionData);
  constructor (version: string);
  constructor (version: SemanticVersion, changes: Partial<VersionData>)
  constructor (version: SemanticVersion | VersionData | string, changes?: Partial<VersionData>) {
    if (typeof version === 'string') {
      // String provided
      if (!SEMANTIC_VERSION_PATTERN.test(version)) {
        throw new Error(`Ooops.. <${version}> doesn't seem to be a valid semantic version`);
      }
      const [major, minor, patch, prefix, increment] = version.split(/\.|-/);
      this.semantic = new SemanticPart(major, minor, patch);
      this.prerelease = new PrereleasePart(prefix, increment);
    } else if (version instanceof SemanticVersion) {
      // Version instance provided
      const { semantic, prerelease } = version;
      const joined = { ...semantic, ...prerelease, ...changes };
      const { major, minor, patch, prefix, increment } = joined;
      this.semantic = new SemanticPart(major, minor, patch);
      this.prerelease = new PrereleasePart(prefix, increment);
    } else {
      // Version data provided
      const { major, minor, patch, prefix, increment } = version;
      this.semantic = new SemanticPart(major, minor, patch);
      this.prerelease = new PrereleasePart(prefix, increment);
    }
  }

  toString = (): string =>
    [this.semantic.toString(), this.prerelease.toString()].filter(x => x).join('-');

  bump (section: Diff): SemanticVersion {
    switch (section) {
      case 'major':
        return new SemanticVersion(this, { major: this.semantic.major + 1, minor: 0, patch: 0 });
      case 'minor':
        return new SemanticVersion(this, { minor: this.semantic.minor + 1, patch: 0 });
      case 'patch':
        return new SemanticVersion(this, { patch: this.semantic.patch + 1 });
      case 'increment':
        if (!this.prerelease.prefix) {
          throw new Error('Can\'t bump increment because there is no prefix.');
        }
        return new SemanticVersion(this, { increment: this.prerelease.increment + 1 });
      default:
        throw new Error(`<${section}> is not a valid section to bump.`);
    }
  }

  release = (): SemanticVersion => new SemanticVersion(this, { prefix: null, increment: null });

  prefix = (prefix: string): SemanticVersion => new SemanticVersion(this, { prefix, increment: 0 });

  dropIncrement = (): SemanticVersion => new SemanticVersion(
    this, { increment: this.prerelease.prefix ? 0 : null }
  );

  clone = (): SemanticVersion => new SemanticVersion(this, {});

  equals = (to: SemanticVersion): boolean => this.toString() === to.toString();

  isGreaterThan (version: SemanticVersion): boolean {
    if (this.semantic.major > version.semantic.major) return true;
    if (this.semantic.major < version.semantic.major) return false;
    if (this.semantic.minor > version.semantic.minor) return true;
    if (this.semantic.minor < version.semantic.minor) return false;
    if (this.semantic.patch > version.semantic.patch) return true;
    if (this.semantic.patch < version.semantic.patch) return false;
    if (!this.prerelease.prefix && version.prerelease.prefix) return true;
    if (this.prerelease.prefix && !version.prerelease.prefix) return true;
    if (this.prerelease.increment > version.prerelease.increment) return true;
    return false;
  }
}
