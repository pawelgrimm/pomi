import { sql, raw, SqlTokenType } from "../slonik";
import { Model } from "./model";
import { validateUser } from "../../../shared/validators";
import { UserModel } from "../../../shared/types";

/**
 * Class representing data access layer for the users table
 */
export class User extends Model<UserModel> {
  protected tableName = sql.identifier(["tasks"]);

  protected RETURN_COLS: SqlTokenType = raw(
    "id, display_name, email, default_project"
  );

  /**
   * Create one user in the users table
   * @param user - user to insert
   */
  create(user: UserModel): Promise<Required<UserModel>> {
    const { id = "", displayName = "", email = null } = validateUser(user);
    return this.connection.one(sql`
        INSERT INTO users(id, display_name, email) 
          VALUES (${id}, ${displayName}, ${email})
        RETURNING ${this.RETURN_COLS};
        `);
  }

  /**
   * Get user
   * @param userId - id of user
   */
  select(userId: string): Promise<Readonly<Required<UserModel>[] | null>> {
    return this.connection.maybeOne(sql`
        SELECT ${this.RETURN_COLS} FROM users
        WHERE id=${userId}
        `);
  }
}
