import { Model } from "./model";
import { DatabasePoolType, sql } from "slonik";
import { isValid, parseISO } from "date-fns";
import { ParseOptionsError } from "../../errors";
import { parseStringToBoolean } from "../../../shared/utils/models";
import { ProjectModel } from "../../../shared/models";
import { raw } from "slonik-sql-tag-raw";

const RETURN_COLS = raw("id, title, is_archived");

/**
 * Class representing projects table.
 */
export class Project implements Model {
  constructor(private pool: DatabasePoolType) {}

  /**
   * Create one project in the projects table
   * @param userId - id of user assigned to object
   * @param project - project to insert
   */
  async create(userId: string, project: ProjectModel): Promise<ProjectModel> {
    const { title = "", isArchived = false } = project;
    return this.pool.one(sql`
        INSERT INTO projects(user_id, title, is_archived)
        VALUES (${userId}, ${title}, ${isArchived})
        RETURNING ${RETURN_COLS};
    `);
  }

  /**
   * Get multiple projects for a user
   * @param userId - id of project-owning user
   * @param {SelectOptions} options - additional options used to customize query
   */
  async select(
    userId: string,
    options?: SelectOptions
  ): Promise<Readonly<ProjectModel[]>> {
    const whereClauses = [sql`user_id = ${userId}`];

    const parsedOptions = Project.parseSelectAllOptions(options);

    whereClauses.push(...Project.buildAdditionalWhereClauses(parsedOptions));

    return this.pool.any(sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE ${sql.join(whereClauses, sql` AND `)};
        `);
  }

  /**
   * Get a project for a user
   * @param userId - id of project-owning user
   * @param projectId - id of project to query
   */
  async selectOne(
    userId: string,
    projectId: string
  ): Promise<ProjectModel | null> {
    return this.pool.maybeOne(sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE user_id = ${userId} AND id = ${projectId};
        `);
  }

  /**
   * Parse a SelectOptions object, validate the options, and set defaults for undefined options.
   * @param {SelectOptions} options - options provided to select()
   */
  static parseSelectAllOptions<T extends string | boolean = boolean>(
    options: SelectOptions<T> = {}
  ): Required<SelectOptions> {
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
  }

  /**
   * Build additional where clauses based on options
   * @param options {SelectOptions} options - options provided to select()
   */
  private static buildAdditionalWhereClauses(options: Required<SelectOptions>) {
    const { includeArchived, syncToken } = options;
    const whereClauses = [];
    if (syncToken !== "*") {
      whereClauses.push(sql`last_modified >= ${syncToken}`);
    } else if (!includeArchived) {
      whereClauses.push(sql`is_archived = FALSE`);
    }
    return whereClauses;
  }
}

/**
 * Options provided to Project's select() function
 * @typedef {Object} SelectOptions
 * @property {string} syncToken - token that indicates last sync time; when provided,
 *  only projects modified after the last sync are queried
 * @property {T extends string | boolean = boolean} includeArchived - indicates if archived projects should be queried
 */
export type SelectOptions<T extends string | boolean = boolean> = {
  syncToken?: string;
  includeArchived?: T;
};
