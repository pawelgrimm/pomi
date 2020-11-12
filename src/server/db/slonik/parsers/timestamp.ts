import { TypeParserType } from "slonik";

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
export const createTimestampTypeParser = (
  name: string = "timestamp"
): TypeParserType => ({
  name,
  parse: timestampParser,
});
