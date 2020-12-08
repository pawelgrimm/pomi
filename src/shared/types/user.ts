/**
 * A row in the users table
 */
interface UserModel {
  id: string;
  displayName: string;
  email: string;
  defaultProject?: string;
}

export type { UserModel };
