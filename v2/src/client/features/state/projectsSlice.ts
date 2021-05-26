import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectModel } from "@types";
import { v4 as uuid } from "uuid";
import { isNewOption, OptionType } from "@features/search/OptionType";
import { useDispatch } from "react-redux";

interface ProjectsState {
  data: Record<string, ProjectModel>;
  loading: boolean;
  error: string | null;
}

export const initialProjectsState: ProjectsState = {
  data: {},
  loading: false,
  error: null,
};

const addProject = createAsyncThunk(
  "projects/add",
  async (
    {
      project,
      callback,
    }: {
      project: OptionType<ProjectModel>;
      callback: (project: ProjectModel) => void;
    },
    thunkAPI
  ) => {
    project = isNewOption(project)
      ? {
          id: uuid(),
          title: project.title,
          lastModified: Date.now().toString(),
        }
      : project;
    callback(project);
    return project;
  }
);

const { reducer } = createSlice({
  name: "projects",
  initialState: initialProjectsState,
  reducers: {
    editProject(state, { payload }: PayloadAction<ProjectModel>) {
      state.data[payload.id] = { ...state.data[payload.id], ...payload };
    },
  },
  extraReducers: {
    [addProject.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<ProjectModel>
    ) => {
      state.data[payload.id] = payload;
    },
  },
});

export function useAddProject() {
  const dispatch = useDispatch();
  return (
    project: OptionType<ProjectModel>,
    callback: (project: ProjectModel) => void
  ) => dispatch(addProject({ project, callback }));
}

export default reducer;
