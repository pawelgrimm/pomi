import axios from "axios";
import { TaskModel } from "../../../shared/types";

export const getTasks = (): Promise<Required<TaskModel>[]> => {
  return axios.get(`/api/tasks/`).then((res) => res?.data?.tasks);
};
