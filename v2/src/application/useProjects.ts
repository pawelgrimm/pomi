import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@infra/redux/rootReducer";
import { addProject } from "@infra/redux/projectsSlice";
import { CreateProjectDTO } from "@core/interfaces/ProjectDTOs";
import Project from "@core/projectAggregate/Project";

function useProjects() {
  const useGetAll = () =>
    useSelector((state: RootState) => Object.values(state.projects.data));

  const useGetById = (id: string) =>
    useSelector((state: RootState) => state.projects.data[id]);

  const dispatch = useDispatch();
  const useCreate = (
    request: CreateProjectDTO,
    callback: (project: Project) => void
  ) => {
    dispatch(addProject({ request, callback }));
  };

  return {
    getAll: useGetAll,
    getById: useGetById,
    create: useCreate,
  };
}

export default useProjects;
