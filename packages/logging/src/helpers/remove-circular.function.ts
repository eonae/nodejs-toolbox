/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { normalizeObject } from './normalize-object.function';

type CircularRemover = (key: string, value: any) => any;

/**
 * Возвращает функцию для подстановки в параметр replacer для JSON.stringify,
 * убирающую циклы в объектах
 * @return function
 */
export const removeCircular = (): CircularRemover => {
  const cache: { [key: string]: any }[] = [];

  return (key: string, value: unknown): unknown => {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    // Duplicate reference found, discard key
    if (cache.includes(value)) {
      return '[circular]';
    }

    cache.push(value);

    return normalizeObject(value);
  };
};
