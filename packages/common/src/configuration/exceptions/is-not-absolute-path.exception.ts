import { ConfigurationException } from './configuration.exception';

export class IsNotAbsolutePathException extends ConfigurationException {
  constructor (key: string, actualPath: string) {
    super(key, `<${actualPath}> is not valid absolute path!`);
  }
}
