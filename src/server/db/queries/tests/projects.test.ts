import { Projects, pool } from "../../index";
import { v4 as uuid } from "uuid";
import { ForeignKeyIntegrityConstraintViolationError, sql } from "slonik";
import { ProjectModel, UserModel } from "../../../../shared/models";
import { resetTestDb } from "../../../setupTest";
import { sleep } from "../../../../shared/utils";

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

describe("Create Project", () => {
  it("Should create project successfully", async (done) => {
    const newProject = await Projects.create(user.id, validProject);
    const projects = await pool.any(
      sql`SELECT id, title, is_archived
            FROM projects`
    );
    expect(projects).toContainEqual({ ...validProject, id: newProject.id });
    done();
  });
  it("Should fail gracefully when a non-existent user is provided", () => {
    const newProject = Projects.create(uuid(), validProject);
    return expect(newProject).rejects.toThrow(
      ForeignKeyIntegrityConstraintViolationError
    );
  });
});

describe("Select All Projects", () => {
  it("Should select all projects for a user", async (done) => {
    const testProjects = [
      { title: "project 1", id: "" },
      { title: "project 2", id: "" },
    ];
    for (const project of testProjects) {
      project.id = await pool.oneFirst<string>(sql`
        INSERT INTO projects(user_id, title) 
        VALUES (${user.id}, ${project.title})
        RETURNING id;
      `);
    }

    const projects = await Projects.selectAll(user.id);

    expect(projects).toEqual(
      expect.arrayContaining(
        testProjects.map((p) => expect.objectContaining(p))
      )
    );

    done();
  });
  it("Should not select archived projects by default", async (done) => {
    const testProjects = [
      { title: "project 1", id: "", isArchived: false },
      { title: "project 2", id: "", isArchived: true },
    ];

    for (const project of testProjects) {
      project.id = await pool.oneFirst<string>(sql`
        INSERT INTO projects(user_id, title, is_archived) 
        VALUES (${user.id}, ${project.title}, ${project.isArchived})
        RETURNING id;
      `);
    }

    const projects = await Projects.selectAll(user.id);

    expect(projects).toContainEqual(testProjects[0]);
    expect(projects).not.toContainEqual(testProjects[1]);

    done();
  });
  it("Should select archived projects when instructed to", async (done) => {
    const testProjects = [
      { title: "project 1", id: "", isArchived: false },
      { title: "project 2", id: "", isArchived: true },
    ];

    for (const project of testProjects) {
      project.id = await pool.oneFirst<string>(sql`
        INSERT INTO projects(user_id, title, is_archived) 
        VALUES (${user.id}, ${project.title}, ${project.isArchived})
        RETURNING id;
      `);
    }

    const projects = await Projects.selectAll(user.id, {
      includeArchived: true,
    });

    expect(projects).toEqual(
      expect.arrayContaining(
        testProjects.map((p) => expect.objectContaining(p))
      )
    );

    done();
  });
  it("Should select only projects modified after a given time", async (done) => {
    const testProjects = [
      { title: "project 1", id: "" },
      { title: "project 2", id: "" },
      { title: "project 3", id: "" },
    ];

    for (const project of testProjects) {
      project.id = await pool.oneFirst<string>(sql`
        INSERT INTO projects(user_id, title) 
        VALUES (${user.id}, ${project.title})
        RETURNING id;
      `);
      await sleep(5);
    }

    const lastModifiedTime = await pool.oneFirst<number>(sql`
        SELECT last_modified FROM projects
        WHERE id = ${testProjects[2].id}
    `);

    //TODO: fix the slonic Date parser and remove this workaround
    const syncToken = new Date(lastModifiedTime).toISOString();

    const projects = await Projects.selectAll(user.id, {
      syncToken,
    });

    expect(projects).toEqual(
      expect.arrayContaining([expect.objectContaining(testProjects[2])])
    );

    expect(projects).toEqual(
      expect.not.arrayContaining([
        ...testProjects.slice(0, 2).map((p) => expect.objectContaining(p)),
      ])
    );

    done();
  });

  it.todo("Should always return archived projects when using a sync token");
});
