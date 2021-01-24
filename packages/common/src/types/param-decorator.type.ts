/* eslint-disable @typescript-eslint/ban-types */
export type CustomParameterDecorator =
  (target: object, key: string | symbol, index?: number) => void;
