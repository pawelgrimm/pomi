import { DatabaseConnection, DatabasePoolType } from "../slonik";

type ConstructableThis<T> = { new (...args: any[]): T };

/**
 * Abstract class representing data access layer for a database table
 */
export abstract class Model {
  /**
   * Instantiate a new Model
   * @param connection a slonik database connection type
   */
  constructor(protected connection: DatabaseConnection) {}

  /**
   * Create a new connection
   * @param pool the pool to connect to
   */
  static newConnection<T extends Model = Model>(
    this: ConstructableThis<T>,
    pool: DatabasePoolType
  ): T {
    return new this(pool);
  }

  /**
   * Return an instance of the model using a connection/transaction instead of a pool
   * @param connection the connection to use
   */
  connect<T extends Model = Model>(this: T, connection: DatabaseConnection): T {
    return new (Object.getPrototypeOf(this).constructor)(connection);
  }
}
