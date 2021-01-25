export type HrTime = [number, number];

/**
 * Timer used to mesure execution time.
 *
 * @export
 * @class Stopwatch
 */
export class Stopwatch {
  // tslint:disable-next-line: variable-name
  private _start: HrTime;

  // tslint:disable-next-line: variable-name
  private _current: HrTime;

  // tslint:disable-next-line: variable-name
  private _isRunning: boolean;

  /**
   * Number of milliseconds passed from stopwatch started.
   *
   * @readonly
   * @type {number}
   * @memberof Stopwatch
   */
  get elapsedMilliseconds (): number {
    return this.convertToMilliseconds(this.elapsed);
  }

  /**
   * Time in process.hrtime format passed from stopwatch started.
   *
   * @readonly
   * @type {HrTime}
   * @memberof Stopwatch
   */
  get elapsed (): HrTime {
    return this._isRunning ? process.hrtime(this._start) : this._current;
  }

  /**
   * Stops the stopwatch and clears time.
   * Returns this.
   *
   * @returns {Stopwatch}
   * @memberof Stopwatch
   */
  reset (): Stopwatch {
    this._start = null;
    this._current = null;
    this._isRunning = false;
    return this;
  }

  /**
   * Clears time and restarts the stopwatch.
   * Returns this.
   *
   * @returns {Stopwatch}
   * @memberof Stopwatch
   */
  restart (): Stopwatch {
    this.reset();
    this.start();
    return this;
  }

  /**
   * Starts stopwatch.
   * Returns this.
   *
   * @returns {Stopwatch}
   * @memberof Stopwatch
   */
  start (): Stopwatch {
    if (!this._start) {
      this._start = process.hrtime();
    }
    this._isRunning = true;
    return this;
  }

  /**
   * Pauses stopwatch. Can be resumed with .start()
   * Returns this.
   *
   * @returns {Stopwatch}
   * @memberof Stopwatch
   */
  pause (): Stopwatch {
    this._current = process.hrtime(this._start);
    this._isRunning = false;
    return this;
  }

  private convertToMilliseconds (hrtime: HrTime) {
    const nanoseconds = hrtime[0] * 1e9 + hrtime[1];
    const milliseconds = nanoseconds / 1e6;
    return milliseconds;
  }
}
