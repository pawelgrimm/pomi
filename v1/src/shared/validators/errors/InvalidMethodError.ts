/**
 * Error thrown when a validator is called with an unsupported method
 */
export class InvalidMethodError extends Error {
  constructor(method: string) {
    super(`Method "${method}" is unsupported by this validator`);
  }
}
