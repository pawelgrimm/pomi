import { parseStringToBoolean, validateSyncToken } from "../models";
import { ProjectSelectOptions } from "../../types";

/**
 * Parse a ProjectSelectOptions object, validate the options, and set defaults for undefined options.
 * @param {ProjectSelectOptions} options - options provided to select()
 */
export const parseSelectAllOptions = <T extends string | boolean = boolean>(
  options: ProjectSelectOptions<T> = {}
): Required<ProjectSelectOptions> => {
  const { syncToken = "*" } = options;
  let includeArchived = parseStringToBoolean(
    "includeArchived",
    options.includeArchived
  );

  validateSyncToken(syncToken);

  return {
    syncToken,
    includeArchived,
  };
};
