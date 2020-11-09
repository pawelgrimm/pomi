import request from "supertest";
import app from "../../server";
import { Users } from "../../db";

const user = {
  username: "Test User",
  email: "test@example.com",
};

describe("User create tests", () => {
  it("should create a user", async (done) => {
    const { body } = await request(app)
      .post("/api/users")
      .send(user)
      .expect(201);

    expect(await Users.selectAll()).toContainEqual({ id: body.id, ...user });
    done();
  });

  it("should not create a user with a long name", async (done) => {
    const res = await request(app)
      .post("/api/users")
      .send({ ...user, username: "".padEnd(31, "0") })
      .expect(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);

    done();
  });
  it("should not create a user without a username", async (done) => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: user.email })
      .expect(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    done();
  });
  it("should not create a user without an email", async (done) => {
    const res = await request(app)
      .post("/api/users")
      .send({ username: user.username })
      .expect(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    done();
  });
});
