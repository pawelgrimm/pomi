import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { auth } from "./configure";
import { useSelector } from "react-redux";
import { RootState } from "../../app/rootReducer";
import { fetchProjects } from "../../features/state/projectsSlice";
import { fetchTasks } from "../../features/state/tasksSlice";
import axios from "axios";
import { login } from "./authAPI";

export type AuthSliceState = {
  jwt?: string;
  error: string | null;
  loading: boolean;
};

export const initialAuthState: AuthSliceState = {
  loading: false,
  error: null,
};

export const fetchIdTokenAndSyncEntities = createAsyncThunk(
  "auth/fetchIdTokenStatus",
  async (arg, thunkAPI) => {
    let newToken;
    try {
      newToken = await auth.currentUser?.getIdToken();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.toString());
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    login()
      .then(() => {
        thunkAPI.dispatch(fetchProjects());
        thunkAPI.dispatch(fetchTasks());
      })
      .catch((err) => {
        console.log("server error: ", err);
      });

    return newToken;
  }
);

type FetchIdTokenReturnType = string;

const { actions, reducer: authReducer } = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout(state) {
      state.jwt = undefined;
    },
  },
  extraReducers: {
    [fetchIdTokenAndSyncEntities.pending.type]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchIdTokenAndSyncEntities.pending.type]: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchIdTokenAndSyncEntities.fulfilled.type]: (
      state,
      action: PayloadAction<FetchIdTokenReturnType>
    ) => {
      state.loading = false;
      state.error = null;
      state.jwt = action.payload;
    },
  },
});

export const { logout } = actions;

export default authReducer;

export const useAuth = () => {
  return useSelector<RootState, AuthSliceState>((state) => state.auth);
};
