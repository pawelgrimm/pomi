import axios from "axios";

export const login = (): Promise<void> => {
  return axios.post(`/api/users/login`);
};
