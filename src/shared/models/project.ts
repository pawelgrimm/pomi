interface ProjectModel {
  id?: string;
  title?: string;
  isArchived?: boolean;
}

/**
 * Options provided to Project's select() function
 * @typedef {Object} SelectOptions
 * @property {string} syncToken - token that indicates last sync time; when provided,
 *  only projects modified after the last sync are queried
 * @property {T extends string | boolean = boolean} includeArchived - indicates if archived projects should be queried
 */
type ProjectSelectOptions<T extends string | boolean = boolean> = {
  syncToken?: string;
  includeArchived?: T;
};

export type { ProjectModel, ProjectSelectOptions };
