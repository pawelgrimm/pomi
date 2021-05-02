/**
 * A row in the users table
 */
export interface UserModel {
  id?: string;
  firebaseId?: string;
  displayName: string;
  email: string;
  defaultProject?: string;
}
