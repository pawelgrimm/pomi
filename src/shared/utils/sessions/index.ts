import {
  SessionModel,
  SessionSelectOptions,
  SessionType,
  SessionTypeString,
} from "../../types/session";
import { validateSyncToken } from "../models";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
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
 * Convert a SessionType enum value (a number) to a string representing that session type
 * @param value a SessionType value
 * @returns a string representation of the SessionType value
 */
export const getSessionTypeAsString = (
  value: SessionType
): SessionTypeString => {
  return SessionType[value] as SessionTypeString;
};

/**
 * Parse a TaskSelectOptions object, validate the options, and set defaults for undefined options.
 * @param {TaskSelectOptions} options - options provided to select()
 */
export const parseSelectAllOptions = <T extends string | Date = Date>(
  options: SessionSelectOptions<T> = {}
): Required<SessionSelectOptions> => {
  const { syncToken = "*" } = options;

  validateSyncToken(syncToken);

  return {
    syncToken,
  };
};

/**
 * Calculate the end timestamp of a session
 * @param session: an object containing a startTimestamp and a duration (in ms)
 * @returns the end timestamp as a Date object, or undefined if
 *  parent does not contain a start timestamp and duration
 */
export const calculateEndTimestamp = (
  session: Pick<SessionModel, "startTimestamp" | "duration">
): Date | undefined => {
  const { startTimestamp, duration } = session;
  if (startTimestamp && duration) {
    return addMilliseconds(startTimestamp, Number(duration));
  }
  return undefined;
};

/**
 * Calculate the duration (in milliseconds) of a session
 * @param session: an object containing a startTimestamp and a duration
 * @returns the duration in the format "n milliseconds", or undefined if
 *  parent does not contain a start and end timestamp
 */
export const calculateDuration = (
  session: Pick<SessionModel, "startTimestamp" | "endTimestamp">
): number | undefined => {
  const { startTimestamp, endTimestamp } = session;
  if (startTimestamp && endTimestamp) {
    return differenceInMilliseconds(endTimestamp, startTimestamp);
  }
  return undefined;
};
