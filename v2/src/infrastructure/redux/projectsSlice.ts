import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Project from "@core/projectAggregate/Project";
import { CreateProjectDTO } from "@core/interfaces/ProjectDTOs";
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
    request: CreateProjectDTO;
    callback: (newProject: Project) => void;
  }) => {
    const newProject = await ProjectAPI.create(request);
    callback(newProject);
    return newProject;
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
