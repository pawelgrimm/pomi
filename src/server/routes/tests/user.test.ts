import request from "supertest";
import app from "../../server";
import { v4 as uuid } from "uuid";

// @ts-ignore
import { mockSelect as mockSessionSelect } from "../../db/models/session";
// @ts-ignore
import { mockSelect as mockProjectSelect } from "../../db/models/project";
// @ts-ignore
import { mockSelect as mockTaskSelect } from "../../db/models/task";

// Set up mock
jest.mock("../../db/index");

beforeEach(() => jest.clearAllMocks());

const user = { id: uuid() };

describe("Require Authentication", () => {});

describe("GET users/", () => {
  it.todo("simple get test");
});

describe("GET users/sync", () => {
  it("Should call all models", async (done) => {
    const sync_token = "2020-11-10T05:00:00.000Z";
    const { sessions, tasks, projects } = await request(app)
      .get(`/api/users/sync?sync_token=${sync_token}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockSessionSelect).toHaveBeenCalledWith(user.id, {
      syncToken: sync_token,
    });
    expect(sessions).toBeDefined();
    expect(mockProjectSelect).toHaveBeenCalledWith(user.id, {
      syncToken: sync_token,
    });
    expect(projects).toBeDefined();
    expect(mockTaskSelect).toHaveBeenCalledWith(user.id, {
      syncToken: sync_token,
    });
    expect(tasks).toBeDefined();

    done();
  });

  it("Should return new sync token", async (done) => {
    const sync_token = "2020-11-10T05:00:00.000Z";
    const { syncToken } = await request(app)
      .get(`/api/users/sync?sync_token=${sync_token}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    expect(syncToken).toBeDefined();
    expect(syncToken).not.toEqual(sync_token);

    done();
  });
  it("Should return token even if one was not provided", () => {
    const syncToken = request(app)
      .get(`/api/users/sync`)
      .set("Authorization", `Bearer ${user.id}`)
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
      .set("Authorization", `Bearer ${user.id}`)
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
      .set("Authorization", `Bearer ${user.id}`)
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
