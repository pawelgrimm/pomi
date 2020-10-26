import { DatabaseSessionModel } from "../../../shared/models";

const bindSessionQueries = (query) => {
  return {
    create: (session: DatabaseSessionModel) => {
      const { start_timestamp, duration, description, retro_added } = session;
      return query(
        `
        INSERT INTO sessions(start_timestamp, duration, description, retro_added) 
            VALUES ($1 , $2, $3, $4) 
        RETURNING id;`,
        [start_timestamp, duration, description, retro_added]
      ).then((res) => res.rows[0]);
    },
    // TODO: take time zone as a param
    selectAll: () =>
      query(`
        SELECT  id,
                start_timestamp,
                extract('epoch' from duration) * 1000.0   duration,
                description
        FROM sessions
      `).then((res) => res.rows),

    selectOneById: (id) =>
      query(
        `
        SELECT  id,
                start_timestamp,
                extract('epoch' from duration) * 1000.0   duration,
                description
        FROM sessions 
        WHERE id = $1
      `,
        [id]
      ).then((res) => res.rows[0]),
    update: (id, session: Partial<DatabaseSessionModel>) => {
      const { start_timestamp, duration, description } = session;
      query(
        `
        UPDATE sessions
        SET start_timestamp = coalesce($2, start_timestamp),
            duration = coalesce($3, duration),
            description = coalesce($4, description),
            edited = TRUE
        WHERE id = $1;
      `,
        [id, start_timestamp, duration, description]
      ).then(() => true);
    },
  };
};

export { bindSessionQueries };
