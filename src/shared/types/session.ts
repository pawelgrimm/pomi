import { Model, SyncOptions } from "./model";

/**
 * A row from the sessions table
 */
export interface SessionModel extends Model {
  taskId: string;
  startTimestamp: string;
  duration: number;
  type: keyof typeof SessionType;
  notes?: string;
  isRetroAdded?: boolean;
}

/**
 * Enum of valid session types
 */
export enum SessionType {
  session = "session",
  break = "break",
  long_break = "long_break",
}

/**
 *
 */
export type SessionTypeString = keyof typeof SessionType;

/**
 * Options provided to Session.select()
 * @typedef {Object} SelectOptions
 * @property {string} syncToken - token that indicates last sync time; when provided,
 *  only projects modified after the last sync are queried
 * @property {Date} [start] - indicates start of time range to query
 * @property {Date} [end] - indicates end of time range to query
 */
export interface SessionOptions extends SyncOptions {
  start?: Date;
  end?: Date;
}
