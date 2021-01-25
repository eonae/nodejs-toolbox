/**
 * Need to use any due to low-level dynamic operations.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { EnumLike } from '../configuration';
import { enumKeys } from './functions';

const isNumeric = (value: any) => {
  const NUMERIC_PATTERN = /^\s*[\d|.]*\d\s*$|^\s*[\d|,]*\d\s*$/;
  return NUMERIC_PATTERN.test(value.toString());
};

/**
 * Static class which provides some conversion methods.
 *
 * @export
 * @class Convert
 */
export class Convert {
  /**
   * Converts any value to int or throws error.
   *
   * @static
   * @param {*} value Any input value.
   * @param {number} [defaultValue] Value to use if input value is undefined.
   * @returns {number}
   * @throws {Error} Throws if conversion is impossible.
   * @memberof Convert
   */
  public static int (value: any, defaultValue?: number): number {
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error('Value is empty while no default value provided.');
    }
    const parsed = +value;

    if (!isNumeric(value) || !Number.isInteger(parsed)) {
      throw new Error(`Value <${value}> can't be converted to integer.`);
    }
    return parsed;
  }

  /**
   * Converts any value to number or throws error.
   *
   * @static
   * @param {*} value Any input value.
   * @param {number} [defaultValue] Value to use if input value is undefined.
   * @returns {number}
   * @throws {Error} Throws if conversion is impossible.
   * @memberof Convert
   */
  public static float (value: any, defaultValue?: number): number {
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error('Value is empty while no default value provided.');
    }
    const parsed = +value;
    if (!isNumeric(value) || Number.isNaN(parsed)) {
      throw new Error(`Value <${value}> can't be converted to float.`);
    }
    return parsed;
  }

  /**
   * Converts any value to boolean or throws error.
   * Only boolean values or strings 'true' and 'false' (case insensitive) can be converted.
   *
   * @static
   * @param {*} value Any input value.
   * @param {number} [defaultValue] Value to use if input value is undefined.
   * @returns {number}
   * @throws {Error} Throws if conversion is impossible.
   * @memberof Convert
   */
  public static boolean (value: any, defaultValue?: boolean): boolean {
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error('Value is empty while no default value provided.');
    }
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string' || !['true', 'false'].includes(value.toLowerCase())) {
      throw new Error(`Value <${value}> can't be converted to boolean.`);
    }
    return value.toLowerCase() === 'true';
  }

  public static enum<E> (value: number | string, enumeration: EnumLike, defaultValue?: E): E {
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error('Value is empty while no default value provided.');
    }
    const keys = enumKeys(enumeration);
    const enumError = () => new Error(`<${value}> is not member of enum: <${keys.join(', ')}>`);
    if (!['string', 'number'].includes(typeof value)) throw enumError();
    const result = enumeration[value];
    if (result === null || result === undefined) throw enumError();

    return result as E;
  }
}
