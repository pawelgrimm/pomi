import { sql, raw, SqlTokenType } from "../slonik";
import { applyMixins, Model, ModelWithSelectMultiple } from "./model";
import { ProjectModel, ProjectOptions } from "../../../shared/types";
import {
  validateProject,
  validateProjectOptions,
} from "../../../shared/validators";

// Set up mix-ins
abstract class ProjectBase extends Model<ProjectModel> {}
interface ProjectBase
  extends ModelWithSelectMultiple<ProjectModel, ProjectOptions> {}
applyMixins(ProjectBase, [ModelWithSelectMultiple]);

/**
 * Class representing the projects table.
 */
export class Project extends ProjectBase {
  protected tableName = sql.identifier(["projects"]);

  protected RETURN_COLS: SqlTokenType = raw(
    "id, title, is_archived, last_modified"
  );

  protected validateModelOptionsForSelect = (options: any) =>
    validateProjectOptions(options);

  /**
   * Create one project in the projects table
   * @param userId - id of user assigned to object
   * @param project - project to insert
   */
  create(
    userId: string,
    project: ProjectModel
  ): Promise<Required<ProjectModel>> {
    const { title = "", isArchived = false } = validateProject(project);
    // noinspection SqlResolve
    return this.connection.one(sql`
        INSERT INTO ${this.tableName}(user_id, title, is_archived)
        VALUES (${userId}, ${title}, ${isArchived})
        RETURNING ${this.RETURN_COLS};
    `);
  }

  /**
   * Get multiple projects for a user
   * @param userId - id of project-owning user
   * @param {ProjectOptions} options - additional options used to customize query
   */
  select(userId: string, options: ProjectOptions = {}) {
    return super.select(userId, options);
  }

  /**
   * Build additional where clauses based on options
   * @param options {ProjectOptions} options - options provided to select()
   */
  protected buildAdditionalWhereClauses(options: ProjectOptions) {
    const { includeArchived, syncToken } = options;
    const whereClauses = [];
    if (syncToken && syncToken !== "*") {
      whereClauses.push(sql`last_modified >= ${syncToken}`);
    } else if (!includeArchived) {
      whereClauses.push(sql`is_archived = FALSE`);
    }
    return whereClauses;
  }

  /**
   * Get a project for a user
   * @param userId - id of project-owning user
   * @param projectId - id of project to query
   */
  selectOne(userId: string, projectId: string) {
    return super.selectOne(userId, projectId);
  }
}
