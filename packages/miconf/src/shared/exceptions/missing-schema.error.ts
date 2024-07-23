import type { SemanticVersion } from '@eonae/semantic-version';

export class MissingSchemasError extends Error {
  constructor(versions: SemanticVersion[]) {
    super(
      `Schemas not found for declared versions:\n${versions.map((x) => x.toString()).join('\n')}`,
    );
  }
}
