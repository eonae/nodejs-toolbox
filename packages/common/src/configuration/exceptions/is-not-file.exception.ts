import { ConfigurationException } from './configuration.exception';

export class IsNotFileException extends ConfigurationException {
  constructor (key: string, actualPath: string) {
    super(key, `<${actualPath}> is not a file!`);
  }
}
