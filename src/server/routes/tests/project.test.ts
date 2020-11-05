import request from "supertest";
import app from "../../server";
import { close, pool } from "../../db";
import { v4 as uuid } from "uuid";
import { resetTestDb } from "../../setupTest";
import { sql } from "slonik";
import { UserModel } from "../../../shared/models";
import {
  arrayContainingObjectsContaining,
  insertTestProjects,
} from "../../../shared/utils";

let user: UserModel;

beforeAll(() => {
  user = {
    id: uuid(),
    display_name: "projectsTestUser",
    email: "projects@example.com",
  };

  return new Promise(async (resolve) => {
    await resetTestDb();
    await pool.query(
      sql`INSERT INTO users(id, display_name, email) VALUES (${user.id}, ${user.display_name}, ${user.email})`
    );
    resolve();
  });
});

afterAll(() => {
  close().then();
});

const validProject = {
  title: "a test project",
  isArchived: true,
};

describe("Authorization", () => {
  it("should require authorization on all paths", async (done) => {
    await request(app).post("/api/projects").expect(401);
    await request(app).get("/api/projects").expect(401);
    await request(app).get("/api/projects/123").expect(401);
    done();
  });
});

describe("POST project/", () => {
  it("should create a project", async (done) => {
    const { body } = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${user.id}`)
      .send(validProject)
      .expect(201);

    expect(body).toEqual(
      expect.objectContaining({
        project: {
          id: expect.any(String),
          ...validProject,
        },
      })
    );
    done();
  });

  it("should not create a project", async (done) => {
    const { body } = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Options", JSON.stringify({ suppressErrorLogging: true }))
      .send({ isArchived: "black beans" })
      .expect(422);

    expect(body).toEqual(
      expect.objectContaining({
        errors: expect.any(Array),
      })
    );
    done();
  });
});

describe("GET projects/", () => {
  it("Should get all projects", async (done) => {
    const testProjects = await insertTestProjects(user.id, [{}, {}, {}]);

    const { body } = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(body).toEqual({
      projects: arrayContainingObjectsContaining(testProjects),
    });
    done();
  });
  it.todo("Should get new projects");
  it.todo("Should get projects including archived projects");
  it.todo("Should return correctly when user has no projects");
});

describe("GET projects/:id", () => {
  it.todo("Should get specific projects");
  it.todo("Should return correctly when project is not found");
});
