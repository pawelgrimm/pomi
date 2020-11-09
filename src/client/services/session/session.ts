import axios from "axios";
import { ClientSessionModel } from "../../../shared/types";
import {
  validateClientSession,
  hydrateDatabaseSession,
} from "../../../shared/validators";

const postSession = (session: ClientSessionModel): Promise<number> => {
  const validatedSession = validateClientSession(session);
  return axios
    .post("/api/sessions", validatedSession)
    .then((res) => res?.data?.id);
};

const getSession = (id: number): Promise<ClientSessionModel> => {
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
  session: Partial<ClientSessionModel>;
}): Promise<boolean> => {
  const validatedSession = validateClientSession(session, { isPartial: true });
  return axios.patch(`/api/sessions/${id}`, validatedSession).then(
    () => true,
    () => false
  );
};

export { postSession, getSession, fetchSession, patchSession };
