import { ConfigurationException } from './configuration.exception';

export class InvalidPathException extends ConfigurationException {
  constructor (key: string, urlString: string) {
    super(key, `<${urlString} is not a valid path!>`);
  }
}
