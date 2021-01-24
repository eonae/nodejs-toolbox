/* eslint-disable @typescript-eslint/no-floating-promises */
import { join } from 'path';
import { readObj, saveObj } from '../src/serialization/index';

readObj(
  join(__dirname, 'test.yaml')
).then(obj => saveObj(obj, join(__dirname, 'test.json')));
