import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../services/auth/auth";
import projectsReducer from "../features/state/projectsSlice";
import tasksReducer from "../features/state/tasksSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
