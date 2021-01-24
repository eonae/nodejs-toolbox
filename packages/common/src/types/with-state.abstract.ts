export abstract class WithState<TState> {
  protected state: TState;

  public __getState (): TState {
    // clone?
    return this.state;
  }

  /**
   * This method should be protected (or shouldn't exist at all).
   * But the problem is in repository.save() method. Repository must have a way to
   * set some fields, for example id, created_at etc. But there seems to be no way
   * to give access to this call ONLY to repository.
   */
  public __setState (state: TState): WithState<TState> {
    this.state = state;
    return this;
  }
}
