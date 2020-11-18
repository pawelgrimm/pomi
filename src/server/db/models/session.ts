import { snakeCase } from "lodash";
import { raw, sql, SqlTokenType } from "../slonik";
import {
  applyMixins,
  Model,
  ModelWithSelectMultiple,
  ModelWithUpdate,
} from "./model";
import {
  validateSession,
  validateSessionOptions,
} from "../../../shared/validators";
import { SessionModel, SessionOptions } from "../../../shared/types";
import { sqlDate, sqlDuration } from "../../../shared/utils";
import { Method } from "../../../shared/validators/shared";

type Boolified<T> = { [P in keyof T | string]: boolean };
const UPDATEABLE_COLUMNS: Boolified<Partial<SessionModel>> = {
  taskId: true,
  startTimestamp: true,
  duration: true,
  notes: true,
  type: true,
};

// Set up mix-ins
abstract class SessionBase extends Model {}
interface SessionBase
  extends ModelWithUpdate<SessionModel>,
    ModelWithSelectMultiple<SessionModel, SessionOptions> {}
applyMixins(SessionBase, [ModelWithUpdate, ModelWithSelectMultiple]);

/**
 * Class representing data access layer for the sessions table
 */
export class Session extends SessionBase {
  protected tableName = sql.identifier(["sessions"]);

  protected RETURN_COLS: SqlTokenType = raw(
    `id,
      task_id,
      start_timestamp,
      extract('epoch' from duration) * 1000.0   duration,
      notes,
      type,
      is_retro_added,
      last_modified`
  );

  protected validateModelForUpdate = (object: any) =>
    validateSession(object, Method.PARTIAL);

  protected validateModelOptionsForSelect = (options: any) =>
    validateSessionOptions(options);

  /**
   * Create one session in the sessions table
   * @param userId - id of user assigned to object
   * @param session - session to insert
   */
  create(
    userId: string,
    session: SessionModel
  ): Promise<Required<SessionModel>> {
    const {
      taskId,
      startTimestamp,
      duration,
      notes = "",
      type,
      isRetroAdded = false,
    } = validateSession(session);
    return this.connection.one(sql`
        INSERT INTO sessions(user_id, task_id, start_timestamp, duration, notes, type, is_retro_added)
        VALUES (${userId},
                COALESCE(${taskId}, (SELECT default_task FROM users WHERE id = ${userId})),
                ${sqlDate(startTimestamp)},
                ${sqlDuration(duration)},
                ${notes},
                ${type},
                ${isRetroAdded})
        RETURNING ${this.RETURN_COLS};
   `);
  }

  /**
   * Get a session for a user
   * @param userId - id of session-owning user
   * @param sessionId - id of session to query
   */
  selectOne(
    userId: string,
    sessionId: string
  ): Promise<Required<SessionModel> | null> {
    return super.selectOne(userId, sessionId);
  }

  /**
   * Get multiple sessions for a user
   * @param userId - id of session-owning user
   * @param {SessionOptions} options - additional options used to customize query
   */
  select(userId: string, options: SessionOptions = {}) {
    return super.select(userId, options);
  }

  /**
   * Build additional where clauses based on options
   * @param options options - options provided to select()
   */
  protected buildAdditionalWhereClauses(options: SessionOptions) {
    const { syncToken, start, end } = options;
    const whereClauses: SqlTokenType[] = [];
    if (syncToken) {
      if (syncToken !== "*") {
        whereClauses.push(sql`last_modified >= ${syncToken}`);
      }
    } else {
      if (start) whereClauses.push(sql`start_timestamp >= ${sqlDate(start)}`);
      if (end) whereClauses.push(sql`start_timestamp < ${sqlDate(end)}`);
    }
    return whereClauses;
  }

  /**
   * Update a session
   * @param userId - id of session-owning user
   * @param sessionId - id of session to query
   * @param updates - session properties to update
   */
  update(userId: string, sessionId: string, updates: any) {
    return super.update(userId, sessionId, updates);
  }

  /**
   * Create SET statements for update based on passed in session
   * @param updates - session properties to update
   * @protected
   */
  protected buildUpdateSets(updates: Partial<SessionModel>) {
    const setClauses: SqlTokenType[] = [];
    Object.entries(updates).forEach(([key, value]) => {
      if (UPDATEABLE_COLUMNS[key] && value != null) {
        let valueToUse: any = value;
        switch (key) {
          case "startTimestamp":
            valueToUse = sqlDate(value as Date);
            break;
          case "duration":
            valueToUse = sqlDuration(value as number);
            break;
          default:
            break;
        }
        setClauses.push(
          sql`${sql.identifier([snakeCase(key)])} = ${valueToUse}`
        );
      }
    });
    return setClauses;
  }

  /**
   * TODO: Write tests, accommodate timezone
   * Get today's sessions for a user
   * @param userId - id of session-owning user
   */
  selectAllToday(userId: string): Promise<Readonly<Required<SessionModel>[]>> {
    throw new Error("Not yet implemented");
    // return this.connection.any(sql`
    //     SELECT ${Session.RETURN_COLS} FROM sessions
    //     WHERE user_id = ${userId} AND start_timestamp > current_date;`);
  }
}
