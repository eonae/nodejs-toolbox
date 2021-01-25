/**
 * Configuration file not found error
 *
 * @export
 * @class ConfigurationFileNotFoundException
 */
export class ConfigurationFileNotFoundException {
  public readonly message: string;

  constructor (path: string) {
    this.message = `File: ${path} not exists`;
  }
}
