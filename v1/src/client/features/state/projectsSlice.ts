import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectModel } from "../../../shared/types";
import { getProjects } from "../../services/project/projectAPI";
import { PromiseType } from "utility-types";

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

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (arg, thunkAPI) => {
    let response;
    try {
      response = await getProjects();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.toString());
    }
    return response;
  }
);

const { reducer } = createSlice({
  name: "projects",
  initialState: initialProjectsState,
  reducers: {},
  extraReducers: {
    [fetchProjects.pending.type]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchProjects.rejected.type]: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchProjects.fulfilled.type]: (
      state,
      {
        payload: projects,
      }: PayloadAction<PromiseType<ReturnType<typeof getProjects>>>
    ) => {
      state.loading = false;
      state.error = null;
      projects.forEach((project) => {
        state.data[project.id] = project;
      });
    },
  },
});

export default reducer;
