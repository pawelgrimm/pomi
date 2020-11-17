import { sql, raw } from "../slonik";
import { Model } from "./model";
import { validateUser } from "../../../shared/validators";
import { UserModel } from "../../../shared/types";

/**
 * Class representing data access layer for the users table
 */
export class User extends Model {
  static RETURN_COLS = raw("id, display_name, email, default_project");

  /**
   * Create one user in the users table
   * @param user - user to insert
   */
  create(user: UserModel): Promise<Required<UserModel>> {
    const { id = "", displayName = "", email = null } = validateUser(user);
    return this.connection.one(sql`
        INSERT INTO users(id, display_name, email) 
          VALUES (${id}, ${displayName}, ${email})
        RETURNING ${User.RETURN_COLS};
        `);
  }

  /**
   * Get user
   * @param userId - id of user
   */
  select(userId: string): Promise<Readonly<Required<UserModel>[] | null>> {
    return this.connection.maybeOne(sql`
        SELECT ${User.RETURN_COLS} FROM users
        WHERE id=${userId}
        `);
  }
}
