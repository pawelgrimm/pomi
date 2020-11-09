import { ParseOptionsError } from "../../../server/errors";
import { isValid, parseISO } from "date-fns";

/**
 * Convert a string value to a boolean
 * @param pathName - name of path being tested, passed to error if thrown
 * @param value a string value representing a boolean
 */
export const parseStringToBoolean = (
  pathName: string,
  value?: string | boolean
): boolean => {
  // undefined, null, false
  if (!value) {
    return false;
  }
  // true
  if (typeof value === "boolean") {
    return value;
  }
  // strings
  value = value.toLowerCase();
  if (value === "0" || value === "false") {
    return false;
  } else if (value === "1" || value === "true") {
    return true;
  }

  throw new ParseOptionsError([
    {
      name: pathName,
      message: `"${value}" could not be parsed to a boolean value`,
    },
  ]);
};

/**
 * Check if a sync token is valid
 * @param syncToken the sync token to validate
 */
export const validateSyncToken = (syncToken: string) => {
  if (syncToken !== "*" && !isValid(parseISO(syncToken))) {
    throw new ParseOptionsError([
      {
        name: "syncToken",
        message: `"${syncToken}" could not be parsed as an ISO 8601 date string.`,
      },
    ]);
  }
};
