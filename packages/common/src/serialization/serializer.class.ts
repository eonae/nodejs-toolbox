import { extname } from 'path';
import dotenv from 'dotenv';
import YAML from 'yaml';
import { UnknownFileExtensionError, UnknownFormatError } from './errors';

export type Parser = (text: string) => unknown;
export type Stringifier = (obj: unknown) => string;
export type Format = string;
export type Extension = string;

const INDENT = 2;

export class Serializer {
  private static parsers = new Map<Format, Parser>()
    .set('json', text => JSON.parse(text))
    .set('yaml', text => YAML.parse(text))
    .set('env', text => dotenv.parse(text));

  private static stringifiers = new Map<Format, Stringifier>()
    .set('json', obj => JSON.stringify(obj, null, INDENT))
    .set('yaml', obj => YAML.stringify(obj))
    .set('env', obj => Object.entries(obj)
      .map(
        ([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(obj) : value}`
      )
      .join('\n'));

  private static extensions = new Map<Extension, Format>()
    .set('.json', 'json')
    .set('.yaml', 'yaml')
    .set('.yml', 'yaml')
    .set('.env', 'env');

  public static getFormat (filename: string): Format {
    let ext = extname(filename);
    if (!ext && filename.includes('.env')) ext = '.env';
    const format = Serializer.extensions.get(ext);
    if (!format) throw new UnknownFileExtensionError(ext);
    return format;
  }

  public static stringify (obj: unknown, format: Format): string {
    const stringifier = Serializer.stringifiers.get(format);
    if (!stringifier) throw new UnknownFormatError(format);
    return stringifier(obj);
  }

  public static parse (text: string, format: Format): unknown {
    const parser = Serializer.parsers.get(format);
    if (!parser) throw new UnknownFormatError(format);
    return parser(text);
  }

  public static useParser (format: Format, parser: Parser): void {
    Serializer.parsers.set(format, parser);
  }

  public static useStringifier (format: Format, stringifier: Stringifier): void {
    Serializer.stringifiers.set(format, stringifier);
  }
}
