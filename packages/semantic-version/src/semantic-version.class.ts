import { PrereleasePart } from './prerelease-part.class';
import { SemanticPart } from './semantic-part.class';
import type { Diff, VersionData } from './types';

const SEMANTIC_VERSION_PATTERN =
  /^\d{1,5}\.\d{1,5}\.\d{1,5}(-[a-z]{1,15}\.\d{1,5})?$/;

export class SemanticVersion {
  semantic: SemanticPart;
  prerelease: PrereleasePart | null;

  constructor(version: string);
  constructor(version: SemanticVersion, changes: Partial<VersionData>);
  constructor(
    version: SemanticVersion | string,
    changes?: Partial<VersionData>,
  ) {
    if (typeof version === 'string') {
      // String provided
      if (!SEMANTIC_VERSION_PATTERN.test(version)) {
        throw new Error(
          `Ooops.. <${version}> doesn't seem to be a valid semantic version`,
        );
      }
      const [major, minor, patch, prefix, increment] = version.split(/\.|-/);

      this.semantic = new SemanticPart(major, minor, patch);
      this.prerelease =
        prefix && increment !== undefined
          ? new PrereleasePart(prefix, increment)
          : null;
    } else {
      const joined = {
        prerelease: version.prerelease,
        ...version.semantic,
        ...changes,
      };

      const { major, minor, patch, prerelease } = joined;

      this.prerelease = prerelease;
      this.semantic = new SemanticPart(major, minor, patch);
    }
  }

  toString(): string {
    const parts = [this.semantic.toString()];
    if (this.prerelease) {
      parts.push(this.prerelease.toString());
    }

    return parts.join('-');
  }

  bump(section: Diff): SemanticVersion {
    switch (section) {
      case 'major':
        return new SemanticVersion(this, {
          major: this.semantic.major + 1,
          minor: 0,
          patch: 0,
        });
      case 'minor':
        return new SemanticVersion(this, {
          minor: this.semantic.minor + 1,
          patch: 0,
        });
      case 'patch':
        return new SemanticVersion(this, { patch: this.semantic.patch + 1 });
      case 'increment':
        if (!this.prerelease) {
          throw new Error("Can't bump increment because there is no prefix.");
        }

        const { prefix, increment } = this.prerelease;
        const prerelease = new PrereleasePart(prefix, increment + 1);

        return new SemanticVersion(this, { prerelease });
      default:
        throw new Error(`<${section}> is not a valid section to bump.`);
    }
  }

  release(): SemanticVersion {
    return new SemanticVersion(this, { prerelease: null });
  }

  prefix(prefix: string): SemanticVersion {
    return new SemanticVersion(this, {
      prerelease: new PrereleasePart(prefix, 0),
    });
  }

  dropIncrement(): SemanticVersion {
    if (!this.prerelease) {
      return this;
    }
    return new SemanticVersion(this, {
      prerelease: new PrereleasePart(this.prerelease.prefix, 0),
    });
  }

  clone(): SemanticVersion {
    return new SemanticVersion(this, {});
  }

  equals(to: SemanticVersion): boolean {
    return this.toString() === to.toString();
  }

  isGreaterThan(version: SemanticVersion): boolean {
    if (this.semantic.major > version.semantic.major) return true;
    if (this.semantic.major < version.semantic.major) return false;
    if (this.semantic.minor > version.semantic.minor) return true;
    if (this.semantic.minor < version.semantic.minor) return false;
    if (this.semantic.patch > version.semantic.patch) return true;
    if (this.semantic.patch < version.semantic.patch) return false;
    if (!this.prerelease && version.prerelease) return true;
    if (this.prerelease && !version.prerelease) return true;
    if (!this.prerelease || !version.prerelease) return false;
    if (this.prerelease.increment > version.prerelease.increment) return true;
    return false;
  }
}
