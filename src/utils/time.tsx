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

export { formatSeconds };
