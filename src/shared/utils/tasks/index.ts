import { parseStringToBoolean, validateSyncToken } from "../models";
import { TaskOptions } from "../../types";

/**
 * Parse a TaskSelectOptions object, validate the options, and set defaults for undefined options.
 * @param {TaskOptions} options - options provided to select()
 */
export const parseSelectAllOptions = (options: any = {}): TaskOptions => {
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
