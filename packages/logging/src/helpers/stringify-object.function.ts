import { inspect } from 'util';

export const stringifyObject = (o: unknown, color?: boolean): string =>
  inspect(o, false, null, color || false);
