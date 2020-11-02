import { ProjectModel } from "../../../shared/models";
import { DatabasePoolType, sql } from "slonik";
import { raw } from "slonik-sql-tag-raw";

const RETURN_COLS = raw("id, title, is_archived");

const bindProjectQueries = (pool: DatabasePoolType) => {
  return {
    create: async (
      userId: string,
      project: ProjectModel
    ): Promise<ProjectModel> => {
      const { title = null, isArchived = null } = project;
      return pool.one(sql`
        INSERT INTO projects(user_id, title, is_archived)
        VALUES (${userId}, ${title}, ${isArchived})
        RETURNING ${RETURN_COLS};
      `);
    },
    selectAll: async (
      userId: string,
      options?: { sync_token?: string; include_archived?: boolean }
    ): Promise<Readonly<ProjectModel[]>> => {
      return pool.any(
        sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE user_id = $1;
        `,
        [userId]
      );
    },
    selectOneById: async (
      userId: string,
      id: string
    ): Promise<ProjectModel | null> => {
      return pool.maybeOne(
        sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE user_id = $1 AND id = $2`,
        [userId, id]
      );
    },
  };
};

export { bindProjectQueries };
