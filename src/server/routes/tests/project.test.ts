import request from "supertest";
import app from "../../server";
import { pool } from "../../db";
import { v4 as uuid } from "uuid";
import { resetTestDb } from "../../setupTest";
import { sql } from "slonik";
import { UserModel } from "../../../shared/models";
import {
  arrayContainingObjectsContaining,
  getSyncTokenForProject,
  insertTestProjects,
  wrapObjectContaining,
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
  return pool.end();
});

const validProject = {
  title: "a test project",
  isArchived: true,
};

describe("Authorization", () => {
  it("should require authorization on all paths", async (done) => {
    await request(app)
      .post("/api/projects")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    await request(app)
      .get("/api/projects")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    await request(app)
      .get("/api/projects/123")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
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
      .set("X-Test-Suppress-Error-Logging", "true")
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
  it("Should get all (unarchived) projects", async (done) => {
    const testProjects = await insertTestProjects(user.id, [{}, {}, {}]);
    const archivedProject = await insertTestProjects(user.id, [
      { isArchived: true },
    ]);

    const { body } = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(body).toEqual({
      projects: arrayContainingObjectsContaining(testProjects),
    });
    expect(body).not.toEqual({
      projects: arrayContainingObjectsContaining(archivedProject),
    });
    done();
  });
  it("Should get only new projects", async (done) => {
    const testProjects = await insertTestProjects(user.id, [{}, {}, {}], {
      sleep: 5,
    });

    const lastProject = testProjects.pop();

    if (!lastProject) {
      throw new Error("testProjects must have at least 2 projects");
    }

    const syncToken = await getSyncTokenForProject(lastProject.id);

    const { body } = await request(app)
      .get(`/api/projects?sync_token=${syncToken}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(body).toEqual({
      projects: arrayContainingObjectsContaining([lastProject]),
    });
    expect(body?.projects).not.toEqual(
      arrayContainingObjectsContaining(testProjects)
    );
    done();
  });
  it("A bad sync token should return a 422 error", async (done) => {
    const syncToken = "this-is-not-an-iso-8601-date";

    const { body } = await request(app)
      .get(`/api/projects?sync_token=${syncToken}`)
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(422);
    expect(body).toEqual({
      errors: {
        paths: arrayContainingObjectsContaining([
          {
            name: "syncToken",
            message: /could not be parsed/,
          },
        ]),
      },
    });
    done();
  });
  it("A bad value for includeArchived should return a 422 error", async (done) => {
    const { body } = await request(app)
      .get(`/api/projects?include_archived=tamales`)
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(422);

    expect(body).toEqual({
      errors: {
        paths: arrayContainingObjectsContaining([
          {
            name: "includeArchived",
            message: /could not be parsed/,
          },
        ]),
      },
    });
    done();
  });
  it("Should get projects including archived projects", async (done) => {
    const testProjects = await insertTestProjects(user.id, [
      {},
      { isArchived: true },
      {},
    ]);

    const { body } = await request(app)
      .get("/api/projects?include_archived=1")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(body).toEqual({
      projects: arrayContainingObjectsContaining(testProjects),
    });
    done();
  });
  it("Should return correctly when user has no projects", async (done) => {
    const userId = await pool.query(sql`INSERT INTO users(id, display_name, email) 
       VALUES (${uuid()}, 'new_user', 'anotheremailtest@example.com')`);

    const { body } = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${userId}`)
      .expect(404);

    expect(body).toEqual({
      projects: [],
    });
    done();
  });
});

describe("GET projects/:id", () => {
  it("Should get specific projects", async () => {
    await insertTestProjects(user.id, [{}, {}, {}]);
    const specificProject = await insertTestProjects(user.id, [
      { isArchived: true },
    ]);

    const body = request(app)
      .get(`/api/projects/${specificProject[0].id}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    return expect(body).resolves.toEqual({
      project: expect.objectContaining(specificProject[0]),
    });
  });
  it("Should return correctly when project is not found", async () => {
    await insertTestProjects(user.id, [{}, {}, {}]);

    const body = request(app)
      .get(`/api/projects/${uuid()}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(404)
      .then((res) => res.body);

    return expect(body).resolves.toEqual({
      project: null,
    });
  });
});