import { UserModel } from "../../../shared/types";
import { DatabasePoolType, sql } from "slonik";

const bindUserQueries = (pool: DatabasePoolType) => {
  // @ts-ignore
  return {
    create: ({ id, display_name, email }: UserModel) =>
      pool.one(
        sql`
        INSERT INTO users(id, display_name, email) 
          VALUES ($1, $2, $3)
        RETURNING id;`,
        [id, display_name, email]
      ),

    selectAll: () =>
      pool.any(sql`
        SELECT id, display_name, email FROM users;`),

    selectOneById: (id: string) =>
      pool.maybeOne(
        sql`
        SELECT id, display_name, email FROM users 
        WHERE id = $1`,
        [id]
      ),
  };
};

export { bindUserQueries };
