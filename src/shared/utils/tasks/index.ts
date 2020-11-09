import { parseStringToBoolean, validateSyncToken } from "../models";
import { TaskSelectOptions } from "../../models";

/**
 * Parse a TaskSelectOptions object, validate the options, and set defaults for undefined options.
 * @param {TaskSelectOptions} options - options provided to select()
 */
export const parseSelectAllOptions = <T extends string | boolean = boolean>(
  options: TaskSelectOptions<T> = {}
): Required<TaskSelectOptions> => {
  const { syncToken = "*" } = options;
  let includeCompleted = parseStringToBoolean(
    "includeCompleted",
    options.includeCompleted
  );

  validateSyncToken(syncToken);

  return {
    syncToken,
    includeCompleted,
  };
};
