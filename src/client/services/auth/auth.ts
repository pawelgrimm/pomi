import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "./configure";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export type AuthSliceState = { jwt?: string };

const initialState: AuthSliceState = {};

export const fetchIdToken = createAsyncThunk(
  "auth/fetchIdTokenStatus",
  async () => await auth.currentUser?.getIdToken()
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.jwt = undefined;
    },
  },
  extraReducers: {
    [fetchIdToken.fulfilled.toString()]: (state, action) => {
      state.jwt = action.payload;
    },
  },
});
export const { logout } = authSlice.actions;

export const useAuth = () => {
  return useSelector<RootState, AuthSliceState>((state) => state.auth);
};

export default authSlice.reducer;
