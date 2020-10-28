import { differenceInMilliseconds, addMilliseconds } from "date-fns";

type SessionType = "session" | "break" | "long-break";

const getSessionType = (value: number): SessionType => {
  switch (value) {
    case 0:
      return "session";
    case 1:
      return "break";
    case 2:
      return "long-break";
    default:
      return "session";
  }
};

interface ClientSessionModel {
  id?: number;
  userId: number;
  taskId: number;
  startTimestamp: Date;
  endTimestamp: Date;
  notes?: string;
  type: SessionType;
  retroAdded?: boolean;
}

interface DatabaseSessionModel {
  id?: number;
  user_id: number;
  task_id: number;
  start_timestamp: Date;
  duration: number;
  notes?: string;
  type: SessionType;
  retro_added?: boolean;
}

const convertClientSessionModel = (
  session: ClientSessionModel
): DatabaseSessionModel => {
  const { startTimestamp, endTimestamp, retroAdded, ...rest } = session;
  return {
    start_timestamp: startTimestamp,
    duration: differenceInMilliseconds(endTimestamp, startTimestamp),
    retro_added: retroAdded,
    ...rest,
  };
};

const hydrateClientSession = (session: ClientSessionModel) => {
  return {
    ...session,
    startTimestamp: new Date(session.startTimestamp),
    endTimestamp: new Date(session.endTimestamp),
  };
};

const convertDatabaseSessionModel = (
  session: DatabaseSessionModel
): ClientSessionModel => {
  const { start_timestamp, duration, retro_added, ...rest } = session;
  return {
    startTimestamp: start_timestamp,
    endTimestamp: addMilliseconds(start_timestamp, Number(duration)),
    retroAdded: retro_added,
    ...rest,
  };
};

export type { ClientSessionModel, DatabaseSessionModel, SessionType };
export { convertDatabaseSessionModel, hydrateClientSession, getSessionType };
