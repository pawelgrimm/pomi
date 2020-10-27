import { DatabaseSessionModel } from "../../../shared/models";
import { PGQuery } from "../index";

const bindSessionQueries = (query: PGQuery) => {
  return {
    create: (session: DatabaseSessionModel) => {
      const {
        start_timestamp,
        duration,
        project,
        task,
        notes,
        retro_added,
      } = session;
      return query(
        `
        INSERT INTO sessions(start_timestamp, duration, project, task, notes, retro_added) 
            VALUES ($1 , $2, $3, $4, $5, $6) 
        RETURNING id;`,
        [
          start_timestamp,
          duration && `${duration} milliseconds`,
          project,
          task,
          notes,
          retro_added,
        ]
      ).then((res) => res.rows[0]);
    },

    // TODO: take time zone as a param
    selectAll: () =>
      query(`
        SELECT  id,
                start_timestamp,
                extract('epoch' from duration) * 1000.0   duration,
                project, 
                task, 
                notes
        FROM sessions
      `).then((res) => res.rows),
    selectAllToday: () =>
      query(`
        SELECT  id,
                start_timestamp,
                extract('epoch' from duration) * 1000.0   duration,
                project,
                task,
                notes
        FROM sessions
        WHERE start_timestamp > current_date;
      `).then((res) => res.rows),
    selectOneById: (id: string) =>
      query(
        `
        SELECT  id,
                start_timestamp,
                extract('epoch' from duration) * 1000.0   duration,
                project,
                task,
                notes
        FROM sessions 
        WHERE id = $1
      `,
        [id]
      ).then((res) => res.rows[0]),
    update: (id: string, session: Partial<DatabaseSessionModel>) => {
      const { start_timestamp, duration, project, task, notes } = session;
      query(
        `
        UPDATE sessions
        SET start_timestamp = coalesce($2, start_timestamp),
            duration = coalesce($3, duration),
            project = coalesce($4, project),
            task = coalesce($5, task),
            notes = coalesce($6, notes),
            edited = TRUE
        WHERE id = $1;
      `,
        [id, start_timestamp, duration, project, task, notes]
      ).then(() => true);
    },
  };
};

export { bindSessionQueries };
