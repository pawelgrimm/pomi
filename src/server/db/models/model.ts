import { DatabasePoolConnectionType, DatabasePoolType } from "slonik";

/**
 * Abstract class representing data access layer for a database table
 */
export abstract class Model {
  constructor(protected pool: DatabasePoolType | DatabasePoolConnectionType) {}

  /**
   * Return an instance of the model using a connection instead of a pool
   * @param connection the connection to use
   */
  connect(connection: DatabasePoolConnectionType) {
    const prototype = Object.getPrototypeOf(this);
    return new prototype.constructor(connection);
  }
}
