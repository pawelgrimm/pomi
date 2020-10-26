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

const sessionParamsToRaw = (session: SessionParams): SessionParamsRaw => {
  return {
    startTimestamp: session.startDate.valueOf() / 1000.0,
    endTimestamp: session.endDate.valueOf() / 1000.0,
    description: session.description?.trim(),
    project: session.project?.trim(),
    retro_added: session.retro_added,
  };
};

export type { Session, SessionParams, SessionParamsRaw };
export { sessionParamsToRaw };
