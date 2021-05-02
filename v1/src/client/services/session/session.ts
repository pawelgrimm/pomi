import axios from "axios";
import {
  ProjectModel,
  SessionModel,
  SessionTypeString,
  TaskModel,
} from "../../../shared/types";
import { validateSession } from "../../../shared/validators";
import { Method } from "../../../shared/validators";

export interface NewSessionParams {
  notes: string;
  startTimestamp: string;
  duration: number;
  type: SessionTypeString;
  taskId?: string;
}

export interface NewTaskParams {
  title: string;
  projectId?: string;
}

export interface NewProjectParams {
  title: string;
}

export interface PostSessionParams {
  session: NewSessionParams;
  task: NewTaskParams | null;
  project: NewProjectParams | null;
}

const postSession = ({
  session,
  project,
  task,
}: PostSessionParams): Promise<{
  session: Required<SessionModel>;
  task?: Required<TaskModel>;
  project?: Required<ProjectModel>;
}> => {
  return axios
    .post("/api/sessions", { session, project, task })
    .then((res) => res?.data);
};

const getSession = (id: number): Promise<SessionModel> => {
  // TODO: Implement Date deserializer?
  return axios.get(`/api/sessions/${id}`).then((res) => res?.data);
};

const fetchSession = (key: string, { id }: { id: number }) => {
  return getSession(id);
};

const patchSession = ({
  id,
  session,
}: {
  id: string;
  session: Partial<SessionModel>;
}): Promise<boolean> => {
  const validatedSession = validateSession(session, Method.PARTIAL);
  return axios.patch(`/api/sessions/${id}`, validatedSession).then(
    () => true,
    () => false
  );
};

export { postSession, getSession, fetchSession, patchSession };
