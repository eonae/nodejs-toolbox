import { ConfigurationException } from './configuration.exception';

export class PathNotFoundException extends ConfigurationException {
  constructor (key: string, actualPath: string, wasRelative?: boolean) {
    // eslint-disable-next-line max-len
    const relativePathWarning = ' Since you have used relative path, check you current working directory is repos root.';
    const message = `File or directory <${actualPath}> not found!${
      wasRelative ? relativePathWarning : ''}`;
    super(key, message);
  }
}
