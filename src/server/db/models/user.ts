import { raw, sql, SqlTokenType } from "../slonik";
import { Model } from "./model";
import { Method, validateUser } from "../../../shared/validators";
import { ProjectModel, UserModel } from "../../../shared/types";
import { Projects } from "../index";

/**
 * Class representing data access layer for the users table
 */
export class User extends Model {
  protected tableName = sql.identifier(["users"]);

  protected RETURN_COLS: SqlTokenType = raw(
    "id, display_name, email, default_project"
  );

  /**
   * Create one user in the users table
   * @param user - user to insert
   * @param defaultProject - default project to create
   */
  create(
    user: UserModel,
    defaultProject: ProjectModel = {}
  ): Promise<Readonly<Required<UserModel>[] | null>> {
    const { id = "", displayName = "", email = null } = validateUser(
      user,
      Method.CREATE
    );
    return this.connection.transaction(async (transaction) => {
      const { id: userId } = await this.connect(transaction).connection.one(sql`
        INSERT INTO users(id, display_name, email) 
          VALUES (${id}, ${displayName}, ${email})
        RETURNING ${this.RETURN_COLS};
        `);
      const { id: projectId } = await Projects.connect(transaction).create(
        userId,
        defaultProject
      );
      return this.connect(transaction).connection.one(sql`
        UPDATE users 
          SET default_project = ${projectId}
        WHERE id=${userId}
        RETURNING ${this.RETURN_COLS};
        `);
    });
  }

  /**
   * Get user
   * @param userId - id of user
   */
  selectOne(userId: string): Promise<Readonly<Required<UserModel>[] | null>> {
    return this.connection.maybeOne(sql`
        SELECT ${this.RETURN_COLS} FROM users
        WHERE id=${userId}
        `);
  }
}
