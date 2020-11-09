interface TaskModel {
  id?: string;
  projectId?: string;
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
type TaskSelectOptions<T extends string | boolean = boolean> = {
  syncToken?: string;
  includeCompleted?: T;
};

export type { TaskModel, TaskSelectOptions };
