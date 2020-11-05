import { isValid, parseISO } from "date-fns";
import { ProjectModel } from "../../../shared/models";
import { DatabasePoolType, sql } from "slonik";
import { raw } from "slonik-sql-tag-raw";
import { ParseOptionsError } from "../../errors";

const RETURN_COLS = raw("id, title, is_archived");

const bindProjectQueries = (pool: DatabasePoolType) => {
  return {
    /**
     * Create one project in the projects table
     * @param userId - id of user assigned to object
     * @param project - project to insert
     */
    create: async (
      userId: string,
      project: ProjectModel
    ): Promise<ProjectModel> => {
      const { title = "", isArchived = false } = project;
      return pool.one(sql`
        INSERT INTO projects(user_id, title, is_archived)
        VALUES (${userId}, ${title}, ${isArchived})
        RETURNING ${RETURN_COLS};
      `);
    },

    /**
     * Get multiple projects for a user
     * @param userId - id of project-owning user
     * @param {SelectOptions} options - additional options used to customize query
     */
    select: async (
      userId: string,
      options?: SelectOptions
    ): Promise<Readonly<ProjectModel[]>> => {
      const whereClauses = [sql`user_id = ${userId}`];

      whereClauses.push(
        ...buildAdditionalWhereClauses(parseSelectAllOptions(options))
      );

      return pool.any(sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE ${sql.join(whereClauses, sql` AND `)};
        `);
    },

    /**
     * Get a project for a user
     * @param userId - id of project-owning user
     * @param projectId - id of project to query
     */
    selectOne: async (
      userId: string,
      projectId: string
    ): Promise<ProjectModel | null> => {
      return pool.maybeOne(sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE user_id = ${userId} AND id = ${projectId};
        `);
    },
  };
};

export { bindProjectQueries };

/**
 * Options provided to select()
 * @typedef {Object} SelectOptions
 * @property {string} syncToken - token that indicates last sync time; when provided,
 *  only projects modified after the last sync are queried
 * @property {boolean} includeArchived - indicates if archived projects should be queried
 */
export type SelectOptions = {
  syncToken?: string;
  includeArchived?: boolean;
};

/**
 * Parse a SelectOptions object, validate the options, and set defaults for undefined options.
 * @param {SelectOptions} options - options provided to select()
 */
export const parseSelectAllOptions = (
  options: SelectOptions = {}
): Required<SelectOptions> => {
  const { syncToken = "*", includeArchived = false } = options;
  if (syncToken !== "*" && !isValid(parseISO(syncToken))) {
    throw new ParseOptionsError([
      {
        name: syncToken,
        message: `"${syncToken}" could not be parsed as an ISO 8601 date string.`,
      },
    ]);
  }

  return {
    syncToken,
    includeArchived,
  };
};

/**
 * Build additional where clauses based on options
 * @param options {SelectOptions} options - options provided to select()
 */
const buildAdditionalWhereClauses = (options: Required<SelectOptions>) => {
  const { includeArchived, syncToken } = options;
  const whereClauses = [];
  if (syncToken !== "*") {
    whereClauses.push(sql`last_modified >= ${syncToken}`);
  } else if (!includeArchived) {
    whereClauses.push(sql`is_archived = FALSE`);
  }
  return whereClauses;
};
