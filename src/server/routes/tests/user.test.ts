import request from "supertest";
import app from "../../server";
import { v4 as uuid } from "uuid";
import { Users } from "../../db";
// @ts-ignore
import { mockSelect as mockSessionSelect } from "../../db/models/session";
// @ts-ignore
import { mockSelect as mockProjectSelect } from "../../db/models/project";
// @ts-ignore
import { mockSelect as mockTaskSelect } from "../../db/models/project";

// Set up mock
jest.mock("../../db/index");

beforeEach(() => jest.clearAllMocks());

describe("GET users/", () => {
  it.todo("simple get test");
});

describe("GET users/sync", () => {
  it.todo("make sure all models are called");
  it.todo("make sure new sync token is returned");
  it.todo("make sure new sync token is returned even if one wasn't provided");
  it.todo("make sure sync token is rebounded if no new records are found");
  it.todo(
    "make sure * sync token is returned if no token is provided and no records are found"
  );
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
