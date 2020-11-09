import request from "supertest";
import app from "../../server";
import { Tasks, close } from "../../db";

afterAll(() => {
  close().then();
});

const task = {
  /* creation params here */
};

describe("Task create tests", () => {
  it("should create a task", async (done) => {
    const { body } = await request(app)
      .post("/api/tasks")
      .send(task)
      .expect(201);

    expect(await Tasks.selectAll()).toContainEqual({ id: body.id, ...task });
    done();
  });
  it("should not create a task", async (done) => {
    const res = await request(app).post("/api/tasks").expect(400);

    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    done();
  });
});
