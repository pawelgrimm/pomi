interface ClientSessionModel {
  startTimestamp: Date;
  endTimestamp: Date;
  description?: string;
  //task?: string;
  retroAdded?: boolean;
}

interface DatabaseSessionModel {
  start_timestamp: Date;
  duration: string;
  description?: string;
  //task?: string;
  retro_added?: boolean;
}

export type { ClientSessionModel, DatabaseSessionModel };
