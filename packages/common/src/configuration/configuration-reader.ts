/**
 * Need to use any here.
 */

import { lstatSync, accessSync, existsSync } from 'fs';
import { isAbsolute, join } from 'path';
import { URL } from 'url';
import { Convert } from '../convert';
import {
  PathNotFoundException,
  NoAccessException,
  IsNotDirectoryException,
  IsNotFileException,
  ConfigurationException,
  InvalidUrlException
} from './exceptions';
import { EnumLike, Lstat } from './types';

const DEFAULT_SEPARATOR = ',';

/**
 * Provides basic existence and type validation for any configuration source.
 * Source depends on implementation of get(key: string) method
 *
 * @export
 * @abstract
 * @class ConfigurationReader
 */
export abstract class ConfigurationReader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract get: (key: string) => any;

  public getNumber (key: string): number;
  public getNumber (key: string, defaultValue: number): number;
  public getNumber (key: string, defaultValue?: number): number {
    return this.wrapErrors(key, () => Convert.float(this.get(key), defaultValue));
  }

  public getInteger (key: string): number;
  public getInteger (key: string, defaultValue: number): number;
  public getInteger (key: string, defaultValue?: number): number {
    return this.wrapErrors(key, () => Convert.int(this.get(key), defaultValue));
  }

  public getBoolean (key: string): boolean;
  public getBoolean (key: string, defaultValue: boolean): boolean;
  public getBoolean (key: string, defaultValue?: boolean): boolean {
    return this.wrapErrors(key, () => Convert.boolean(this.get(key), defaultValue));
  }

  public getString (key: string): string;
  public getString (key: string, defaultValue: string): string;
  public getString (key: string, defaultValue?: string): string {
    return this.wrapErrors(key, () => this.getRawString(key, defaultValue) || defaultValue);
  }

  public getEnumValue<E> (key: string, enumeration: EnumLike): E;
  public getEnumValue<E> (key: string, enumeration: EnumLike, defaultValue: E): E;
  public getEnumValue<E> (key: string, enumeration: EnumLike, defaultValue?: E): E {
    return this.wrapErrors(key, () => Convert.enum<E>(this.get(key), enumeration, defaultValue));
  }

  public getUrl (key: string): URL;
  public getUrl (key: string, defaultValue: URL): URL;
  public getUrl (key: string, defaultValue?: URL): URL {
    try {
      const raw = this.getRawString(key, defaultValue);
      if (!raw) return defaultValue;
      return new URL(raw);
    } catch (error) {
      throw new InvalidUrlException(key, error.message);
    }
  }

  public getDir (key: string): string;
  public getDir (key: string, defaultValue: string): string;
  public getDir (key: string, defaultValue?: string): string {
    const path = this.getRawString(key, defaultValue) || defaultValue;
    return this.getFileOrDirectory(key, path, Lstat.directory);
  }

  public getFile (key: string): string;
  public getFile (key: string, defaultValue: string): string;
  public getFile (key: string, defaultValue?: string): string {
    const path = this.getRawString(key, defaultValue) || defaultValue;
    return this.getFileOrDirectory(key, path, Lstat.file);
  }

  public getNumbers (key: string): number[];
  public getNumbers (key: string, defaultValue: number[]): number[];
  public getNumbers (key: string, defaultValue?: number[], separator?: string): number[] {
    const s = separator || DEFAULT_SEPARATOR;
    return this.wrapErrors(key, () => this.getNumbersArray(key, defaultValue, s, false));
  }

  public getIntegers (key: string): number[];
  public getIntegers (key: string, defaultValue: number[]): number[];
  public getIntegers (key: string, defaultValue?: number[], separator?: string): number[] {
    return this.wrapErrors(key, () => this.getNumbersArray(
      key,
      defaultValue,
      separator || DEFAULT_SEPARATOR,
      true
    ));
  }

  public getStrings (key: string): string[];
  public getStrings (key: string, defaultValue?: string[]): string[];
  public getStrings (key: string, defaultValue?: string[], separator?: string): string[] {
    return this.wrapErrors(key, () => {
      const raw = this.getRawString(key, defaultValue);
      if (!raw) return defaultValue;
      return raw.split(separator || DEFAULT_SEPARATOR).map(x => x.trim());
    });
  }

  private getNumbersArray (
    key: string,
    defaultValue: number[],
    separator: string,
    checkInt: boolean
  ): number[] {
    const raw = this.getRawString(key, defaultValue);
    if (!raw) return defaultValue;
    return raw
      .split(separator)
      .map(x => (checkInt ? Convert.int(x) : Convert.float(x)));
  }

  private getRawString (
    key: string,
    defaultValue?: unknown
  ): string | null {
    const value = this.get(key);
    if (value === undefined && defaultValue !== undefined) {
      return null;
    }
    if (typeof value !== 'string') {
      throw { message: `<${value}> is not string.`, value };
    }
    return value;
  }

  private wrapErrors<T> (key: string, func: () => T): T {
    try {
      const result = func();
      return result;
    } catch (error) {
      throw new ConfigurationException(key, error.message);
    }
  }

  private getFileOrDirectory (key: string, path: string, type: Lstat) {
    const wasRelative = !isAbsolute(path);
    const absolutePath = wasRelative ? join(process.cwd(), path) : path;
    if (!existsSync(absolutePath)) {
      throw new PathNotFoundException(key, absolutePath, wasRelative);
    }
    try {
      accessSync(absolutePath);
    } catch (error) {
      throw new NoAccessException(key, absolutePath);
    }
    const stat = lstatSync(absolutePath);
    /**
     * Otherwise we'll have problems with IsNotDirectoryException
     * when using symlinks.
     */
    if (stat.isSymbolicLink()) return absolutePath;
    if (type === Lstat.directory && !stat.isDirectory()) {
      throw new IsNotDirectoryException(key, absolutePath);
    }
    if (type === Lstat.file && !stat.isFile()) {
      throw new IsNotFileException(key, absolutePath);
    }
    return absolutePath;
  }
}
