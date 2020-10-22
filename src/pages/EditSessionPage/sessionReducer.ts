import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "../../models";
import { getDateStringFromDate, getTimeFromDate } from "../../utils/time";
import { add } from "date-fns";

interface SessionState {
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  project: string;
  modified: {
    date?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    description?: boolean;
    project?: boolean;
  };
}

const initialState: SessionState = {
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  project: "",
  modified: {},
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      const { start_timestamp, description, duration } = action.payload;
      const startDate = new Date(start_timestamp);
      const date = getDateStringFromDate(startDate);
      const startTime = getTimeFromDate(startDate).toString();
      const endDate = add(startDate, {
        seconds: duration / 1000.0,
      });
      const endTime = getTimeFromDate(endDate).toString();
      return {
        date,
        startTime,
        endTime,
        description,
        project: "",
        modified: {},
      };
    },
    setDate(state, action: PayloadAction<string>) {
      return {
        ...state,
        date: action.payload,
        modified: { ...state.modified, date: true },
      };
    },
    setStartTime(state, action: PayloadAction<string>) {
      state.startTime = action.payload;
      state.modified.startTime = true;
    },
    setEndTime(state, action: PayloadAction<string>) {
      state.endTime = action.payload;
      state.modified.endTime = true;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
      state.modified.description = true;
    },
    setProject(state, action: PayloadAction<string>) {
      state.project = action.payload;
      state.modified.project = true;
    },
  },
});

export { sessionSlice, initialState };
