import { SessionModel } from "../../types";
import { addMilliseconds } from "date-fns";
import { sqlDuration } from "..";

/**
 * Append "milliseconds" to a numeric value
 * @param duration an interval in milliseconds
 * @returns a string in the format "%d milliseconds", or undefined if duration is falsy (0 or undefined).
 */
export const getDurationWithUnits = (duration?: number): string | null => {
  return sqlDuration(duration);
};

/**
 * Calculate the end timestamp of a session
 * @param session: an object containing a startTimestamp and a duration (in ms)
 * @returns the end timestamp as a Date object, or undefined if
 *  parent does not contain a start timestamp and duration
 */
export const calculateEndTimestamp = (
  session: Pick<SessionModel, "startTimestamp" | "duration">
): Date => {
  const { startTimestamp, duration } = session;
  return addMilliseconds(new Date(startTimestamp), Number(duration));
};
