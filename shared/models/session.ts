interface SessionParamsClient {
  startTimestamp: string;
  endTimestamp: string;
  description?: string;
  //task?: string;
  retroAdded?: boolean;
}

interface SessionParamsDB {
  start_timestamp: string;
  duration: string;
  description?: string;
  //task?: string;
  retro_added?: boolean;
}

export type { SessionParamsClient, SessionParamsDB };
