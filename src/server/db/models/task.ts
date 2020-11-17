import { sql, raw } from "../slonik";
import { Model } from "./model";
import { validateTask } from "../../../shared/validators";
import { TaskModel, TaskSelectOptions } from "../../../shared/types";
import { parseSelectAllOptions } from "../../../shared/utils/tasks";

/**
 * Class representing data access layer for the tasks table
 */
export class Task extends Model {
  static RETURN_COLS = raw(
    "id, title, project_id, is_completed, last_modified"
  );

  /**
   * Create one task in the tasks table
   * @param userId - id of user assigned to object
   * @param task - task to insert
   */
  async create(userId: string, task: TaskModel): Promise<Required<TaskModel>> {
    const { title = "", projectId = null, isCompleted = false } = validateTask(
      task
    );
    return this.connection.one(sql`
        INSERT INTO tasks(user_id, project_id, title, is_completed)
        VALUES (${userId}, 
                COALESCE(${projectId}, (SELECT default_project FROM users WHERE id = ${userId})), 
                ${title}, 
                ${isCompleted})
        RETURNING ${Task.RETURN_COLS};
    `);
  }

  /**
   * Get multiple tasks for a user
   * @param userId - id of task-owning user
   * @param {TaskSelectOptions} options - additional options used to customize query
   */
  async select(
    userId: string,
    options?: TaskSelectOptions
  ): Promise<Readonly<Required<TaskModel>[]>> {
    const whereClauses = [sql`user_id = ${userId}`];

    const parsedOptions = parseSelectAllOptions(options);

    whereClauses.push(...Task.buildAdditionalWhereClauses(parsedOptions));

    return this.connection.any(sql`
        SELECT ${Task.RETURN_COLS} FROM tasks
        WHERE ${sql.join(whereClauses, sql` AND `)}
        ORDER BY last_modified DESC;
        `);
  }

  /**
   * Get a task for a user
   * @param userId - id of task-owning user
   * @param taskId - id of task to query
   */
  async selectOne(
    userId: string,
    taskId: string
  ): Promise<Required<TaskModel> | null> {
    return this.connection.maybeOne(sql`
        SELECT ${Task.RETURN_COLS} FROM tasks
        WHERE user_id = ${userId} AND id = ${taskId};
        `);
  }

  /**
   * Set a task's completed flag
   * @param userId - id of task-owning user
   * @param taskId - id of task to update
   */
  async complete(userId: string, taskId: string): Promise<boolean> {
    throw new Error("Not yet implemented");
  }

  /**
   * Build additional where clauses based on options
   * @param options {TaskSelectOptions} options - options provided to select()
   */
  private static buildAdditionalWhereClauses(options: TaskSelectOptions) {
    const { includeCompleted, syncToken } = options;
    const whereClauses = [];
    if (syncToken && syncToken !== "*") {
      whereClauses.push(sql`last_modified >= ${syncToken}`);
    } else if (!includeCompleted) {
      whereClauses.push(sql`is_completed = FALSE`);
    }
    return whereClauses;
  }
}
