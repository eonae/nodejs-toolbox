export type Transformation<
  T extends Record<string, unknown> = Record<string, unknown>,
  K extends Record<string, unknown> = Record<string, unknown>,
> = (source: T) => K;

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}
