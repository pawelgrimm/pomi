interface Session {
  id: number;
  start_timestamp: number;
  duration: number;
  description: string;
  // project: string;
}

interface SessionParams {
  startTimestamp: number;
  endTimestamp: number;
  description?: string;
  project?: string;
}

export type { Session, SessionParams };
