import { TaskModel } from "@types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TasksState {
  data: Record<string, Required<TaskModel>>;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  data: {},
  loading: false,
  error: null,
};

const { reducer: tasksReducer } = createSlice({
  name: "tasks",
  initialState: initialTasksState,
  reducers: {
    addTask(state, { payload }: PayloadAction<Required<TaskModel>>) {
      state.data[payload.id] = payload;
    },
    editTask(state, { payload }: PayloadAction<TaskModel>) {
      state.data[payload.id] = { ...state.data[payload.id], ...payload };
    },
  },
});

export default tasksReducer;
