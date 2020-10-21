import axios from "axios";
import { Session, SessionParams } from "../../models";

const postSession = (session: SessionParams): Promise<number> => {
  return axios.post("/api/sessions", session).then((res) => res?.data?.id);
};

const getSession = (id: number): Promise<Session> => {
  return axios.get(`/api/sessions/${id}`).then((res) => res?.data[0]);
};

const fetchSession = (key: string, { id }: { id: number }) => {
  return getSession(id);
};

const putSession = ({
  id,
  session,
}: {
  id: number;
  session: SessionParams;
}): Promise<boolean> => {
  return axios.put(`/api/sessions/${id}`, session).then(
    () => true,
    () => false
  );
};

export { postSession, getSession, fetchSession, putSession };
