/**
 * Properties shared by all models in the database
 */
export interface Model {
  id: string;
  lastModified?: string;
}

/**
 * Options for calling a sync endpoint
 */
export interface SyncOptions {
  syncToken?: string;
}
