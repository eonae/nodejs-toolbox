/**
 * Configuration error
 *
 * @export
 * @class ConfigurationError
 */
export class ConfigurationException {
  public readonly message: string;

  constructor (parameter: string, msg: string) {
    this.message = `Parameter: ${parameter}. ${msg}`;
  }
}
