import { UserModel } from "../../../shared/models";
import { PGQuery } from "../index";

const bindUserQueries = (query: PGQuery) => {
  // @ts-ignore
  return {
    create: ({ display_name, email }: UserModel) =>
      query(
        `
        INSERT INTO users(display_name, email) 
          VALUES ($1, $2)
        RETURNING id;`,
        [display_name, email]
      ).then((res) => res.rows[0]),

    selectAll: () =>
      query(
        `
        SELECT id, display_name, email FROM users;`
      ).then((res) => res.rows),

    selectOneById: (id: string) =>
      query(
        `
        SELECT id, display_name, email FROM users 
        WHERE id = $1`,
        [id]
      ).then((res) => res.rows[0]),
  };
};

export { bindUserQueries };
