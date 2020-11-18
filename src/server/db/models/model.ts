import { IdentifierSqlTokenType, SqlTokenType } from "slonik/dist/types";
import { DatabaseConnection, DatabasePoolType, sql } from "../slonik";
import { Model as ModelType, SyncOptions } from "../../../shared/types";

type ConstructableThis<T> = { new (...args: any[]): T };

/**
 * Abstract class representing data access layer for a database table
 */
export abstract class Model {
  protected abstract RETURN_COLS: SqlTokenType;
  protected abstract tableName: IdentifierSqlTokenType;

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

/**
 * Apply mixins to a class
 * @example
 * // Base is the super-super-class we want to inherit from
 * abstract class MixedBase extends Base<String> {}
 * // Take advantage of TypeScript's declaration merging
 * // Note: Updateable and Selectable are abstract classes that also extend Base<String>
 * interface MixedBase
 *  extends Updateable<String>,
 *    Selectable<String, Number> {}
 * // Actually apply the mixins to the MixedBase class
 * applyMixins(MixedBase, [Updateable, Selectable]);
 *
 * // this class implements all the abstract methods required by the base and its mixins
 * export class ActualClass extends MixedBase {...}
 *
 * @param derivedCtor - base class to extend
 * @param constructors - array of mixins to apply
 */
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseCtor.prototype,
        name
      );
      if (!descriptor) return;
      Object.defineProperty(derivedCtor.prototype, name, descriptor);
    });
  });
}

export abstract class ModelWithSelect<
  MT extends ModelType = ModelType
> extends Model {
  /**
   * Get a single object for a user
   * @param userId - id of object-owning user
   * @param objectId - id of object to query
   */
  selectOne(userId: string, objectId: string): Promise<Required<MT> | null> {
    // noinspection SqlResolve
    return this.connection.maybeOne(sql`
        SELECT ${this.RETURN_COLS} FROM ${this.tableName}
        WHERE user_id = ${userId} AND id = ${objectId};
        `);
  }
}

export abstract class ModelWithSelectMultiple<
  MT extends ModelType = ModelType,
  SO extends SyncOptions = SyncOptions
> extends ModelWithSelect<MT> {
  protected abstract validateModelOptionsForSelect: (options: any) => SO;
  protected abstract buildAdditionalWhereClauses(options: SO): SqlTokenType[];

  /**
   * Get multiple objects for a user
   * @param userId - id of object-owning user
   * @param options - additional options used to customize query
   */
  select(userId: string, options?: SO): Promise<Readonly<Required<MT>[]>> {
    const whereClauses: SqlTokenType[] = [sql`user_id = ${userId}`];

    const parsedOptions = this.validateModelOptionsForSelect(options);

    whereClauses.push(...this.buildAdditionalWhereClauses(parsedOptions));

    // noinspection SqlResolve
    return this.connection.any(sql`
        SELECT ${this.RETURN_COLS} FROM ${this.tableName}
        WHERE ${sql.join(whereClauses, sql` AND `)}
        ORDER BY last_modified DESC;
        `);
  }
}

export abstract class ModelWithUpdate<
  MT extends ModelType = ModelType
> extends Model {
  protected abstract validateModelForUpdate: (object: any) => MT;
  protected abstract buildUpdateSets(object: Partial<MT>): SqlTokenType[];

  /**
   * Update an object
   * @param userId - id of object-owning user
   * @param objectId - id of object to query
   * @param updates - object updates
   */
  async update(
    userId: string,
    objectId: string,
    updates: any
  ): Promise<Required<MT> | null> {
    const updateSets = this.buildUpdateSets(
      this.validateModelForUpdate(updates)
    );
    if (updateSets.length < 1) {
      return null;
    }
    // noinspection SqlResolve
    return this.connection.one(
      sql`
        UPDATE ${this.tableName}
        SET ${sql.join(updateSets, sql`, `)}
        WHERE id = ${objectId} AND user_id = ${userId}
        RETURNING ${this.RETURN_COLS};
        `
    );
  }
}
