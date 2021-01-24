import { promises as fs } from 'fs';
import { isAbsolute } from 'path';
import { Serializer } from './serializer.class';
import { NotAbsolutePathError } from './errors';

/**
 * Saves object into file.
 * Supported formats: json, yaml, yml, .env
 *
 * @param {*} obj
 * @param {string} filename Absolute path to file.
 * @param {string} [format] If not specified serializer will try
 * to recognize it by file extension.
 */
export const saveObj = async (obj: unknown, filename: string, format?: string): Promise<void> => {
  if (!isAbsolute(filename)) {
    throw new NotAbsolutePathError(filename);
  }
  const text = Serializer.stringify(obj, format || Serializer.getFormat(filename));
  await fs.writeFile(filename, `${text}\n`);
};
