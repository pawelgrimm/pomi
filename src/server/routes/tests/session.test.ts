// @ts-nocheck
import request from "supertest";
import app from "../../server";
import {
  mockSelect,
  mockSelectOne,
  mockConnectUpdate,
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

describe("GET sessions/sync", () => {
  it("Should get all sessions and a new sync token", async (done) => {
    const { syncToken, sessions } = await request(app)
      .get("/api/sessions/sync")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      syncToken: "*",
    });

    expect(syncToken).toBeDefined();
    expect(sessions).toBeDefined();

    done();
  });

  it("Should get all sessions using sync token", async (done) => {
    const sync_token = "2020-12-20T12:00:00.000Z";
    const { syncToken, sessions } = await request(app)
      .get(`/api/sessions/sync?sync_token=${sync_token}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      syncToken: sync_token,
    });

    expect(syncToken).toBeDefined();
    expect(syncToken).not.toEqual(sync_token);
    expect(sessions).toBeDefined();

    done();
  });

  it("Should return error for malformed synctoken", async (done) => {
    const sync_token = "this-is-not-an-iso-8601-date";

    const { errors } = await request(app)
      .get(`/api/sessions/sync?sync_token=${sync_token}`)
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(422)
      .then((res) => res.body);

    expect(errors).toEqual({
      paths: arrayContainingObjectsContaining([
        {
          name: "syncToken",
          message: expect.stringMatching(/could not be parsed/),
        },
      ]),
    });

    done();
  });

  it("Should return error for forbidden parameters", async (done) => {
    const start = "2020-11-01";

    const { errors } = await request(app)
      .get(`/api/sessions/sync?start=${start}`)
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(422)
      .then((res) => res.body);

    expect(errors).toEqual({
      paths: arrayContainingObjectsContaining([
        {
          name: "start",
          message: expect.stringMatching(/"start" is not allowed/),
        },
      ]),
    });
    done();
  });
});

describe("GET sessions/", () => {
  it("Should get all sessions", async (done) => {
    await request(app)
      .get("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {});

    done();
  });

  it("Should pass start and end options", async (done) => {
    const start = "2020-11-01";
    const end = "2020-11-30";

    // Start only
    await request(app)
      .get(`/api/sessions?start=${start}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      start: new Date(start),
    });

    mockSelect.mockClear();

    // End only
    await request(app)
      .get(`/api/sessions?end=${end}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      end: new Date(end),
    });

    mockSelect.mockClear();

    // Start and End
    await request(app)
      .get(`/api/sessions?start=${start}&end=${end}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      start: new Date(start),
      end: new Date(end),
    });

    done();
  });

  it("Should throw error for forbidden parameters", async (done) => {
    const sync_token = "2020-12-20T12:00:00.000Z";
    const { errors } = await request(app)
      .get(`/api/sessions?sync_token=${sync_token}`)
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(422)
      .then((res) => res.body);

    expect(errors).toEqual({
      paths: arrayContainingObjectsContaining([
        {
          name: "syncToken",
          message: expect.stringMatching(/"syncToken" is not allowed/),
        },
      ]),
    });

    done();
  });
});

describe("GET sessions/:id", () => {
  it("Should get specific sessions", async (done) => {
    const sessionId = uuid();

    await request(app)
      .get(`/api/sessions/${sessionId}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockSelectOne).toHaveBeenCalledWith(user.id, sessionId);
    done();
  });

  it("Should return error when session is not found", async () => {
    mockSelectOne.mockImplementationOnce(
      () => new Promise((resolve) => resolve(null))
    );

    const body = request(app)
      .get(`/api/sessions/${uuid()}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(404)
      .then((res) => res.body);

    return expect(body).resolves.toEqual({
      session: null,
    });
  });
});

describe("PATCH sessions/:id", () => {
  it("Should update specific session", async (done) => {
    const updates = {
      ...validSession,
      notes: "some new notes",
      duration: 13504444,
    };

    const { session } = await request(app)
      .patch(`/api/sessions/${updates.id}`)
      .send({ session: updates })
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockConnectUpdate).toHaveBeenCalledWith(user.id, updates.id, {
      ...updates,
      startTimestamp: updates.startTimestamp.toISOString(),
    });
    expect(session).toBeDefined();

    done();
  });

  it("Should return correctly when session is not found", async () => {
    mockSelectOne.mockImplementationOnce(
      () => new Promise((resolve) => resolve(null))
    );

    const body = request(app)
      .get(`/api/sessions/${uuid()}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(404)
      .then((res) => res.body);

    return expect(body).resolves.toEqual({
      session: null,
    });
  });
});
