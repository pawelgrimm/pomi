import { Projects, pool } from "../../index";
import { v4 as uuid } from "uuid";
import { sql } from "slonik";
import { ProjectModel, UserModel } from "../../../../shared/models";
import { resetTestDb } from "../../../setupTest";

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

let validProject: ProjectModel;

beforeEach(() => {
  validProject = {
    title: "some title",
    isArchived: true,
  };
});

describe("Project Queries", () => {
  it("Should create project successfully", async (done) => {
    const newProject = await Projects.create(user.id, validProject);
    const projects = await pool.any(
      sql`SELECT id, title, is_archived FROM projects`
    );
    expect(projects).toContainEqual({ ...validProject, id: newProject.id });
    done();
  });
});
