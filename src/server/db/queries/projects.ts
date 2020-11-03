import { isValid, parseISO } from "date-fns";
import { ProjectModel } from "../../../shared/models";
import { DatabasePoolType, InvalidInputError, sql } from "slonik";
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
      options?: Partial<SelectAllOptions>
    ): Promise<Readonly<ProjectModel[]>> => {
      const whereClauses = [sql`user_id = ${userId}`];
      whereClauses.push(...buildAdditionalWhereClauses(options));

      const query = sql`
        SELECT ${RETURN_COLS} FROM projects
        WHERE ${sql.join(whereClauses, sql` AND `)};
        `;

      return pool.any(query);
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

type SelectAllOptions = {
  syncToken?: string;
  includeArchived?: boolean;
};

const parseSelectAllOptions = (
  options?: SelectAllOptions
): Required<SelectAllOptions> => {
  if (options?.syncToken && !isValid(parseISO(options.syncToken))) {
    throw new InvalidInputError(
      '"syncToken" was supplied in options, but could not be parsed'
    );
  }
  return {
    syncToken: options?.syncToken || "*",
    includeArchived: options?.includeArchived || false,
  };
};

const buildAdditionalWhereClauses = (options?: SelectAllOptions) => {
  const { includeArchived, syncToken } = parseSelectAllOptions(options);
  const whereClauses = [];
  if (syncToken !== "*") {
    whereClauses.push(sql`last_modified >= ${syncToken}`);
  } else if (!includeArchived) {
    whereClauses.push(sql`is_archived = FALSE`);
  }
  return whereClauses;
};
