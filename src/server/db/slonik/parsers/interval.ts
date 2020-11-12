import { TypeParserType } from "slonik";
import { parse as parseISO, toSeconds } from "iso8601-duration";
import parsePgInterval from "postgres-interval";
/**
 * Parse PostgreSQL interval into milliseconds
 * @param value
 */
const intervalParser = (value: string | null) => {
  console.log("interval parser", value);
  return value === null
    ? value
    : toSeconds(parseISO(parsePgInterval(value).toISOString())) * 1000;
};

/**
 * Generate a slonik type parser for PostgreSQL intervals
 * @param name
 */
export const createIntervalTypeParser = (
  name: string = "interval"
): TypeParserType => ({
  name,
  parse: intervalParser,
});
