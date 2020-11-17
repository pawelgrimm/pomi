import { parseStringToBoolean, validateSyncToken } from "../models";
import { TaskSelectOptions } from "../../types";

/**
 * Parse a TaskSelectOptions object, validate the options, and set defaults for undefined options.
 * @param {TaskSelectOptions} options - options provided to select()
 */
export const parseSelectAllOptions = (options: any = {}): TaskSelectOptions => {
  const { syncToken = "*" } = options;

  const includeCompleted = parseStringToBoolean(
    "includeCompleted",
    options.includeCompleted
  );

  validateSyncToken(syncToken);

  return {
    syncToken,
    includeCompleted,
  };
};
