import {
  SessionSelectOptions,
  SessionType,
  SessionTypeString,
} from "../../types/session";
import { parseStringToBoolean, validateSyncToken } from "../models";
import { TaskSelectOptions } from "../../types";

/**
 * Append "milliseconds" to a numeric value
 * @param duration an interval in milliseconds
 * @returns a string in the format "%d milliseconds", or undefined if duration is falsy (0 or undefined).
 */
export const getDurationWithUnits = (duration?: number): string | null => {
  return duration ? `${duration} milliseconds` : null;
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
