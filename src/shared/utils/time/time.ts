import { format, parse } from "date-fns";

/**
 * Time-related utility functions
 */

/**
 * Convert a time duration (in seconds) to hours, minutes and seconds parts. For example, 65 seconds becomes 0 hours, 1 minute, 05 seconds.
 * @param seconds duration in seconds
 * @returns [hours, minutes, seconds] with the seconds part padded with 0s to 2 digits
 */
const secondsToParts = (seconds: number): { sign: string; parts: number[] } => {
  const signPart = seconds < 0 ? "-" : "";
  seconds = Math.abs(seconds);
  const hoursPart = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutesPart = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;

  return { sign: signPart, parts: [hoursPart, minutesPart, secondsPart] };
};

/**
 * Convert seconds to time formatted as HH:MM:SS
 * @param seconds time in seconds
 * @param options object containing trimmed: true to remove 0 padding
 */
const secondsToFormattedTime = (
  seconds: number,
  options: { trimmed: boolean } = { trimmed: false }
): string => {
  const padLength = options.trimmed ? 0 : 2;

  const { sign, parts } = secondsToParts(seconds);
  return (
    sign +
    parts
      .filter((part, index) => !(options.trimmed && index === 0))
      .map((part) => part.toString().padStart(padLength, "0"))
      .join(":")
  );
};

/**
 * Convert a time in the format HH:MM:SS to seconds
 * @param formattedTime time in the format HH:MM:SS
 * @returns time in seconds
 */
const formattedTimeToSeconds = (formattedTime: string) => {
  const tokens = formattedTime
    .split(":")
    .map((token) => Number.parseInt(token));
  return tokens
    .reverse()
    .reduce((acc, curr, index) => acc + curr * Math.pow(60, index));
};

/**
 * Convert a date and time into a Unix epoch time, or the number of seconds that have elapsed since the Unix epoch
 * @param date a date in the format M/dd/yy (e.g. 9/22/20)
 * @param time a time in the format kmm (e.g. 955 or 1356)
 * @returns the epoch time (in seconds) that corresponds to the specified date and time
 */
const getEpochTime = (date: string, time: number): number => {
  const unixTime = getDate(date, time).valueOf() / 1000.0;
  if (isNaN(unixTime)) {
    throw new RangeError(`${date} ${time} is not a valid instance.`);
  }
  return unixTime;
};

/**
 * Convert a date and time into a Date object
 * @param date a date in the format M/dd/yy (e.g. 9/22/20)
 * @param time a time in the format kmm (e.g. 955 or 1356)
 * @returns the Date that corresponds to the specified date and time
 */
const getDate = (date: string, time: number): Date => {
  return parse(
    `${date} ${time.toString().padEnd(3, "0")}`,
    "M/dd/yy kmm",
    Date.now()
  );
};

/**
 * Get the hours and minutes corresponding to a Unix epoch time
 * @param time the specified epoch time
 * @returns hours and minutes in the format kmm (e.g. 955 or 1356)
 */
const getTimeFromEpochTime = (time: number): number => {
  return getTimeFromDate(new Date(time * 1000));
};

/**
 * Get the hours and minutes corresponding to a date
 * @param date the specified Date
 * @returns hours and minutes in the format kmm (e.g. 955 or 1356)
 */
const getTimeFromDate = (date: Date): number => {
  return Number.parseInt(format(date, "kkmm"));
};

/**
 * Get the date corresponding to a Unix epoch time
 * @param time the specified epoch time
 * @returns date in the format M/dd/yy (e.g. 9/22/20)
 */
const getDateStringFromEpochTime = (time: number): string => {
  return getDateStringFromDate(new Date(time * 1000));
};

/**
 * Get the date corresponding to a Date
 * @param date the specified Date
 * @returns date in the format M/dd/yy (e.g. 9/22/20)
 */
const getDateStringFromDate = (date: Date): string => {
  return format(date, "MM/dd/yy");
};

/**
 * Get the Date object from a Unix epoch time
 * @param time the specified epoch time
 * @returns Date object
 */
const getDateFromEpochTime = (time: number): Date => {
  return new Date(time * 1000);
};

/**
 * Convert the date to a string format for use in SQL queries
 * @param date the date object to convert
 */
const sqlDate = (date: Date) => date.toISOString();

/**
 * Append "milliseconds" to a numeric value for use in SQL queries
 * @param duration an interval in milliseconds
 * @returns a string in the format "%d milliseconds", or undefined if duration is falsy (0 or undefined).
 */
const sqlDuration = (duration?: number): string | null => {
  return duration ? `${duration} milliseconds` : null;
};

export {
  secondsToParts,
  getEpochTime,
  getDate,
  secondsToFormattedTime,
  formattedTimeToSeconds,
  getTimeFromEpochTime,
  getTimeFromDate,
  getDateStringFromEpochTime,
  getDateStringFromDate,
  getDateFromEpochTime,
  sqlDate,
  sqlDuration,
};
