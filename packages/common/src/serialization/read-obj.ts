import { promises as fs } from 'fs';
import { isAbsolute } from 'path';
import { Serializer } from './serializer.class';
import { NotAbsolutePathError } from './errors';

/**
 * Reads file into an object.
 * Supported formats: json, yaml, yml, .env
 *
 * @param {string} pathToFile Absolute path to file.
 * @returns {any}
 */
export const readObj = async (pathToFile: string): Promise<unknown> => {
  if (!isAbsolute(pathToFile)) throw new NotAbsolutePathError(pathToFile);

  const format = Serializer.getFormat(pathToFile);
  const content = await fs.readFile(pathToFile);
  return Serializer.parse(content.toString(), format);
};
