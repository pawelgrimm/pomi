import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@infra/redux/rootReducer";
import { addProject } from "@infra/redux/projectsSlice";
import { CreateProjectDTO } from "@core/interfaces/ProjectDTOs";
import Project from "@core/projectAggregate/Project";

function useProjects() {
  const useGetById = (id: string) =>
    useSelector((state: RootState) => state.projects.data[id]);
  const useCreate = (
    request: CreateProjectDTO,
    callback: (project: Project) => void
  ) => {
    const dispatch = useDispatch();
    dispatch(addProject({ request, callback }));
  };

  return {
    getById: useGetById,
    create: useCreate,
  };
}

export default useProjects;
