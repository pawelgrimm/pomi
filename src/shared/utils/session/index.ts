import { SessionType, SessionTypeString } from "../../models/session";

/**
 * Append "milliseconds" to a numeric value
 * @param duration an interval in milliseconds
 * @returns a string in the format "%d milliseconds", or undefined if duration is falsy (0 or undefined).
 */
export const getDurationWithUnits = (duration?: number): string | undefined => {
  return duration ? `${duration} milliseconds` : undefined;
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
