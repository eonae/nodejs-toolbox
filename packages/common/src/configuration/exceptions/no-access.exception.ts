import { ConfigurationException } from './configuration.exception';

export class NoAccessException extends ConfigurationException {
  constructor (key: string, actualPath: string) {
    super(key, `Can't access <${actualPath}>!`);
  }
}
