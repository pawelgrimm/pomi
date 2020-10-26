import request from "supertest";
import app from "../../server";
import { sessions, close } from "../../db";
import { ClientSessionModel } from "../../../shared/models";

afterAll(() => {
  close().then();
});

const session: ClientSessionModel = {
  startTimestamp: "2020-10-23T19:59:29.853Z",
  endTimestamp: "2020-10-24T23:46:09.853Z",
  description: "Test session",
};

describe("Session create tests", () => {
  it("should create a session", async (done) => {
    const { body } = await request(app)
      .post("/api/sessions")
      .send(session)
      .expect(201);

    expect(await sessions.selectAll()).toContainEqual({
      id: body.id,
      start_timestamp: new Date(session.startTimestamp),
      description: session.description,
      duration:
        new Date(session.endTimestamp).valueOf() -
        new Date(session.startTimestamp).valueOf(),
    });
    done();
  });
  // it("should not create a session", async (done) => {
  //   const res = await request(app).post("/api/sessions").expect(400);
  //
  //   expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
  //   done();
  // });
});
