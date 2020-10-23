import axios from "axios";
import { Session, SessionParams } from "../../models";
import { sessionParamsToRaw } from "../../models/session";

const postSession = (session: SessionParams): Promise<number> => {
  const rawSession = sessionParamsToRaw(session);
  return axios.post("/api/sessions", rawSession).then((res) => res?.data?.id);
};

const getSession = (id: number): Promise<Session> => {
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
  session: SessionParams;
}): Promise<boolean> => {
  const rawSession = sessionParamsToRaw(session);
  console.log({ session, rawSession });
  return axios.patch(`/api/sessions/${id}`, rawSession).then(
    () => true,
    () => false
  );
};

export { postSession, getSession, fetchSession, patchSession };
