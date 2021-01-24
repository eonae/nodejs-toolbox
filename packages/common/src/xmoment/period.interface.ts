import { Moment, unitOfTime } from 'moment';

// Subset of extended moment DateRange interface
/**
 * Represents period of time (start date and end date).
 * Is compatible (subset) of DateRange interface from 'moment-range'
 *
 * @export
 * @interface IPeriod
 */
export interface IPeriod {
  /**
   * Start date.
   *
   * @type {(Moment | Date)}
   * @memberof IPeriod
   */
  start: Moment | Date;

  /**
   * End date.
   *
   * @type {(Moment | Date)}
   * @memberof IPeriod
   */

  end: Moment | Date;

  /**
   * Checks if this time period is adjacent to other.
   *
   * @param {IPeriod} other
   * @returns {boolean}
   * @memberof IPeriod
   */
  adjacent (other: IPeriod): boolean;

  /**
   * Adds time period to another one.
   *
   * @param {IPeriod} other
   * @param {{ adjacent?: boolean }} [options]
   * @returns {(IPeriod | null)}
   * @memberof IPeriod
   */
  add (other: IPeriod, options?: { adjacent?: boolean }): IPeriod | null;

  /**
   * Checks if timeperiod contains other one.
   *
   * @param {IPeriod} other
   * @param {{ adjacent?: boolean }} [options]
   * @returns {(IPeriod | null)}
   * @memberof IPeriod
   */
  contains (
    other: Date | IPeriod | Moment,
    options?: { excludeStart?: boolean; excludeEnd?: boolean }
  ): boolean;

  /**
   * FIXME: Add documentation.
   *
   * @param {IPeriod} other
   * @param {{ adjacent?: boolean }} [options]
   * @returns {(IPeriod | null)}
   * @memberof IPeriod
   */
  diff (unit?: unitOfTime.Diff, precise?: boolean): number;

  /**
   * Returns duration of time period in specified units.
   *
   * @param {IPeriod} other
   * @param {{ adjacent?: boolean }} [options]
   * @returns {(IPeriod | null)}
   * @memberof IPeriod
   */
  duration (unit?: unitOfTime.Diff, precise?: boolean): number;

  /**
   * Returns time period which is intersection of two.
   *
   * @param {IPeriod} other
   * @param {{ adjacent?: boolean }} [options]
   * @returns {(IPeriod | null)}
   * @memberof IPeriod
   */
  intersect (other: IPeriod): IPeriod | null;

  /**
   * Checks if two periods of time are equal.
   *
   * @param {IPeriod} other
   * @returns {boolean}
   * @memberof IPeriod
   */
  isEqual (other: IPeriod): boolean;

  /**
   * Checks if one time period overlaps another one.
   *
   * @param {IPeriod} other
   * @param {{ adjacent?: boolean; }} [options]
   * @returns {boolean}
   * @memberof IPeriod
   */
  overlaps (other: IPeriod, options?: { adjacent?: boolean }): boolean;

  /**
   * FIXME: Add documentation.
   *
   * @param {unitOfTime.Diff} interval
   * @returns {IPeriod}
   * @memberof IPeriod
   */
  snapTo (interval: unitOfTime.Diff): IPeriod;

  /**
   * FIXME: Add documentation.
   *
   * @param {IPeriod} other
   * @returns {IPeriod[]}
   * @memberof IPeriod
   */
  subtract (other: IPeriod): IPeriod[];
}
