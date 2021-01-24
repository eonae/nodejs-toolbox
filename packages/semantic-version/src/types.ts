import { PrereleasePart } from './prerelease-part.class';
import { SemanticPart } from './semantic-part.class';

export type Diff = 'major' | 'minor' | 'patch' | 'increment' | 'none';
export type Section = 'major' | 'minor' | 'patch' | 'increment' | 'conventional';

export type VersionData = Omit<SemanticPart & PrereleasePart, 'toString'>;
