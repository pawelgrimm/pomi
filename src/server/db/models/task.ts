import { sql, raw, SqlTokenType } from "../slonik";
import {
  applyMixins,
  Model,
  ModelWithSelect,
  ModelWithSelectMultiple,
} from "./model";
import { TaskModel, TaskOptions } from "../../../shared/types";
import { validateTask, validateTaskOptions } from "../../../shared/validators";

// Set up mix-ins
abstract class TaskBase extends Model {}
interface TaskBase
  extends ModelWithSelect<TaskModel>,
    ModelWithSelectMultiple<TaskModel, TaskOptions> {}
applyMixins(TaskBase, [ModelWithSelect, ModelWithSelectMultiple]);

/**
 * Class representing data access layer for the tasks table
 */
export class Task extends TaskBase {
  protected tableName = sql.identifier(["tasks"]);

  protected RETURN_COLS: SqlTokenType = raw(
    "id, title, project_id, is_completed, last_modified"
  );

  protected validateModelOptionsForSelect = (options: any) =>
    validateTaskOptions(options);

  /**
   * Create one task in the tasks table
   * @param userId - id of user assigned to object
   * @param task - task to insert
   */
  create(userId: string, task: TaskModel): Promise<Required<TaskModel>> {
    const { title = "", projectId = null, isCompleted = false } = validateTask(
      task
    );
    return this.connection.one(sql`
        INSERT INTO tasks(user_id, project_id, title, is_completed)
        VALUES (${userId}, 
                COALESCE(${projectId}, (SELECT default_project FROM users WHERE id = ${userId})), 
                ${title}, 
                ${isCompleted})
        RETURNING ${this.RETURN_COLS};
    `);
  }

  /**
   * Get multiple tasks for a user
   * @param userId - id of task-owning user
   * @param {TaskOptions} options - additional options used to customize query
   */
  select(
    userId: string,
    options: TaskOptions = {}
  ): Promise<Readonly<Required<TaskModel>[]>> {
    return super.select(userId, options);
  }

  /**
   * Get a task for a user
   * @param userId - id of task-owning user
   * @param taskId - id of task to query
   */
  selectOne(userId: string, taskId: string) {
    return super.selectOne(userId, taskId);
  }

  /**
   * Set a task's completed flag
   * @param userId - id of task-owning user
   * @param taskId - id of task to update
   */
  complete(userId: string, taskId: string): Promise<boolean> {
    throw new Error("Not yet implemented");
  }

  /**
   * Build additional where clauses based on options
   * @param options {TaskOptions} options - options provided to select()
   */
  protected buildAdditionalWhereClauses(options: TaskOptions) {
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
