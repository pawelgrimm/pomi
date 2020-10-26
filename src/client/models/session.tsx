import { ClientSessionModel } from "../../shared/models";

interface Session {
  id: number;
  start_timestamp: number;
  duration: number;
  description: string;
  // project: string;
}

interface SessionParams {
  startDate: Date;
  endDate: Date;
  description?: string;
  project?: string;
  retro_added?: boolean;
}

interface SessionParamsRaw {
  startTimestamp: number;
  endTimestamp: number;
  description?: string;
  project?: string;
  retro_added?: boolean;
}

const sessionParamsToRaw = (
  session: ClientSessionModel
): ClientSessionModel => {
  return {
    startTimestamp: session.startTimestamp,
    endTimestamp: session.endTimestamp,
    description: session.description?.trim(),
    // project: session.project?.trim(),
    retroAdded: session.retroAdded,
  };
};

export type { Session, SessionParams, SessionParamsRaw };
export { sessionParamsToRaw };
