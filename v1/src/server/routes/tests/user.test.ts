import request from "supertest";
import app from "../../server";
import { v4 as uuid } from "uuid";

// @ts-ignore
import { mockSelect as mockSessionSelect } from "../../db/models/session";
// @ts-ignore
import { mockSelect as mockProjectSelect } from "../../db/models/project";
// @ts-ignore
import { mockSelect as mockTaskSelect } from "../../db/models/task";

import {
  // @ts-ignore
  mockGetByFirebaseId,
  // @ts-ignore
  mockCreate,
  // @ts-ignore
  mockSelect,
} from "../../db/models/user";

// Set up mock
jest.mock("../../db/index");

beforeEach(() => jest.clearAllMocks());

const userId = uuid();

describe("Require Authentication", () => {
  it("Should require authorization on all paths", () => {
    return Promise.all([
      request(app)
        .get("/api/users")
        .set("X-Test-Suppress-Error-Logging", "true")
        .expect(401),
      request(app)
        .get("/api/users/sync")
        .set("X-Test-Suppress-Error-Logging", "true")
        .expect(401),
    ]);
  });
});

describe("POST users/login", () => {
  it("Should create new user", () => {
    const firebaseId = uuid();
    // If the user doesn't exist in the mock database, then that get function would return null
    mockGetByFirebaseId.mockImplementationOnce(async () => null);
    return request(app)
      .post("/api/users/login")
      .set("Authorization", `Bearer ${firebaseId}`)
      .expect(201);
  });
});

describe("GET users/", () => {
  it("Should call user model", async (done) => {
    const { user } = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userId}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockSelect).toHaveBeenCalled();
    expect(user).toBeDefined();
    done();
  });
});

describe("GET users/sync", () => {
  it("Should call all models", async (done) => {
    const sync_token = "2020-11-10T05:00:00.000Z";
    const { sessions, tasks, projects } = await request(app)
      .get(`/api/users/sync?sync_token=${sync_token}`)
      .set("Authorization", `Bearer ${userId}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockSessionSelect).toHaveBeenCalledWith(userId, {
      syncToken: sync_token,
    });
    expect(sessions).toBeDefined();
    expect(mockProjectSelect).toHaveBeenCalledWith(userId, {
      syncToken: sync_token,
    });
    expect(projects).toBeDefined();
    expect(mockTaskSelect).toHaveBeenCalledWith(userId, {
      syncToken: sync_token,
    });
    expect(tasks).toBeDefined();

    done();
  });

  it("Should return new sync token", async (done) => {
    const sync_token = "2020-11-10T05:00:00.000Z";
    const { syncToken } = await request(app)
      .get(`/api/users/sync?sync_token=${sync_token}`)
      .set("Authorization", `Bearer ${userId}`)
      .expect(200)
      .then((res) => res.body);

    expect(syncToken).toBeDefined();
    expect(syncToken).not.toEqual(sync_token);

    done();
  });

  it("Should return token even if one was not provided", () => {
    const syncToken = request(app)
      .get(`/api/users/sync`)
      .set("Authorization", `Bearer ${userId}`)
      .expect(200)
      .then((res) => res.body.syncToken);

    return expect(syncToken).resolves.toBeDefined();
  });

  it("Should rebound token if no record are found", () => {
    mockSessionSelect.mockImplementationOnce(async () => []);
    mockProjectSelect.mockImplementationOnce(async () => []);
    mockTaskSelect.mockImplementationOnce(async () => []);

    const sync_token = "2020-11-10T05:00:00.000Z";
    const syncToken = request(app)
      .get(`/api/users/sync?sync_token=${sync_token}`)
      .set("Authorization", `Bearer ${userId}`)
      .expect(200)
      .then((res) => res.body.syncToken);

    return expect(syncToken).resolves.toEqual(sync_token);
  });

  it('Should return "*" token if no records are found and no token was provided', () => {
    mockSessionSelect.mockImplementationOnce(async () => []);
    mockProjectSelect.mockImplementationOnce(async () => []);
    mockTaskSelect.mockImplementationOnce(async () => []);

    const syncToken = request(app)
      .get(`/api/users/sync`)
      .set("Authorization", `Bearer ${userId}`)
      .expect(200)
      .then((res) => res.body.syncToken);

    return expect(syncToken).resolves.toEqual("*");
  });
});

// describe("POST users/", () => {
//   it("should create a user", async (done) => {
//     const { body } = await request(app)
//       .post("/api/users")
//       .send(user)
//       .expect(201);
//
//     expect(await Users.selectAll()).toContainEqual({ id: body.id, ...user });
//     done();
//   });
//
//   it("should not create a user with a long name", async (done) => {
//     const res = await request(app)
//       .post("/api/users")
//       .send({ ...user, username: "".padEnd(31, "0") })
//       .expect(400);
//     expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
//
//     done();
//   });
//   it("should not create a user without a username", async (done) => {
//     const res = await request(app)
//       .post("/api/users")
//       .send({ email: user.email })
//       .expect(400);
//     expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
//     done();
//   });
//   it("should not create a user without an email", async (done) => {
//     const res = await request(app)
//       .post("/api/users")
//       .send({ username: user.username })
//       .expect(400);
//     expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
//     done();
//   });
// });
