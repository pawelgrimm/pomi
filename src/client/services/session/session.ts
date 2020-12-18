import axios from "axios";
import { ProjectModel, SessionModel, TaskModel } from "../../../shared/types";
import { validateSession } from "../../../shared/validators";
import { Method } from "../../../shared/validators/shared";
import { ProjectOptionType } from "../../features/searchField/ProjectField";
import { TaskOptionType } from "../../features/searchField/TaskField";

export type PostSessionParams = {
  session: Partial<SessionModel>;
  project: ProjectOptionType | null;
  task: TaskOptionType | null;
};

const postSession = ({
  session,
  project,
  task,
}: PostSessionParams): Promise<Required<SessionModel>> => {
  // TODO: Make sure we're not double validating in the useAddSession path
  const validatedSession = session; // validateSession(session);
  return axios
    .post("/api/sessions", { session: validatedSession, project, task })
    .then((res) => res?.data?.session);
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
  id: number;
  session: Partial<SessionModel>;
}): Promise<boolean> => {
  const validatedSession = validateSession(session, Method.PARTIAL);
  return axios.patch(`/api/sessions/${id}`, validatedSession).then(
    () => true,
    () => false
  );
};

export { postSession, getSession, fetchSession, patchSession };
