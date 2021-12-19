/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Makes message and stack enumerable and visible to JSON.stringify
export const normalizeObject = (obj: unknown): unknown => {
  if (!(obj instanceof Error)) {
    return obj;
  }

  return [...Object.keys(obj), 'message', 'stack']
    .reduce((acc, key) => {
      acc[key] = obj[key];

      return acc;
    }, {});
};
