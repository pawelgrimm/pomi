import { getTasks } from "../../../services/task/taskAPI";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import { TaskModel } from "../../../../shared/types";
import configureMockStore from "redux-mock-store";
import { mocked } from "ts-jest/utils";
import { fetchTasks, initialTasksState } from "../tasksSlice";
import { arrayContainingObjectsContaining } from "../../../../shared/utils";
import { AppDispatch } from "../../../app/store";
import { RootState } from "../../../app/rootReducer";
import { initialProjectsState } from "../projectsSlice";

jest.mock("../../../services/task/taskAPI");
const mockedGetTasks = mocked(getTasks);

const middlewares = getDefaultMiddleware();
const store = configureMockStore<RootState, AppDispatch>(middlewares)({
  projects: initialProjectsState,
  tasks: initialTasksState,
  auth: {},
});

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
});

describe("Tasks Slice tests", () => {
  it("Should call fetch API and update state", () => {
    const tasks: Required<TaskModel>[] = [
      {
        id: "test-id-661234",
        title: "test task",
        isCompleted: false,
        lastModified: "2020-12-14T18:34:50.427Z",
        projectId: "project-id-152234",
      },
    ];
    mockedGetTasks.mockImplementation(async () => tasks);

    const expectedActions = [
      { type: "tasks/fetchTasks/pending" },
      { type: "tasks/fetchTasks/fulfilled", payload: tasks },
    ];

    store.dispatch(fetchTasks()).then(() => {
      expect(store.getActions()).toEqual(
        arrayContainingObjectsContaining(expectedActions)
      );
    });
  });
});

export {};
