import { createPool, DatabasePoolType } from "slonik";
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
 * Set up a client pool connected to the application database
 */
const pool = createPool(PG_CONNECTION_STRING, { interceptors });

/**
 * End the client pool's connection
 */
const close = () => pool.end();

export { pool, close };
export type { DatabasePoolType };
