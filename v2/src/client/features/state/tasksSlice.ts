import { TaskModel } from "@types";
import { v4 as uuid } from "uuid";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isNewOption, OptionType } from "@features/search/OptionType";
import { useDispatch } from "react-redux";

interface TasksState {
  data: Record<string, TaskModel>;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  data: {},
  loading: false,
  error: null,
};

const addTask = createAsyncThunk(
  "tasks/add",
  async ({
    task,
    callback,
  }: {
    task: OptionType<TaskModel> & { projectId: TaskModel["projectId"] };
    callback: (task: TaskModel) => void;
  }) => {
    task = isNewOption(task)
      ? {
          id: uuid(),
          projectId: task.projectId,
          title: task.title,
          lastModified: Date.now().toString(),
        }
      : task;
    callback(task);
    return task;
  }
);

const { reducer: tasksReducer } = createSlice({
  name: "tasks",
  initialState: initialTasksState,
  reducers: {
    editTask(state, { payload }: PayloadAction<TaskModel>) {
      state.data[payload.id] = { ...state.data[payload.id], ...payload };
    },
  },
  extraReducers: {
    [addTask.fulfilled.toString()]: (
      state,
      { payload }: PayloadAction<TaskModel>
    ) => {
      state.data[payload.id] = payload;
    },
  },
});

export function useAddTask() {
  const dispatch = useDispatch();
  return (
    task: OptionType<TaskModel> & { projectId: TaskModel["projectId"] },
    callback: (task: TaskModel) => void
  ) => dispatch(addTask({ task, callback }));
}

export default tasksReducer;
