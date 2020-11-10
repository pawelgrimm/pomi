import axios from "axios";
import { SessionModel } from "../../../shared/types";
import {
  validateSession,
  hydrateDatabaseSession,
} from "../../../shared/validators";

const postSession = (session: SessionModel): Promise<number> => {
  const validatedSession = validateSession(session);
  return axios
    .post("/api/sessions", validatedSession)
    .then((res) => res?.data?.id);
};

const getSession = (id: number): Promise<SessionModel> => {
  return axios
    .get(`/api/sessions/${id}`)
    .then((res) => res?.data)
    .then((session) => hydrateDatabaseSession(session));
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
  const validatedSession = validateSession(session, { isPartial: true });
  return axios.patch(`/api/sessions/${id}`, validatedSession).then(
    () => true,
    () => false
  );
};

export { postSession, getSession, fetchSession, patchSession };
