import { Section } from '@eonae/semantic-version';

export type SectionOptions = {
  section?: Section;
};

export type PrimaryOptions = {
  current?: string;
  original?: string;
  prefix?: string;
  release?: boolean;
  dropIncrement?: boolean;
};

export type SecondaryOptions = {
  noTag?: boolean;
  noManifestsUpdate?: boolean;
  noCommit?: string;
  tagPattern?: string;
};

export interface CaporalLogger {
  debug (message: string): void;
  info (message: string): void;
  warn (message: string): void;
  error(message: string): void;
}

export type BumpOptions = SectionOptions & PrimaryOptions & SecondaryOptions;
