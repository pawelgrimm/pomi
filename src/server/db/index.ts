import { pool, closePool, DatabasePoolType } from "./slonik";
import { Project, Session, Task, User } from "./models";

/* PLOP_INJECT_BIND */
export const Tasks = new Task(pool);
export const Projects = new Project(pool);
export const Sessions = new Session(pool);
export const Users = new User(pool);

export { pool, closePool };
export type { DatabasePoolType };
