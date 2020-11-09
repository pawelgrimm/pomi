import { DatabasePoolType, sql } from "slonik";
import { SqlTokenType } from "slonik/dist/types";
import { raw } from "slonik-sql-tag-raw";
import { Model } from "./model";
import {
  ClientSessionModel as SessionModel,
  DatabaseSessionModel,
  SessionSelectOptions,
} from "../../../shared/types";
import { validateClientSession } from "../../../shared/validators";
import {
  getDurationWithUnits,
  parseSelectAllOptions,
} from "../../../shared/utils/sessions";

const RETURN_COLS = raw(`
  id, 
  task_id, 
  start_timestamp, 
  extract('epoch' from duration) * 1000.0   duration, 
  notes, 
  type, 
  is_retro_added`);

type Boolified<T> = { [P in keyof T | string]: boolean };
const UPDATEABLE_COLUMNS: Boolified<Partial<DatabaseSessionModel>> = {
  task_id: true,
  start_timestamp: true,
  duration: true,
  notes: true,
  type: true,
  is_retro_added: true,
};

/**
 * Class representing data access layer for the sessions table
 */
export class Session implements Model {
  constructor(private pool: DatabasePoolType) {}

  /**
   * Create one session in the sessions table
   * @param userId - id of user assigned to object
   * @param session - session to insert
   */
  async create(userId: string, session: SessionModel): Promise<SessionModel> {
    const {
      user_id,
      task_id = null,
      start_timestamp,
      duration,
      notes = "",
      type,
      is_retro_added = false,
    } = validateClientSession(session);
    return this.pool.one(sql`
        INSERT INTO sessions(user_id, task_id, start_timestamp, duration, notes, type, is_retro_added)
        VALUES (${user_id}, 
                COALESCE(${task_id}, (SELECT default_task FROM users WHERE id = ${userId})), 
                ${start_timestamp.toISOString()}, 
                ${getDurationWithUnits(duration)},
                ${notes},
                ${type},
                ${is_retro_added})
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
  ): Promise<Readonly<SessionModel[]>> {
    const whereClauses: SqlTokenType[] = [sql`user_id = ${userId}`];

    const parsedOptions = parseSelectAllOptions(options);

    whereClauses.push(...Session.buildAdditionalWhereClauses(parsedOptions));

    return this.pool.any(sql`
        SELECT ${RETURN_COLS} FROM sessions
        WHERE ${sql.join(whereClauses, sql` AND `)};
        `);
  }

  /**
   * Get today's sessions for a user
   * @param userId - id of session-owning user
   * TODO: Accommodate timezone
   */
  async selectAllToday(userId: string) {
    return this.pool.any(sql`
        SELECT ${RETURN_COLS} FROM sessions
        WHERE user_id = ${userId} AND start_timestamp > current_date;`);
  }

  /**
   * Get a session for a user
   * @param userId - id of session-owning user
   * @param sessionId - id of session to query
   */
  async selectOne(
    userId: string,
    sessionId: string
  ): Promise<SessionModel | null> {
    return this.pool.maybeOne(sql`
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
    session: Partial<DatabaseSessionModel>
  ): Promise<boolean> {
    const updateSets = Session.buildUpdateSets(session);
    if (updateSets.length < 1) {
      return false;
    }
    return this.pool
      .query(
        sql`
      UPDATE sessions
      SET ${sql.join(updateSets, sql`, `)}
      WHERE id = ${sessionId} AND user_id = ${userId}`
      )
      .then(() => true);
  }

  /**
   * Build additional where clauses based on options
   * @param options {SessionSelectOptions} options - options provided to select()
   */
  private static buildAdditionalWhereClauses(
    options: Required<SessionSelectOptions>
  ) {
    const { syncToken } = options;
    const whereClauses: SqlTokenType[] = [];
    if (syncToken !== "*") {
      whereClauses.push(sql`last_modified >= ${syncToken}`);
    }
    return whereClauses;
  }

  private static buildUpdateSets(session: Partial<DatabaseSessionModel>) {
    const setClauses: SqlTokenType[] = [];
    Object.entries(session).forEach(([key, value]) => {
      if (UPDATEABLE_COLUMNS[key] && value != null) {
        const newValue = value instanceof Date ? value.toISOString() : value;
        setClauses.push(sql`${sql.identifier([key])} = ${newValue}}`);
      }
    });
    return setClauses;
  }
}
