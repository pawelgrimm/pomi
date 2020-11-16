/**
 * Model representing a row in the sessions table
 */
export interface SessionModel {
  id?: string;
  taskId: string;
  startTimestamp: Date;
  duration: number;
  type: keyof typeof SessionType;
  notes?: string;
  isRetroAdded?: boolean;
  lastModified?: Date;
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
export type SessionOptions = {
  syncToken?: string;
  start?: Date;
  end?: Date;
};
