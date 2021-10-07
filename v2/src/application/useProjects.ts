import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@infra/redux/rootReducer";
import { addProject, updateProject } from "@infra/redux/projectsSlice";
import { CreateProjectTaskDTO } from "@core/interfaces/ProjectDTOs";
import Project from "@core/projectAggregate/Project";

function useProjects() {
  const useGetAll = () =>
    useSelector((state: RootState) => Object.values(state.projects.data));

  const useGetById = (id: string) =>
    useSelector((state: RootState) => state.projects.data[id]);

  const dispatch = useDispatch();

  const useCreate = (
    request: CreateProjectTaskDTO,
    callback: (project: Project) => void
  ) => {
    dispatch(addProject({ request, callback }));
  };

  const useUpdate = (
    request: Project,
    callback: (project: Project) => void = () => {}
  ) => {
    dispatch(updateProject({ request, callback }));
  };

  return {
    getAll: useGetAll,
    getById: useGetById,
    create: useCreate,
    update: useUpdate,
  };
}

export default useProjects;
