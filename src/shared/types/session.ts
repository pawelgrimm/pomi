export type {
  ClientSessionModel,
  DatabaseSessionModel,
  SessionTypeString,
  SessionSelectOptions,
};

export { SessionType, getSessionTypeString };

enum SessionType {
  session,
  break,
  long_break,
}

type SessionTypeString = keyof typeof SessionType;

const getSessionTypeString = (value: SessionType): SessionTypeString => {
  return SessionType[value] as SessionTypeString;
};

/**
 * Client representation of session model
 */
interface ClientSessionModel {
  id?: string;
  userId: string;
  taskId: string;
  startTimestamp: Date;
  endTimestamp: Date;
  notes?: string;
  type: SessionTypeString;
  isRetroAdded?: boolean;
}

/**
 * Options provided to Task's select() function
 * @typedef {Object} SelectOptions
 * @property {string} syncToken - token that indicates last sync time; when provided,
 *  only projects modified after the last sync are queried
 * @property {T extends string | boolean = boolean} includeArchived - indicates if completed tasks should be queried
 */
type SessionSelectOptions<T extends string | Date = Date> = {
  syncToken?: string;
  // start?: T;
  // end?: T;
};

/**
 * Database representation of session model
 */
interface DatabaseSessionModel {
  id?: string;
  user_id: string;
  task_id?: string;
  start_timestamp: Date;
  duration: number;
  notes?: string;
  type: SessionTypeString;
  is_retro_added?: boolean;
}
