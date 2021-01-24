import { parseVersionPart } from './parse-version-part.function';

export class SemanticPart {
  public major: number;

  public minor: number;

  public patch: number;

  constructor (
    major: number | string,
    minor: number | string,
    patch: number | string
  ) {
    this.major = parseVersionPart(major);
    this.minor = parseVersionPart(minor);
    this.patch = parseVersionPart(patch);
  }

  public toString = (): string => [this.major, this.minor, this.patch].join('.');
}
