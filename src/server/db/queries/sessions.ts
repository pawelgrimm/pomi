import { DatabaseSessionModel } from "../../../shared/models";
import { PGQuery } from "../index";
import { getDurationWithUnits } from "../../../shared/utils";

const RETURN_COLS = `
  id, 
  user_id, 
  task_id, 
  start_timestamp, 
  extract('epoch' from duration) * 1000.0   duration, 
  notes, 
  type, 
  retro_added`;

const bindSessionQueries = (query: PGQuery) => {
  return {
    create: (session: DatabaseSessionModel) => {
      const {
        user_id,
        task_id,
        start_timestamp,
        duration,
        notes,
        type,
        retro_added,
      } = session;
      return query(
        `
            INSERT INTO sessions(user_id,
                                 task_id,
                                 start_timestamp,
                                 duration,
                                 notes,
                                 type,
                                 retro_added)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
            `,
        [
          user_id,
          task_id,
          start_timestamp,
          getDurationWithUnits(duration),
          notes,
          type,
          retro_added,
        ]
      ).then((res) => res.rows[0]);
    },

    // TODO: take time zone as a param
    selectAll: () =>
      query(
        `
            SELECT ${RETURN_COLS}
            FROM sessions;
            `
      ).then((res) => res.rows),

    selectAllToday: () =>
      query(
        `
            SELECT ${RETURN_COLS}
            FROM sessions
            WHERE start_timestamp > current_date;
            `
      ).then((res) => res.rows),

    selectOneById: (id: string) =>
      query(
        `
            SELECT ${RETURN_COLS}
            FROM sessions
            WHERE id = $1;
            `,
        [id]
      ).then((res) => res.rows[0]),

    update: (id: string, session: Partial<DatabaseSessionModel>) => {
      const {
        user_id,
        task_id,
        start_timestamp,
        duration,
        notes,
        type,
        retro_added,
      } = session;
      return query(
        `
            UPDATE sessions
            SET user_id         = coalesce($1, user_id),
                task_id         = coalesce($2, task_id),
                start_timestamp = coalesce($3, start_timestamp),
                duration        = coalesce($4, duration),
                notes           = coalesce($5, notes),
                type            = coalesce($6, type),
                retro_added     = coalesce($7, retro_added)
            WHERE id = $8;
            `,
        [
          user_id,
          task_id,
          start_timestamp,
          duration,
          notes,
          type,
          retro_added,
          id,
        ]
      ).then(() => true);
    },
  };
};

export { bindSessionQueries };
