import { ConfigurationReader } from '../src/configuration/configuration-reader';
import { ConfigurationException, InvalidUrlException } from '../src/configuration/exceptions';
import { URL } from 'url';
import { join } from 'path';

class Configuration extends ConfigurationReader {
  constructor (
    private values: any
  ) { super() }

  protected get = (key: string): any => this.values[key];
}

enum TestEnum {
  'one',
  'two'
}

const VALID_FILE_PATH_ABS = join(__dirname, '../package.json');
const VALID_DIR_PATH_ABS = join(__dirname, '../src');
const VALID_URL_HTTPS = 'https://google.com';
const VALID_URL_HTTPS_WWW = 'https://www.google.com';
const VALID_URL_REDIS = 'redis://localhost:9000';
const VALID_URL_REDIS_ACL = 'redis://:qwerty@localhost:9000';
const VALID_URL_POSTGRES = 'postgres://login:qwerty@10.10.10.0:1234';
const INVALID_URL = 'postgres//login:qwerty@10.10.10.0:1234';
const INVALID_URL_PROTOCOL = 'a://login:qwerty@10.10.10.0:1234';

class TestValues {
  // special values
  ZERO = 0;
  ONE = 1;
  ZERO_STR = '0';
  ONE_STR = '1';
  EMPTY_ARRAY = [];
  EMPTY_OBJECT = {};
  UNKNOWN_KEY = undefined;

  // primitives
  INT = 12;
  FLOAT = 123.2;
  BOOLEAN = true;
  
  // stringified primitives
  VALID_INT_STR = '12';
  VALID_UNTRIMMED_INT_STR = ' 12  ';
  VALID_FLOAT_STR = '123.2';
  VALID_UNTRIMMED_FLOAT_STR = ' 123.2  ';
  VALID_BOOLEAN_STR = 'falSe';
  VALID_UNTRIMMED_BOOLEAN_STR = '  true ';
  ARBITRARY_STR = 'test string';
  
  INVALID_NUMBER_STR = '123d';

  // arrays
  VALID_NUMBER_ARRAY_STR = '  12, 123.2, 3423   ';
  VALID_INTS_ARRAY = ' 12, 4, 3';
  ARBITRARY_STR_ARRAY = 'first, second time, third';

  INVALID_NUMBER_ARRAY_STR = '12ds, 123, 12';
  INVALID_INTS_ARRAY = ' d s, 4, 3';

  // enums
  VALID_ENUM_VALUE = 'one';
  VALID_ENUM_VALUE_INDEX = 0;

  // files
  CORRECT_FILE_PATH_ABS = VALID_FILE_PATH_ABS;
  CORRECT_FILE_PATH_RELATIVE = './packages/common/package.json'; // relatively to repository root
  INCORRECT_FILE_PATH = '.*.@/package.json';
  NOT_EXISTING_FILE = join(__dirname, '../package.yaml');

  // dirs
  CORRECT_DIR_PATH_ABS = VALID_DIR_PATH_ABS;
  CORRECT_DIR_PATH_RELATIVE = './packages/common/src'; // relatively to repository root
  INCORRECT_DIR_PATH = '.*.@/src';
  NOT_EXISTING_DIR = join(__dirname, '../tsc');

  // urls
  VALID_URL_HTTPS = VALID_URL_HTTPS;
  VALID_URL_HTTPS_WWW = VALID_URL_HTTPS_WWW;
  VALID_URL_REDIS = VALID_URL_REDIS;
  VALID_URL_REDIS_ACL = VALID_URL_REDIS_ACL;
  VALID_URL_POSTGRES = VALID_URL_POSTGRES;
  INVALID_URL = INVALID_URL;
  INVALID_URL_PROTOCOL = INVALID_URL_PROTOCOL;
}

type Keys = Partial<{
  [K in keyof TestValues]: keyof TestValues
}>;

const values = new TestValues();
const keys = Object.keys(values).reduce((acc: Keys, key) => {
  acc[key] = key;
  return acc;
}, {});


let config: Configuration;

// Shortcuts

beforeAll(() => {
  config = new Configuration(values);
})

describe('GetNumber', () => {
  const num = (key: string, d?: number) => config.getNumber(key, d);

  test('Positive', () => {
    expect(num(keys.INT)).toBe(12);
    expect(num(keys.VALID_INT_STR)).toBe(12);
    expect(num(keys.VALID_UNTRIMMED_INT_STR)).toBe(12);
    expect(num(keys.FLOAT)).toBe(123.2);
    expect(num(keys.VALID_FLOAT_STR)).toBe(123.2);
    expect(num(keys.VALID_UNTRIMMED_FLOAT_STR)).toBe(123.2);
  });

  test('Negative', () => {
    expect(() => num(keys.INVALID_NUMBER_STR)).toThrow(ConfigurationException);
    expect(() => num(keys.BOOLEAN)).toThrow(ConfigurationException);
    expect(() => num(keys.UNKNOWN_KEY)).toThrow(ConfigurationException);
  });
});

describe('GetNumbers (array)', () => {
  const nums = (key: keyof TestValues, d?: number[]) => config.getNumbers(key, d);

  test('Positive', () => {
    expect(nums(keys.VALID_NUMBER_ARRAY_STR)).toEqual([12, 123.2, 3423]);
    expect(nums(keys.VALID_INTS_ARRAY)).toEqual([12, 4, 3]);
  });

  test('Negative', () => {
    expect(() => nums(keys.INVALID_NUMBER_ARRAY_STR)).toThrow(ConfigurationException);
    expect(() => nums(keys.INT)).toThrow(ConfigurationException);
    expect(() => nums(keys.UNKNOWN_KEY)).toThrow(ConfigurationException);
  });
});

describe('GetInteger', () => {
  const int = (key: keyof TestValues, d?: number) => config.getInteger(key, d);

  test('Should correctly parse valid integer', () => {
    expect(int(keys.INT)).toBe(12);
    expect(int(keys.VALID_INT_STR)).toBe(12);
    expect(int(keys.VALID_UNTRIMMED_INT_STR)).toBe(12);
  });

  test('Should fail on numbers with floating points', () => {
    expect(() => int(keys.FLOAT)).toThrow(ConfigurationException);
    expect(() => int(keys.VALID_FLOAT_STR)).toThrow(ConfigurationException);
  });
});

describe('GetIntegers (array)', () => {
  const ints = (key: keyof TestValues, d?: number[]) => config.getIntegers(key, d);
  test('Positive', () => {
    expect(ints(keys.VALID_INTS_ARRAY)).toEqual([12, 4, 3]);
  });

  test('Negative', () => {
    expect(() => ints(keys.INVALID_NUMBER_ARRAY_STR)).toThrow(ConfigurationException);
    expect(() => ints(keys.VALID_NUMBER_ARRAY_STR)).toThrow(ConfigurationException);
    expect(() => ints(keys.INT)).toThrow(ConfigurationException);
    expect(() => ints(keys.UNKNOWN_KEY)).toThrow(ConfigurationException);
  });
})

describe('GetBoolean', () => {
  const bool = (key: keyof TestValues, d?: boolean) => config.getBoolean(key, d);

  test('Should correctly parse valid booleans', () => {
    expect(bool(keys.BOOLEAN)).toBe(true);
    expect(bool(keys.VALID_BOOLEAN_STR)).toBe(false);
  });

  test('Should fail on zeros and ones', () => {
    expect(() => bool(keys.ONE)).toThrow(ConfigurationException);
    expect(() => bool(keys.ONE_STR)).toThrow(ConfigurationException);
    expect(() => bool(keys.ZERO)).toThrow(ConfigurationException);
    expect(() => bool(keys.ZERO_STR)).toThrow(ConfigurationException);
  });
});

describe('GetString', () => {
  const str = (key: keyof TestValues, d?: string) => config.getString(key, d);

  test('Should correcly parse arbitrary string', () => {
    expect(str('ARBITRARY_STR')).toBe('test string');
  });
  
  test('Should fail on other types', () => {
    expect(() => str(keys.INT)).toThrowError(ConfigurationException);
    expect(() => str(keys.FLOAT)).toThrowError(ConfigurationException);
    expect(() => str(keys.BOOLEAN)).toThrowError(ConfigurationException);
    expect(() => str(keys.EMPTY_ARRAY)).toThrowError(ConfigurationException);
    expect(() => str(keys.EMPTY_OBJECT)).toThrowError(ConfigurationException);
  });
});

describe('GetStrings (array)', () => {
  const strs = (key: keyof TestValues, d?: string[]) => config.getStrings(key, d);

  test('Should correctly parse comma separated arrays', () => {
    expect(strs('ARBITRARY_STR_ARRAY')).toEqual(['first', 'second time', 'third'])
  });

  test('Should fail on other types', () => {
    expect(() => strs(keys.INT)).toThrowError(ConfigurationException);
    expect(() => strs(keys.FLOAT)).toThrowError(ConfigurationException);
    expect(() => strs(keys.BOOLEAN)).toThrowError(ConfigurationException);
    expect(() => strs(keys.EMPTY_ARRAY)).toThrowError(ConfigurationException);
    expect(() => strs(keys.EMPTY_OBJECT)).toThrowError(ConfigurationException);
  });
});

describe('GetEnumValue', () => {
  test('Positive', () => {
    const enval = (key: keyof TestValues, d?: TestEnum) => config.getEnumValue(key, TestEnum, d);
    expect(enval(keys.VALID_ENUM_VALUE)).toBe(TestEnum.one);
  });
});

describe('GetFile', () => {
  const file = (key: keyof TestValues, d?: string) => config.getFile(key, d);

  test('Should correctly parse path to existing file', () => {
    expect(file(keys.CORRECT_FILE_PATH_ABS)).toBe(VALID_FILE_PATH_ABS);
    expect(file(keys.CORRECT_FILE_PATH_RELATIVE)).toBe(VALID_FILE_PATH_ABS);
  });

  test('Should correctly parse path to existing file', () => {
    expect(() => file(keys.INCORRECT_FILE_PATH)).toThrow(ConfigurationException);
    expect(() => file(keys.NOT_EXISTING_FILE)).toThrow(ConfigurationException);
  });
});

describe('GetDirectory', () => {
  const dir = (key: keyof TestValues, d?: string) => config.getDir(key, d);

  test('Should correctly parse path to existing file', () => {
    expect(dir(keys.CORRECT_DIR_PATH_ABS)).toBe(VALID_DIR_PATH_ABS);
    expect(dir(keys.CORRECT_DIR_PATH_RELATIVE)).toBe(VALID_DIR_PATH_ABS);
  });

  test('Should correctly parse path to existing file', () => {
    expect(() => dir(keys.INCORRECT_DIR_PATH)).toThrow(ConfigurationException);
    expect(() => dir(keys.NOT_EXISTING_DIR)).toThrow(ConfigurationException);
  });
});

describe('GetUrl', () => {
  const url = (key: keyof TestValues, d?: URL) => config.getUrl(key, d);

  test('GetUrl - positive', () => {
    expect(url(keys.VALID_URL_HTTPS)).toEqual(new URL(VALID_URL_HTTPS));
    expect(url(keys.VALID_URL_REDIS)).toEqual(new URL(VALID_URL_REDIS));
    expect(url(keys.VALID_URL_REDIS_ACL)).toEqual(new URL(VALID_URL_REDIS_ACL));
    expect(url(keys.VALID_URL_POSTGRES)).toEqual(new URL(VALID_URL_POSTGRES));
  });

  test('GetUrl - negative', () => {
    expect(() => url(keys.INVALID_URL)).toThrow(InvalidUrlException);
    /*
      Something like
      expect(url(keys.INCORRECT_URL_PROTOCOL)).toThrow(InvalidUrlException);
      is not possible because there is no registry of avaliable protocols.
    */
  })
});
