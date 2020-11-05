import { createPool as createPoolSlonik, DatabasePoolType } from "slonik";
import { createFieldNameTransformationInterceptor } from "slonik-interceptor-field-name-transformation";
import { createQueryLoggingInterceptor } from "slonik-interceptor-query-logging";
import { PG_CONNECTION_STRING } from "../config";

// Set up interceptors for Slonik
const interceptors = [
  createFieldNameTransformationInterceptor({
    format: "CAMEL_CASE",
  }),
  createQueryLoggingInterceptor(),
];

/**
 * Create a pool, for tests
 */
const createPool = () => {
  return createPoolSlonik(PG_CONNECTION_STRING, { interceptors });
};

/**
 * Set up a client pool connected to the application database
 */
const pool = createPool();

export { pool, createPool };
export type { DatabasePoolType };
