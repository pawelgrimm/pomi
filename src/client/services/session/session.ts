import axios from "axios";
import { ClientSessionModel } from "../../../shared/models";
import { validateClientSession } from "../../../shared/validators";

const postSession = (session: ClientSessionModel): Promise<number> => {
  session = validateClientSession(session);
  return axios.post("/api/sessions", session).then((res) => res?.data?.id);
};

const getSession = (id: number): Promise<ClientSessionModel> => {
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
  session: Partial<ClientSessionModel>;
}): Promise<boolean> => {
  const validatedSession = validateClientSession(session, { isPartial: true });
  return axios.patch(`/api/sessions/${id}`, validatedSession).then(
    () => true,
    () => false
  );
};

export { postSession, getSession, fetchSession, patchSession };
