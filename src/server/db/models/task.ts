import { DatabasePoolType, sql } from "slonik";
import { raw } from "slonik-sql-tag-raw";
import { Model } from "./model";
import { TaskModel, TaskSelectOptions } from "../../../shared/types";
import { parseSelectAllOptions } from "../../../shared/utils/tasks";

const RETURN_COLS = raw("id, title, project_id, is_completed");

/**
 * Class representing data access layer for the tasks table
 */
export class Task implements Model {
  constructor(private pool: DatabasePoolType) {}

  /**
   * Create one task in the tasks table
   * @param userId - id of user assigned to object
   * @param task - task to insert
   */
  async create(userId: string, task: TaskModel): Promise<Required<TaskModel>> {
    const { title = "", projectId = null, isCompleted = false } = task;
    return this.pool.one(sql`
        INSERT INTO tasks(user_id, project_id, title, is_completed)
        VALUES (${userId}, 
                COALESCE(${projectId}, (SELECT default_project FROM users WHERE id = ${userId})), 
                ${title}, 
                ${isCompleted})
        RETURNING ${RETURN_COLS};
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

    return this.pool.any(sql`
        SELECT ${RETURN_COLS} FROM tasks
        WHERE ${sql.join(whereClauses, sql` AND `)};
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
    return this.pool.maybeOne(sql`
        SELECT ${RETURN_COLS} FROM tasks
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
  private static buildAdditionalWhereClauses(
    options: Required<TaskSelectOptions>
  ) {
    const { includeCompleted, syncToken } = options;
    const whereClauses = [];
    if (syncToken !== "*") {
      whereClauses.push(sql`last_modified >= ${syncToken}`);
    } else if (!includeCompleted) {
      whereClauses.push(sql`is_completed = FALSE`);
    }
    return whereClauses;
  }
}
