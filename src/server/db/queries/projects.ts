import { ProjectModel } from "../../../shared/models";
import { PGQuery } from "../index";

const RETURN_COLS = 'id, title, is_archived AS "isArchived"';

const bindProjectQueries = (query: PGQuery) => {
  return {
    create: async (
      userId: string,
      project: ProjectModel
    ): Promise<ProjectModel> => {
      const { title, isArchived } = project;
      const res = await query(
        `
        INSERT INTO projects(user_id, title, is_archived) 
          VALUES ($1, $2)
        RETURNING ${RETURN_COLS};`,
        [userId, title, isArchived]
      );
      return res.rows[0];
    },
    selectAll: async (
      userId: string,
      options?: { sync_token?: string; include_archived?: boolean }
    ): Promise<ProjectModel[]> => {
      const res = await query(
        `
        SELECT ${RETURN_COLS} FROM projects
        WHERE user_id = $1;
        `,
        [userId]
      );
      return res.rows;
    },
    selectOneById: async (
      userId: string,
      id: string
    ): Promise<ProjectModel | undefined> => {
      const res = await query(
        `
        SELECT ${RETURN_COLS} FROM projects
        WHERE user_id = $1 AND id = $2`,
        [userId, id]
      );
      return res.rows[0];
    },
  };
};

export { bindProjectQueries };
