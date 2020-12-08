import { parseStringToBoolean, validateSyncToken } from "../models";
import { ProjectOptions } from "../../types";

/**
 * Parse a ProjectSelectOptions object, validate the options, and set defaults for undefined options.
 * @param {ProjectOptions} options - options provided to select()
 */
export const parseSelectAllOptions = (options: any = {}): ProjectOptions => {
  const { syncToken } = options;

  const includeArchived = parseStringToBoolean(
    "includeArchived",
    options.includeArchived
  );

  validateSyncToken(syncToken);

  return {
    syncToken,
    includeArchived,
  };
};
