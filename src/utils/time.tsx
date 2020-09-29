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

const formattedTimeToSeconds = (formattedTime: string) => {
  const tokens = formattedTime
    .split(":")
    .map((token) => Number.parseInt(token));
  return tokens
    .reverse()
    .reduce((acc, curr, index) => acc + curr * Math.pow(60, index));
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

/**
 * Get the hour and minute corresponding to a Unix time
 * @param time the specified Unix time
 * @returns hours and minutes in the format kmm (e.g. 955 or 1356)
 */
const getHoursMinutesFromUnixTime = (time: number): number => {
  return Number.parseInt(format(new Date(time), "kkmm"));
};

/**
 * Get the date corresponding to a Unix time
 * @param time the specified Unix time
 * @returns date in the format M/dd/yy (e.g. 9/22/20)
 */
const getDateFromUnixTime = (time: number): string => {
  return format(new Date(time), "MM/dd/yy");
};

export {
  secondsToParts,
  getUnixTime,
  secondsToFormattedTime,
  formattedTimeToSeconds,
  getHoursMinutesFromUnixTime,
  getDateFromUnixTime,
};
