import { snakeCase } from "lodash";
import { raw, sql, SqlTokenType } from "../slonik";
import { Model } from "./model";
import {
  validateSession,
  validateSessionSelectOptions,
} from "../../../shared/validators";
import { SessionModel, SessionSelectOptions } from "../../../shared/types";

import { sqlDate, sqlDuration } from "../../../shared/utils";
import { Method } from "../../../shared/validators/shared";

const RETURN_COLS = raw(`
  id, 
  task_id, 
  start_timestamp, 
  extract('epoch' from duration) * 1000.0   duration, 
  notes, 
  type, 
  is_retro_added`);

type Boolified<T> = { [P in keyof T | string]: boolean };
const UPDATEABLE_COLUMNS: Boolified<Partial<SessionModel>> = {
  taskId: true,
  startTimestamp: true,
  duration: true,
  notes: true,
  type: true,
};

/**
 * Class representing data access layer for the sessions table
 */
export class Session extends Model {
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
        RETURNING ${RETURN_COLS};
   `);
  }

  /**
   * Get multiple sessions for a user
   * @param userId - id of session-owning user
   * @param {SessionSelectOptions} options - additional options used to customize query
   */
  async select(
    userId: string,
    options?: SessionSelectOptions
  ): Promise<Readonly<Required<SessionModel>[]>> {
    const whereClauses: SqlTokenType[] = [sql`user_id = ${userId}`];

    const parsedOptions = validateSessionSelectOptions(options);

    whereClauses.push(...Session.buildAdditionalWhereClauses(parsedOptions));

    return this.connection.any(sql`
        SELECT ${RETURN_COLS} FROM sessions
        WHERE ${sql.join(whereClauses, sql` AND `)}
        ORDER BY last_modified DESC;
        `);
  }

  // /**
  //  * TODO: Write tests
  //  * Get today's sessions for a user
  //  * @param userId - id of session-owning user
  //  * TODO: Accommodate timezone
  //  */
  // async selectAllToday(
  //   userId: string
  // ): Promise<Readonly<Required<SessionModel>[]>> {
  //   return this.connection.any(sql`
  //       SELECT ${RETURN_COLS} FROM sessions
  //       WHERE user_id = ${userId} AND start_timestamp > current_date;`);
  // }

  /**
   * Get a session for a user
   * @param userId - id of session-owning user
   * @param sessionId - id of session to query
   */
  async selectOne(
    userId: string,
    sessionId: string
  ): Promise<Required<SessionModel> | null> {
    return this.connection.maybeOne(sql`
        SELECT ${RETURN_COLS} FROM sessions
        WHERE user_id = ${userId} AND id = ${sessionId};
        `);
  }

  /**
   * Update a session
   * @param userId - id of session-owning user
   * @param sessionId - id of session to query
   * @param session - session object
   */
  async update(
    userId: string,
    sessionId: string,
    session: any
  ): Promise<Required<SessionModel> | null> {
    const updateSets = Session.buildUpdateSets(
      validateSession(session, Method.PARTIAL)
    );
    if (updateSets.length < 1) {
      return null;
    }
    return this.connection.one(
      sql`
        UPDATE sessions
        SET ${sql.join(updateSets, sql`, `)}
        WHERE id = ${sessionId} AND user_id = ${userId}
        RETURNING ${RETURN_COLS};
        `
    );
  }

  /**
   * Build additional where clauses based on options
   * @param options {SessionSelectOptions} options - options provided to select()
   */
  private static buildAdditionalWhereClauses(options: SessionSelectOptions) {
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

  private static buildUpdateSets(session: Partial<SessionModel>) {
    const setClauses: SqlTokenType[] = [];
    Object.entries(session).forEach(([key, value]) => {
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
}
