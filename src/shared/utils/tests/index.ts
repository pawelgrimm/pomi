/**
 * Pause execution for the specified duration. Don't forget to add await, as this returns a Promise.
 * @param duration time to sleep in milliseconds
 */
export const sleep = (duration: number) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};
