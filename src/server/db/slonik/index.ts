import {
  createPool,
  DatabasePoolConnectionType,
  DatabasePoolType,
  DatabaseTransactionConnectionType,
  sql,
} from "slonik";
import { PG_CONNECTION_STRING } from "../../config";
import { createSlonikConfiguration } from "./setup";
import { raw } from "slonik-sql-tag-raw";
import { SqlTokenType } from "slonik/dist/types";

/**
 * Type representing a Slonik pool, connection, or transaction
 */
type DatabaseConnection =
  | DatabasePoolType
  | DatabasePoolConnectionType
  | DatabaseTransactionConnectionType;

/**
 * Setup a client pool connected to the application database
 */
const pool = createPool(PG_CONNECTION_STRING, createSlonikConfiguration());

/**
 * End the pooled connection
 */
const closePool = () => pool.end();

export { pool, closePool, raw, sql };
export type { DatabasePoolType, DatabaseConnection, SqlTokenType };
