const bindSessionQueries = (query) => {
  return {
    create: ({ start_timestamp, duration, description, retro_added }) =>
      query(
        `
        INSERT INTO sessions(start_timestamp, duration, description, retro_added) 
            VALUES (to_timestamp($1) , $2, $3, $4) 
        RETURNING id`,
        [start_timestamp, `${duration} seconds`, description, retro_added]
      )
        .then((res) => res.rows)
        .then((rows) => rows.length > 0 && rows[0]),
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
    update: (id, { start_timestamp, duration, description }) => {
      query(
        `
        UPDATE sessions
        SET start_timestamp = coalesce(to_timestamp($2), start_timestamp),
            duration = coalesce($3, duration),
            description = coalesce($4, description),
            edited = TRUE
        WHERE id = $1;
      `,
        [id, start_timestamp, `${duration} seconds`, description]
      ).then(() => true);
    },
  };
};

export { bindSessionQueries };
