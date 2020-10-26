import { UserModel } from "../../../shared/models";
import { PGQuery } from "../index";

const bindUserQueries = (query: PGQuery) => {
  return {
    create: ({ username, email }: UserModel) =>
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

    selectOneById: (id: string) =>
      query(
        `
        SELECT id, username, email FROM users 
        WHERE id = $1`,
        [id]
      ).then((res) => res.rows[0]),
  };
};

export { bindUserQueries };
