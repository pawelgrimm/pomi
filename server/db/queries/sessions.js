const bindQueries = (query) => {
  return {
    create: ({
      start_timestamp,
      duration,
      description = "",
      retro_added = false,
    }) =>
      query(
        "INSERT INTO sessions(start_timestamp, duration, description, retro_added) VALUES (to_timestamp($1 / 1000.0) , $2, $3, $4) RETURNING id",
        [start_timestamp, `${duration} milliseconds`, description, retro_added]
      )
        .then((res) => res.rows)
        .then((rows) => rows.length > 0 && rows[0]),

    getAll: () =>
      query(
        "SELECT to_char(start_timestamp AT TIME ZONE 'America/New_York', 'MM/DD/YY')      date,\n" +
          "       to_char(start_timestamp AT TIME ZONE 'America/New_York', 'HH24MI')     start_time,\n" +
          "       extract('epoch' from duration) * 1000.0                                 duration,\n" +
          "       description,\n" +
          "       id\n" +
          "FROM sessions"
      ).then((res) => res.rows),

    getById: (id) =>
      query(
        "SELECT to_char(start_timestamp AT TIME ZONE 'America/New_York', 'MM/DD/YY')      date,\n" +
          "       to_char(start_timestamp AT TIME ZONE 'America/New_York', 'HH24MI')     start_time,\n" +
          "       extract('epoch' from duration) * 1000.0                                 duration,\n" +
          "       description,\n" +
          "       id\n" +
          "FROM sessions WHERE id = $1",
        [id]
      ).then((res) => res.rows),
  };
};

module.exports = bindQueries;
