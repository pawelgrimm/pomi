import { pool, closePool, DatabasePoolType } from "./slonik";
import {
  /* PLOP_INJECT_IMPORT */
  bindUserQueries,
} from "./queries";
import { Project, Session, Task } from "./models";

/* PLOP_INJECT_BIND */
export const Tasks = new Task(pool);
export const Projects = new Project(pool);
export const Sessions = new Session(pool);
export const Users = bindUserQueries(pool);

export { pool, closePool };
export type { DatabasePoolType };
