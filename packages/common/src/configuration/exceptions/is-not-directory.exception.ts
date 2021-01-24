import { ConfigurationException } from './configuration.exception';

export class IsNotDirectoryException extends ConfigurationException {
  constructor (key: string, actualPath: string) {
    super(key, `<${actualPath}> is not a directory!`);
  }
}
