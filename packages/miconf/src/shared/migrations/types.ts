export type Transformation<T = unknown> = (source: T) => T;

export enum Direction { UP = 'up', DOWN = 'down' }
