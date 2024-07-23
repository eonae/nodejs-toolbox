export class AjvError extends Error {
  public readonly errors: unknown[];

  constructor(message: string, errors: unknown[]) {
    super(message);
    this.errors = errors;
  }
}
