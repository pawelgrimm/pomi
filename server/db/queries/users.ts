import { UserParams } from "../../../shared/models";

const bindUserQueries = (query) => {
  return {
    create: ({ username, email }: UserParams) =>
      query(
        `
        INSERT INTO users(username, email) 
          VALUES ($1, $2)
        RETURNING id;`,
        [username, email]
      ).then((res) => res.rows[0]),

    selectAll: () =>
      query(
        `
        SELECT id, username, email FROM users;`
      ).then((res) => res.rows),

    selectOneById: (id) =>
      query(
        `
        SELECT id, username, email FROM users 
        WHERE id = $1`,
        [id]
      ).then((res) => res.rows[0]),
  };
};

export { bindUserQueries };
