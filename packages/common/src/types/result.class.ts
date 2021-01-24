/* eslint-disable @typescript-eslint/no-explicit-any */
export type AsyncResult<TData, TError = any> = Promise<Result<TData, TError>>;

export class Result<TData, TError = any> {
  constructor (
    public readonly data: TData,
    public readonly error: TError
  ) { }

  get isError (): boolean {
    return !!this.error;
  }

  static data<D = any, E = any> (data: D): Result<D, E> {
    return new Result<D, E>(data, null);
  }

  static error<D = any, E = any> (error: E): Result<D, E> {
    return new Result<D, E>(null, error);
  }
}
