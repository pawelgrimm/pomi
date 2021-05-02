import { getProjects } from "../../../services/project/projectAPI";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import { ProjectModel } from "../../../../shared/types";
import configureMockStore from "redux-mock-store";
import { mocked } from "ts-jest/utils";
import { fetchProjects, initialProjectsState } from "../projectsSlice";
import { arrayContainingObjectsContaining } from "../../../../shared/utils";
import { AppDispatch } from "../../../app/store";
import { RootState } from "../../../app/rootReducer";
import { initialTasksState } from "../tasksSlice";
import { initialAuthState } from "../../../services/auth";

jest.mock("../../../services/project/projectAPI");
const mockedGetProjects = mocked(getProjects);

const middlewares = getDefaultMiddleware();
const store = configureMockStore<RootState, AppDispatch>(middlewares)({
  projects: initialProjectsState,
  tasks: initialTasksState,
  auth: initialAuthState,
});

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
});

describe("Projects Slice tests", () => {
  it("Should call fetchAPI and update state", () => {
    const projects: Required<ProjectModel>[] = [
      {
        id: "test-id-15224",
        title: "test project",
        isArchived: false,
        lastModified: "2020-12-14T18:34:50.427Z",
      },
    ];
    mockedGetProjects.mockImplementation(async () => projects);

    const expectedActions = [
      { type: "projects/fetchProjects/pending" },
      { type: "projects/fetchProjects/fulfilled", payload: projects },
    ];

    store.dispatch(fetchProjects()).then(() => {
      expect(store.getActions()).toEqual(
        arrayContainingObjectsContaining(expectedActions)
      );
    });
  });
});

export {};
