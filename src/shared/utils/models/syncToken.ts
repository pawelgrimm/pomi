import { ProjectModel, SessionModel, TaskModel } from "../../types";
import { isValid, parseISO } from "date-fns";
import { ParseOptionsError } from "../../../server/errors";

export const createSyncToken = (
  results: [
    readonly Required<SessionModel>[],
    readonly Required<TaskModel>[],
    readonly Required<ProjectModel>[]
  ],
  fallback?: string
) => {
  const lastModified = Math.max(
    ...results.map((model) =>
      model.length > 0 ? model[0].lastModified.valueOf() : 0
    )
  );
  return lastModified > 0
    ? new Date(lastModified).toISOString()
    : fallback || "*";
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
  return syncToken;
};
