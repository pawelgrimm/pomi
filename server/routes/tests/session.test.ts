import request from "supertest";
import app from "../../server";
import { sessions, close } from "../../db";

afterAll(() => {
  close().then();
});

const session = {
  /* creation params here */
};

describe("Session create tests", () => {
  it("should create a session", async (done) => {
    const { body } = await request(app)
      .post("/api/sessions")
      .send(session)
      .expect(201);

    expect(await sessions.selectAll()).toContainEqual({
      id: body.id,
      ...session,
    });
    done();
  });
  it("should not create a session", async (done) => {
    const res = await request(app).post("/api/sessions").expect(400);

    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    done();
  });
});
