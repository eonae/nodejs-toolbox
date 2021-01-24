import { ConfigurationReader } from './configuration-reader';

/**
 * Helps getting values from process.env. And provides basic validation.
 *
 * @export
 * @class ProcessEnv
 * @extends {ConfigurationReader}
 */
export class ProcessEnv extends ConfigurationReader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected get = (key: string): any => process.env[key];
}
