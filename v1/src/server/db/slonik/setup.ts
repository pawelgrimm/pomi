import { createInterceptors } from "./interceptors";
import { createTypeParsers } from "./parsers";

/**
 * Generate configuration object for Slonik
 */
export const createSlonikConfiguration = () => ({
  interceptors: [...createInterceptors()],
  typeParsers: [...createTypeParsers()],
});
