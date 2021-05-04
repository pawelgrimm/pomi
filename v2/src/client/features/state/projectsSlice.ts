import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectModel } from "@types";

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

const { reducer } = createSlice({
  name: "projects",
  initialState: initialProjectsState,
  reducers: {
    addProject(state, { payload }: PayloadAction<Required<ProjectModel>>) {
      state.data[payload.id] = payload;
    },
    editProject(state, { payload }: PayloadAction<ProjectModel>) {
      state.data[payload.id] = { ...state.data[payload.id], ...payload };
    },
  },
});

export default reducer;
