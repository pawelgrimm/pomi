/**
 * Pause execution for the specified duration. Don't forget to add await, as this returns a Promise.
 * @param duration time to sleep in milliseconds
 */
export const sleep = (duration: number) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

/**
 * Wrap an array of objects in expect.objectContaining
 * @param objects an array of objects
 */
export const wrapObjectContaining = (objects: {}[]) =>
  objects.map((object) => expect.objectContaining(object));

/**
 * Wrap an array of objects in expect.objectContaining and wrap that in expect.arrayContaining
 * @param objects an array of objects
 */
export const arrayContainingObjectsContaining = (objects: {}[]) =>
  expect.arrayContaining(wrapObjectContaining(objects));
