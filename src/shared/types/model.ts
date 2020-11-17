/**
 * Properties shared by all models in the database
 */
export interface Model {
  id?: string;
  lastModified?: Date;
}

/**
 * Options for calling a sync endpoint
 */
export interface SyncOptions {
  syncToken?: string;
}
