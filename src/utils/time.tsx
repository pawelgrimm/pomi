import { parse } from "date-fns";

/**
 * Time-related utility functions
 */

/**
 * Convert a time duration (in seconds) to minutes and seconds parts. For example, 65 seconds becomes 1 minute, 05 seconds.
 * @param seconds duration in seconds
 * @returns [minutes, seconds] with the seconds part padded with 0s to 2 digits
 */
const formatSeconds = (seconds: number): [string, string] => {
  const secondsPart = Math.abs(seconds % 60).toString();
  const minutesPart = Math.floor(seconds / 60).toString();
  return [minutesPart, secondsPart.padStart(2, "0")];
};

/**
 * Convert a date and time into a Unix time
 * @param date a date in the format M/dd/yy (e.g. 9/22/20)
 * @param time a time in the format kmm (e.g. 955 or 1356)
 * @returns the Unix time that corresponds to the specified date and time
 */
const getUnixTime = (date: string, time: number): number => {
  const unixTime = parse(
    `${date} ${time}`,
    "M/dd/yy kmm",
    Date.now()
  ).valueOf();
  if (isNaN(unixTime)) {
    throw new RangeError(`${date} ${time} is not a valid instance.`);
  }
  return unixTime;
};

export { formatSeconds, getUnixTime };
