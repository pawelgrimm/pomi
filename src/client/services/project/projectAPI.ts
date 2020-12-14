import axios from "axios";
import { ProjectModel } from "../../../shared/types";

export const getProjects = (): Promise<Required<ProjectModel>[]> => {
  return axios.get(`/api/projects/`).then((res) => res?.data?.projects);
};
