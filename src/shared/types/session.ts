export type { ClientSessionModel, DatabaseSessionModel, SessionTypeString };

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

interface ClientSessionModel {
  id?: number;
  userId: string;
  taskId: number;
  startTimestamp: Date;
  endTimestamp: Date;
  notes?: string;
  type: SessionTypeString;
  retroAdded?: boolean;
}

interface DatabaseSessionModel {
  id?: number;
  user_id: string;
  task_id: number;
  start_timestamp: Date;
  duration: number;
  notes?: string;
  type: SessionTypeString;
  retro_added?: boolean;
}
