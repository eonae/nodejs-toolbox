/**
 * Makes execution sleep for specified amount of milliseconds.
 * Any other javascript from event loop can be executed.
 *
 * @param {number} msec
 * @returns
 */
export const delay = (msec: number): Promise<void> => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, msec);
});
