import { Pool, QueryResult } from "pg";
import { PG_CONNECTION_STRING } from "../config";
import {
  /* PLOP_INJECT_IMPORT */
  bindSessionQueries,
  bindUserQueries,
} from "./queries";

/**
 * Set up a client pool connected to the application database
 */
const pool = new Pool({ connectionString: PG_CONNECTION_STRING });

/**
 * End the client pool's connection
 */
const close = () => pool.end();

export type PGQuery = (
  queryText: string,
  values?: any[]
) => Promise<QueryResult>;

/**
 * Execute a query against the application database
 * @param queryText the query to execute
 * @param values values to substitute into the query
 */
const query: PGQuery = (queryText, values) => pool.query(queryText, values);

// Bind object-specific queries to query and expose them as an export
/* PLOP_INJECT_BIND */
export const Sessions = bindSessionQueries(query);
export const Users = bindUserQueries(query);

export { query, close };
