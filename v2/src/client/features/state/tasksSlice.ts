import { TaskModel } from "@types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTasks } from "../../services/task/taskAPI";
import { PromiseType } from "utility-types";

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

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (arg, thunkAPI) => {
    let tasks;
    try {
      tasks = await getTasks();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.toString());
    }
    return tasks;
  }
);

const { reducer: tasksReducer } = createSlice({
  name: "tasks",
  initialState: initialTasksState,
  reducers: {},
  extraReducers: {
    [fetchTasks.pending.type]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchTasks.rejected.type]: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchTasks.fulfilled.type]: (
      state,
      {
        payload: tasks,
      }: PayloadAction<PromiseType<ReturnType<typeof getTasks>>>
    ) => {
      state.loading = false;
      state.error = null;
      tasks.forEach((task) => {
        state.data[task.id] = task;
      });
    },
  },
});

export default tasksReducer;
