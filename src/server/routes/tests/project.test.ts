import request from "supertest";
import app from "../../server";
import { Projects, close } from "../../db";

afterAll(() => {
  close().then();
});

const userId = "8e290323-6f92-441a-a946-efff804944cf";

const testProject = {
  title: "a test project",
};

describe("Project create tests", () => {
  it("should create a project", async (done) => {
    const { body } = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${userId}`)
      .send(testProject)
      .expect(201);

    expect(body).toContainEqual({
      project: {
        id: expect.any(String),
        isArchived: false,
        ...testProject,
      },
    });

    expect(await Projects.selectAll(userId)).toContainEqual({
      project: {
        id: expect.any(String),
        isArchived: false,
        ...testProject,
      },
    });
    done();
  });
  it("should not create a project", async (done) => {
    const res = await request(app).post("/api/projects").expect(400);

    expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
    done();
  });
});
