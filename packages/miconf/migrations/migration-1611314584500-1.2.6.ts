/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { SemanticVersion } from '@eonae/semantic-version';

import type { ConfigMigration } from '../src/shared';

export default class Migration1611314584499_1_2_6 implements ConfigMigration {
  from = new SemanticVersion('1.2.5');

  to = new SemanticVersion('1.2.6');

  up = (prev: any): any => prev;

  down = (prev: any): any => prev;
}
