import { pool, closePool, DatabasePoolType } from "./slonik";
import {
  /* PLOP_INJECT_IMPORT */
  bindSessionQueries,
  bindUserQueries,
} from "./queries";
import { Project } from "./models";

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
export const Projects = new Project(pool);
export const Sessions = bindSessionQueries(pool);
export const Users = bindUserQueries(pool);

export { pool, closePool };
export type { DatabasePoolType };
