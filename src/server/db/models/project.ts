import { sql, raw } from "../slonik";
import { Model } from "./model";
import { ProjectModel, ProjectSelectOptions } from "../../../shared/types";
import { parseSelectAllOptions } from "../../../shared/utils/projects";
import { validateProject } from "../../../shared/validators";

const RETURN_COLS = raw("id, title, is_archived");

/**
 * Class representing the projects table.
 */
export class Project extends Model {
  /**
   * Create one project in the projects table
   * @param userId - id of user assigned to object
   * @param project - project to insert
   */
  async create(
    userId: string,
    project: ProjectModel
  ): Promise<Required<ProjectModel>> {
    const { title = "", isArchived = false } = validateProject(project);
    return this.connection.one(sql`
        INSERT INTO projects(user_id, title, is_archived)
        VALUES (${userId}, ${title}, ${isArchived})
        RETURNING ${RETURN_COLS};
    `);
  }

  /**
   * Get multiple projects for a user
   * @param userId - id of project-owning user
   * @param {ProjectSelectOptions} options - additional options used to customize query
   */
  async select(
    userId: string,
    options?: ProjectSelectOptions
  ): Promise<Readonly<Required<ProjectModel>[]>> {
    const whereClauses = [sql`user_id = ${userId}`];

    const parsedOptions = parseSelectAllOptions(options);

    whereClauses.push(...Project.buildAdditionalWhereClauses(parsedOptions));

    return this.connection.any(sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE ${sql.join(whereClauses, sql` AND `)}
        ORDER BY last_modified DESC;
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
  ): Promise<Required<ProjectModel> | null> {
    return this.connection.maybeOne(sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE user_id = ${userId} AND id = ${projectId};
        `);
  }

  /**
   * Build additional where clauses based on options
   * @param options {ProjectSelectOptions} options - options provided to select()
   */
  private static buildAdditionalWhereClauses(
    options: Required<ProjectSelectOptions>
  ) {
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
