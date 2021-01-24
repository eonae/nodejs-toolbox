/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { SemanticVersion } from '@eonae/semantic-version';
import { ConfigMigration } from '../src/shared';

export default class Migration1611314584499_1_2_5 extends ConfigMigration {
  from = (): SemanticVersion => new SemanticVersion('1.2.4');

  to = (): SemanticVersion => new SemanticVersion('1.2.5');

  up (prev: any): any {
    return {
      version: prev.version,
      hostname: prev.name
    };
  }

  down (prev: any): any {
    return {
      version: prev.version,
      name: prev.hostname
    };
  }
}
