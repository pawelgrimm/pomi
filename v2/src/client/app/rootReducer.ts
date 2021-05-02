import { combineReducers } from "@reduxjs/toolkit";
import projectsReducer from "../features/state/projectsSlice";
import tasksReducer from "../features/state/tasksSlice";

const rootReducer = combineReducers({
  projects: projectsReducer,
  tasks: tasksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
