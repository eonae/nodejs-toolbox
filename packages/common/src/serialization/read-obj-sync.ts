import { readFileSync } from 'fs';
import { isAbsolute } from 'path';
import { NotAbsolutePathError } from './errors';
import { Serializer } from './serializer.class';

/**
 * Reads file into an object.
 * Can be used in constructors where you can't perform async operations.
 * Supported formats: json, yaml, yml, .env
 *
 * @param {string} pathToFile Absolute path to file.
 * @returns {any}
 */
export const readObjSync = (pathToFile: string): unknown => {
  if (!isAbsolute(pathToFile)) throw new NotAbsolutePathError(pathToFile);

  const content = readFileSync(pathToFile).toString();
  const format = Serializer.getFormat(pathToFile);
  return Serializer.parse(content, format);
};
