import { ConfigurationException } from './configuration.exception';

export class InvalidUrlException extends ConfigurationException {
  constructor (key: string, urlString: string) {
    super(key, `<${urlString} is not valid url!>`);
  }
}
