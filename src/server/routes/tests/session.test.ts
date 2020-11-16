// @ts-nocheck
import request from "supertest";
import app from "../../server";
import {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockConnect,
  mockConnectCreate as mockSessionCreate,
} from "../../db/models/session";
import { mockConnectCreate as mockTaskCreate } from "../../db/models/task";
import { mockConnectCreate as mockProjectCreate } from "../../db/models/project";
import { v4 as uuid } from "uuid";
import {
  arrayContainingObjectsContaining,
  createValidSession,
} from "../../../shared/utils/testing-helpers";
import { ValidationError } from "../../../shared/validators";

// Set up mock
jest.mock("../../db/index");

let user = { id: uuid() };

beforeEach(() => jest.clearAllMocks());

const validSession = createValidSession();

describe("Authorization", () => {
  it("should require authorization on all paths", async (done) => {
    await request(app)
      .post("/api/sessions")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    await request(app)
      .get("/api/sessions")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    await request(app)
      .get("/api/sessions/123")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    done();
  });
});

describe("POST sessions/", () => {
  it("should create a session", async (done) => {
    const { session, task, project } = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .send({ session: validSession })
      .expect(201)
      .then((res) => res.body);

    expect(mockProjectCreate).not.toHaveBeenCalled();
    expect(project).toBeUndefined();
    expect(mockTaskCreate).not.toHaveBeenCalled();
    expect(task).toBeUndefined();

    expect(mockSessionCreate).toHaveBeenCalledWith(user.id, {
      ...validSession,
      startTimestamp: validSession.startTimestamp.toISOString(),
    });

    done();
  });

  it("Should create a task if needed", async (done) => {
    const requestSession = {
      ...validSession,
      taskId: undefined,
    };

    const requestTask = { title: "a new task", projectId: uuid() };

    const { session, task, project } = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .send({ session: requestSession, task: requestTask })
      .expect(201)
      .then((res) => res.body);

    expect(mockProjectCreate).not.toHaveBeenCalled();
    expect(project).toBeUndefined();

    expect(mockTaskCreate).toHaveBeenCalledWith(user.id, requestTask);
    expect(task).toBeDefined();

    expect(mockSessionCreate).toHaveBeenCalledWith(user.id, {
      ...requestSession,
      startTimestamp: requestSession.startTimestamp.toISOString(),
      taskId: task.id,
    });
    expect(session).toBeDefined();

    done();
  });

  it("Should create a project if needed", async (done) => {
    const requestSession = {
      ...validSession,
      taskId: undefined,
    };

    const requestTask = { title: "a new task" };

    const requestProject = { title: "a new project" };

    const { session, task, project } = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .send({
        session: requestSession,
        task: requestTask,
        project: requestProject,
      })
      .expect(201)
      .then((res) => res.body);

    expect(mockProjectCreate).toHaveBeenCalledWith(user.id, requestProject);
    expect(project).toBeDefined();

    expect(mockTaskCreate).toHaveBeenCalledWith(user.id, {
      ...requestTask,
      projectId: project.id,
    });
    expect(task).toBeDefined();

    expect(mockSessionCreate).toHaveBeenCalledWith(user.id, {
      ...requestSession,
      startTimestamp: requestSession.startTimestamp.toISOString(),
      taskId: task.id,
    });
    expect(session).toBeDefined();

    done();
  });

  it("Should not create a session if project creation failed", async (done) => {
    const requestSession = {
      ...validSession,
      taskId: undefined,
    };

    const requestTask = { title: "a new task" };

    const requestProject = { title: "a new project" };

    mockProjectCreate.mockImplementationOnce((userId, project) => {
      throw new ValidationError("Bad project");
    });

    await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .send({
        session: requestSession,
        task: requestTask,
        project: requestProject,
      })
      .expect(422)
      .then((res) => res.body);

    expect(mockProjectCreate).toHaveBeenCalled();
    expect(mockTaskCreate).not.toHaveBeenCalled();
    expect(mockSessionCreate).not.toHaveBeenCalled();
    done();
  });

  it("Should not create a session if task creation failed", async (done) => {
    const requestSession = {
      ...validSession,
      taskId: undefined,
    };

    const requestTask = { title: "a new task" };

    const requestProject = { title: "a new project" };

    mockTaskCreate.mockImplementationOnce((userId, task) => {
      throw new ValidationError("Bad task");
    });

    await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .send({
        session: requestSession,
        task: requestTask,
        project: requestProject,
      })
      .expect(422)
      .then((res) => res.body);

    expect(mockProjectCreate).toHaveBeenCalled();
    expect(mockTaskCreate).toHaveBeenCalled();
    expect(mockSessionCreate).not.toHaveBeenCalled();
    done();
  });
});

describe("GET sessions/", () => {
  it("Should get all sessions", async (done) => {
    await request(app)
      .get("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      syncToken: "*",
    });

    done();
  });
  // it("Should get only new tasks", async (done) => {
  //   const syncToken = new Date().toISOString();
  //
  //   await request(app)
  //       .get(`/api/tasks?sync_token=${syncToken}`)
  //       .set("Authorization", `Bearer ${user.id}`)
  //       .expect(200);
  //
  //   expect(mockSelect).toHaveBeenCalledWith(user.id, {
  //     includeCompleted: false,
  //     syncToken,
  //   });
  //
  //   done();
  // });
  //
  // it("A bad sync token should return a 422 error", async (done) => {
  //   const syncToken = "this-is-not-an-iso-8601-date";
  //
  //   const { body } = await request(app)
  //       .get(`/api/tasks?sync_token=${syncToken}`)
  //       .set("Authorization", `Bearer ${user.id}`)
  //       .set("X-Test-Suppress-Error-Logging", "true")
  //       .expect(422);
  //
  //   expect(body).toEqual({
  //     errors: {
  //       paths: arrayContainingObjectsContaining([
  //         {
  //           name: "syncToken",
  //           message: /could not be parsed/,
  //         },
  //       ]),
  //     },
  //   });
  //   done();
  // });
  //
  // it("A bad value for includeCompleted should return a 422 error", async (done) => {
  //   const { body } = await request(app)
  //       .get(`/api/tasks?include_completed=tamales`)
  //       .set("Authorization", `Bearer ${user.id}`)
  //       .set("X-Test-Suppress-Error-Logging", "true")
  //       .expect(422);
  //
  //   expect(body).toEqual({
  //     errors: {
  //       paths: arrayContainingObjectsContaining([
  //         {
  //           name: "includeCompleted",
  //           message: /could not be parsed/,
  //         },
  //       ]),
  //     },
  //   });
  //   done();
  // });
  //
  // it("Should get tasks including completed tasks", async (done) => {
  //   await request(app)
  //       .get("/api/tasks?include_completed=1")
  //       .set("Authorization", `Bearer ${user.id}`)
  //       .expect(200);
  //
  //   expect(mockSelect).toHaveBeenCalledWith(user.id, {
  //     includeCompleted: true,
  //     syncToken: "*",
  //   });
  //   done();
  // });
  //
  // it("Should return correctly when user has no tasks", async (done) => {
  //   mockSelect.mockImplementationOnce(
  //       () => new Promise((resolve) => resolve([]))
  //   );
  //
  //   const { body } = await request(app)
  //       .get("/api/tasks")
  //       .set("Authorization", `Bearer ${user.id}`)
  //       .expect(404);
  //
  //   expect(body).toEqual({
  //     tasks: [],
  //   });
  //   done();
  // });
});
