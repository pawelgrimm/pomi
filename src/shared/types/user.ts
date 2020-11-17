/**
 * A row in the users table
 */
interface UserModel {
  id: string;
  display_name: string;
  email: string;
  default_project?: string;
}

export type { UserModel };
