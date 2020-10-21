interface Session {
  id: number;
  date: string;
  start_time: number;
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
