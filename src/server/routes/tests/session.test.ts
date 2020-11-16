// @ts-nocheck
import request from "supertest";
import app from "../../server";
import {
  mockCreate,
  mockSelect,
  mockSelectOne,
  mockConnect,
  mockConnectCreate,
} from "../../db/models/session";
import { v4 as uuid } from "uuid";
import { createValidSession } from "../../../shared/utils/testing-helpers";

// Set up mock
jest.mock("../../db/index");

let user = { id: uuid() };

beforeEach(() => jest.clearAllMocks());

const validSession = createValidSession();

describe("Sessions - POST", () => {
  it("should create a session", async (done) => {
    await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .send(validSession)
      .expect(201);

    expect(mockConnectCreate).toHaveBeenCalledWith(user.id, {
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

    const response = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .send({ ...requestSession, task: requestTask })
      .expect(201);

    console.log(response);

    expect(mockConnectCreate).toHaveBeenCalledWith(user.id, {
      ...requestSession,
      startTimestamp: requestSession.startTimestamp.toISOString(),
      taskId: response.task.taskId,
    });

    expect(response).toEqual(
      expect.objectContaining({
        task: { taskId: expect.any(String) },
        session: requestSession,
      })
    );

    done();
  });
  it.todo("Should create a project if needed");
  it.todo("Should create a task and project if needed");
  it.todo("Should not create a session if project creation failed");
  it.todo("Should not create a session if task creation failed");

  // it("should not create a session", async (done) => {
  //   const res = await request(app).post("/api/sessions").expect(400);
  //
  //   expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
  //   done();
  // });
});
