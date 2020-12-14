import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../services/auth/auth";
import projectsReducer from "../features/state/projectsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
