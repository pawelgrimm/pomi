import { differenceInMilliseconds, addMilliseconds } from "date-fns";

interface ClientSessionModel {
  id?: number;
  startTimestamp: Date;
  endTimestamp: Date;
  description?: string;
  //task?: string;
  retroAdded?: boolean;
}

interface DatabaseSessionModel {
  id?: number;
  start_timestamp: Date;
  duration: number;
  description?: string;
  //task?: string;
  retro_added?: boolean;
}

const convertClientSessionModel = (
  session: ClientSessionModel
): DatabaseSessionModel => {
  const { id, startTimestamp, endTimestamp, description, retroAdded } = session;
  return {
    id,
    start_timestamp: startTimestamp,
    duration: differenceInMilliseconds(endTimestamp, startTimestamp),
    description,
    retro_added: retroAdded,
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
  const { id, start_timestamp, duration, description, retro_added } = session;
  return {
    id,
    startTimestamp: start_timestamp,
    endTimestamp: addMilliseconds(start_timestamp, Number(duration)),
    description,
    retroAdded: retro_added,
  };
};

export type { ClientSessionModel, DatabaseSessionModel };
export {
  convertClientSessionModel,
  convertDatabaseSessionModel,
  hydrateClientSession,
};
