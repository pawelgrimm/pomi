import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Project from "@core/projectAggregate/Project";
import { CreateProjectTaskDTO } from "@core/interfaces/ProjectDTOs";
import ProjectAPI from "@infra/api/ProjectAPI";

interface ProjectsState {
  data: Record<string, Project>;
  loading: boolean;
  error: string | null;
}

export const initialProjectsState: ProjectsState = {
  data: {},
  loading: false,
  error: null,
};

export const addProject = createAsyncThunk(
  "projects/add",
  async ({
    request,
    callback,
  }: {
    request: CreateProjectTaskDTO;
    callback: (newProject: Project) => void;
  }) => {
    const newProject = await ProjectAPI.create(request);
    callback(newProject);
    return newProject;
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({
    request,
    callback,
  }: {
    request: Project;
    callback: (savedProject: Project) => void;
  }) => {
    const savedProject = await ProjectAPI.update(request);
    callback(savedProject);
    return savedProject;
  }
);

export const initializeProjects = createAsyncThunk(
  "projects/init",
  async () => {
    return await ProjectAPI.getActive();
  }
);

const { reducer } = createSlice({
  name: "projects",
  initialState: initialProjectsState,
  reducers: {},
  extraReducers: {
    [addProject.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<Project>
    ) => {
      state.data[payload.id] = payload;
    },
    [initializeProjects.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<Project[]>
    ) => {
      payload.forEach((project) => {
        state.data[project.id] = project;
      });
    },
  },
});

export default reducer;
