/**
 * Parse a SelectOptions object, validate the options, and set defaults for undefined options.
 * @param {ProjectSelectOptions} options - options provided to select()
 */
import { parseStringToBoolean } from "../models";
import { isValid, parseISO } from "date-fns";
import { ParseOptionsError } from "../../../server/errors";
import { ProjectSelectOptions } from "../../models";

export const parseSelectAllOptions = <T extends string | boolean = boolean>(
  options: ProjectSelectOptions<T> = {}
): Required<ProjectSelectOptions> => {
  const { syncToken = "*" } = options;
  let includeArchived = parseStringToBoolean(
    "includeArchived",
    options.includeArchived
  );

  if (syncToken !== "*" && !isValid(parseISO(syncToken))) {
    throw new ParseOptionsError([
      {
        name: "syncToken",
        message: `"${syncToken}" could not be parsed as an ISO 8601 date string.`,
      },
    ]);
  }

  return {
    syncToken,
    includeArchived,
  };
};
