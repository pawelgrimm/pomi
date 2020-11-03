import { Projects, pool } from "../../index";
import { v4 as uuid } from "uuid";
import { ForeignKeyIntegrityConstraintViolationError, sql } from "slonik";
import { ProjectModel, UserModel } from "../../../../shared/models";
import { resetTestDb } from "../../../setupTest";
import {
  arrayContainingObjectsContaining,
  sleep,
} from "../../../../shared/utils";

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
  it("Should select all projects for a user", async () => {
    const testProjects = await insertTestProjects(user.id, [{}, {}]);

    const projects = Projects.selectAll(user.id);

    return expect(projects).resolves.toEqual(
      arrayContainingObjectsContaining(testProjects)
    );
  });

  it("Should not select archived projects by default", async (done) => {
    const testProjects = await insertTestProjects(user.id, [
      {},
      { isArchived: true },
    ]);

    const projects = await Projects.selectAll(user.id);

    expect(projects).toEqual(
      arrayContainingObjectsContaining([testProjects[0]])
    );
    expect(projects).not.toEqual(
      arrayContainingObjectsContaining([testProjects[1]])
    );

    done();
  });
  it("Should select archived projects when instructed to", async () => {
    const testProjects = await insertTestProjects(user.id, [
      {},
      { isArchived: true },
    ]);

    const projects = Projects.selectAll(user.id, {
      includeArchived: true,
    });

    return expect(projects).resolves.toEqual(
      arrayContainingObjectsContaining(testProjects)
    );
  });
  it("Should select only projects modified after a given time", async (done) => {
    const testProjects = await insertTestProjects(user.id, [{}, {}, {}], {
      sleep: 5,
    });

    const lastProject = testProjects.pop();

    if (!lastProject) {
      throw new Error(
        "Make sure there are at least 2 test projects to work with"
      );
    }

    const lastModifiedTime = await pool.oneFirst<number>(sql`
        SELECT last_modified FROM projects
        WHERE id = ${lastProject.id}
    `);

    //TODO: fix the slonic Date parser and remove this workaround
    const syncToken = new Date(lastModifiedTime).toISOString();

    const projects = await Projects.selectAll(user.id, {
      syncToken,
    });

    expect(projects).toEqual(arrayContainingObjectsContaining([lastProject]));

    expect(projects).not.toEqual(
      arrayContainingObjectsContaining(testProjects)
    );

    done();
  });

  it("Should always return archived projects when using a sync token", async (done) => {
    const testProjects = await insertTestProjects(
      user.id,
      [{}, { isArchived: true }, {}],
      { sleep: 5 }
    );

    const oldProject = testProjects.shift();
    const [lastProject] = testProjects;

    if (!oldProject || !lastProject || testProjects.length < 2) {
      throw new Error("testProjects must start with at least 3 projects");
    }

    const lastModifiedTime = await pool.oneFirst<number>(sql`
        SELECT last_modified FROM projects
        WHERE id = ${lastProject.id}
    `);

    //TODO: fix the slonic Date parser and remove this workaround
    const syncToken = new Date(lastModifiedTime).toISOString();

    const projects = await Projects.selectAll(user.id, { syncToken });

    expect(projects).toEqual(arrayContainingObjectsContaining(testProjects));
    expect(projects).not.toEqual(
      arrayContainingObjectsContaining([oldProject])
    );

    done();
  });
});

/**
 * Insert an array of projects into the test database and add newly generated id to the project
 * @param userId id of user to which these projects belong
 * @param testProjects an array of projects
 * @param options provide a sleep duration in milliseconds if desired
 */
const insertTestProjects = async (
  userId: string,
  testProjects: ProjectModel[],
  options?: { sleep?: number }
): Promise<Array<ProjectModel & Required<Pick<ProjectModel, "id">>>> => {
  return Promise.all(
    testProjects.map(async (project, index) => {
      if (options?.sleep) {
        const sleepDuration = options.sleep * index;
        await sleep(sleepDuration);
      }

      const { title = `project ${index + 1}`, isArchived = false } = project;

      const id = await pool.oneFirst<string>(sql`
        INSERT INTO projects(user_id, title, is_archived) 
        VALUES (${userId}, ${title}, ${isArchived})
        RETURNING id;
      `);

      return { ...project, id };
    })
  );
};
