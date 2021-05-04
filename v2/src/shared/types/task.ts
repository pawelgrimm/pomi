import { Model, SyncOptions } from "./model";

/**
 * A row from the tasks table
 */
export interface TaskModel extends Model {
  projectId: string;
  title?: string;
  isCompleted?: boolean;
}

/**
 * Options provided to Task's select() function
 * @typedef {Object} SelectOptions
 * @property {string} syncToken - token that indicates last sync time; when provided,
 *  only projects modified after the last sync are queried
 * @property {T extends string | boolean = boolean} includeArchived - indicates if completed tasks should be queried
 */
export interface TaskOptions extends SyncOptions {
  includeCompleted?: boolean;
}
