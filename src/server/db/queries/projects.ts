import { ProjectModel } from "../../../shared/models";
import { PGQuery } from "../index";

const RETURN_COLS = "id, title";

const bindProjectQueries = (query: PGQuery) => {
  return {
    create: (project: ProjectModel) => {
      const { user_id, title } = project;
      return query(
        `
        INSERT INTO projects(user_id, title) 
          VALUES ($1, $2)
        RETURNING id;`,
        [user_id, title]
      ).then((res) => res.rows[0]);
    },

    selectAllByUser: (user_id: string) =>
      query(
        `
        SELECT id, title FROM projects
        WHERE user_id = $1;
        `,
        [user_id]
      ).then((res) => res.rows),

    selectOneById: (user_id: string, id: number) =>
      query(
        `
        SELECT ${RETURN_COLS} FROM projects
        WHERE user_id = $1 AND id = $2`,
        [user_id, id]
      ).then((res) => res.rows[0]),
  };
};

export { bindProjectQueries };
