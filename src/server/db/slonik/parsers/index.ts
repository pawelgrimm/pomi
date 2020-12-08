import { createTimestampTypeParser } from "./timestamp";
import { createIntervalTypeParser } from "./interval";
import {
  createBigintTypeParser,
  createDateTypeParser,
  createNumericTypeParser,
  TypeParserType,
} from "slonik";

/**
 * Generate type parsers for Slonik
 */
export const createTypeParsers = (): ReadonlyArray<TypeParserType> => [
  createBigintTypeParser(),
  createDateTypeParser(),
  createIntervalTypeParser(),
  createNumericTypeParser(),
  createTimestampTypeParser("timestamp"),
  createTimestampTypeParser("timestamptz"),
];
