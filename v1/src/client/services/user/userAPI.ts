import axios from "axios";
import { ProjectModel, SessionModel, TaskModel } from "../../../shared/types";

type SyncEntities = {
  syncToken: string;
  sessions: Required<SessionModel>[];
  tasks: Required<TaskModel>[];
  projects: Required<ProjectModel>[];
};

export const getUserSync = (): Promise<SyncEntities> => {
  return axios.get(`/api/users/sync`).then((res) => res?.data);
};
