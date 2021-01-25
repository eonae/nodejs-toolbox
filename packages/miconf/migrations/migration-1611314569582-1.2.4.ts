/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { SemanticVersion } from '@eonae/semantic-version';
import { ConfigMigration } from '../src/shared';

const DEFAULT_NAME = 'DEFAULT_NAME';

// А если без дефолта? Тогда нужна ф-ция хелпер типа: alert()

export default class Migration1611314569582_1_2_4 implements ConfigMigration {
  from = new SemanticVersion('1.2.3');

  to = new SemanticVersion('1.2.4');

  up (prev: any): any {
    return {
      version: prev.version,
      name: DEFAULT_NAME
    };
  }

  down (next: any): any {
    return {
      version: next.version
    };
  }
}
