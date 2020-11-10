import {
  createBigintTypeParser,
  createDateTypeParser,
  createIntervalTypeParser,
  createNumericTypeParser,
  createPool,
  DatabasePoolType,
  TypeParserType,
} from "slonik";
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
 * Parse PostgreSQL string representation of a timestamp into
 * @param value
 */
const timestampParser = (value: string | null) => {
  return value === null ? value : new Date(value);
};

/**
 * Generate a slonik type parser for timestamps
 * @param name
 */
const createTimestampTypeParser = (
  name: string = "timestamp"
): TypeParserType => ({
  name,
  parse: timestampParser,
});

/**
 * Generate type parsers for Slonik
 */
const createTypeParsers = (): ReadonlyArray<TypeParserType> => [
  createBigintTypeParser(),
  createDateTypeParser(),
  createIntervalTypeParser(),
  createNumericTypeParser(),
  createTimestampTypeParser("timestamp"),
  createTimestampTypeParser("timestamptz"),
];

/**
 * Set up a client pool connected to the application database
 */
const pool = createPool(PG_CONNECTION_STRING, {
  interceptors,
  typeParsers: [...createTypeParsers()],
});

const closePool = () => pool.end();

export { pool, closePool };
export type { DatabasePoolType };
