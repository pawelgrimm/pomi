import { pool, createPool, DatabasePoolType } from "./slonik";
import {
  /* PLOP_INJECT_IMPORT */
  bindProjectQueries,
  bindSessionQueries,
  bindUserQueries,
} from "./queries";

/**
 * Set up a client pool connected to the application database
 */
// const pool = new Pool({ connectionString: PG_CONNECTION_STRING });

/**
 * End the client pool's connection
 */
// const close = () => pool.end();

// Bind object-specific queries to query and expose them as an export
/* PLOP_INJECT_BIND */
export const Projects = bindProjectQueries(pool);
export const Sessions = bindSessionQueries(pool);
export const Users = bindUserQueries(pool);

export { pool, createPool };
export type { DatabasePoolType };
