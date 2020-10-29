import request from "supertest";
import app from "../../server";
import { Projects, close } from "../../db";

afterAll(() => {
  close().then();
});

const project = {
  user_id: "234%^^%ssdfuser",
};

describe("Project create tests", () => {
  it("should create a project", async (done) => {
    const { body } = await request(app)
      .post("/api/projects")
      .send(project)
      .expect(201);

    expect(await Projects.selectAllByUser()).toContainEqual({
      id: body.id,
      ...project,
    });
    done();
  });
  it("should not create a project", async (done) => {
    const res = await request(app).post("/api/projects").expect(400);

    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    done();
  });
});
