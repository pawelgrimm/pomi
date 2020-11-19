import { Projects, pool } from "../../index";
import { v4 as uuid } from "uuid";
import { ForeignKeyIntegrityConstraintViolationError, sql } from "slonik";
import { ProjectModel, UserModel } from "../../../../shared/types";
import {
  arrayContainingObjectsContaining,
  getSyncTokenForProject,
  insertRandomTestUser,
  insertTestProjects,
} from "../../../../shared/utils";

import * as validators from "../../../../shared/validators";
const mockValidator = jest.spyOn(validators, "validateProject");

let user: Required<UserModel>;

beforeAll(async () => {
  user = await insertRandomTestUser();
});

afterAll(() => {
  return pool.end();
});

let validProject: ProjectModel;

beforeEach(() => {
  validProject = {
    title: "some title",
    isArchived: true,
  };
  mockValidator.mockClear();
});

describe("Create Project", () => {
  it("Should call the create function correctly", async () => {
    const newProject = await Projects.create(user.id, validProject);
    const projects = pool.any(
      sql`SELECT id, title, is_archived
            FROM projects`
    );
    expect(mockValidator).toHaveBeenCalledWith(validProject);
    return expect(projects).resolves.toContainEqual({
      ...validProject,
      id: newProject.id,
    });
  });
  it("Should create a project w/o optional values successfully", async () => {
    const newProject = await Projects.create(user.id, {});
    const projects = pool.any(
      sql`SELECT id, title, is_archived
            FROM projects`
    );
    return expect(projects).resolves.toContainEqual({
      id: newProject.id,
      isArchived: false,
      title: "",
    });
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

    const projects = Projects.select(user.id);

    return expect(projects).resolves.toEqual(
      arrayContainingObjectsContaining(testProjects)
    );
  });

  it("Should not select archived projects by default", async (done) => {
    const testProjects = await insertTestProjects(user.id, [
      {},
      { isArchived: true },
    ]);

    const projects = await Projects.select(user.id);

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

    const projects = Projects.select(user.id, {
      includeArchived: true,
    });

    return expect(projects).resolves.toEqual(
      arrayContainingObjectsContaining(testProjects)
    );
  });
  it("Should select only projects modified after a given time", async (done) => {
    const testProjects = await insertTestProjects(user.id, [{}, {}, {}], {
      sleep: 100,
    });

    const lastProject = testProjects.pop();

    if (!lastProject) {
      throw new Error(
        "Make sure there are at least 2 test projects to work with"
      );
    }

    const syncToken = await getSyncTokenForProject(lastProject.id);

    const projects = await Projects.select(user.id, {
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
      { sleep: 100 }
    );

    const oldProject = testProjects.shift();
    const [lastProject] = testProjects;

    if (!oldProject || !lastProject || testProjects.length < 2) {
      throw new Error("testProjects must start with at least 3 projects");
    }

    const syncToken = await getSyncTokenForProject(lastProject.id);

    const projects = await Projects.select(user.id, { syncToken });

    expect(projects).toEqual(arrayContainingObjectsContaining(testProjects));
    expect(projects).not.toEqual(
      arrayContainingObjectsContaining([oldProject])
    );

    done();
  });
});

describe("Select One Project", () => {
  it("Should return one project", async () => {
    const testProjects = await insertTestProjects(user.id, [{}, {}]);
    const selectedProject = testProjects.pop();

    if (!selectedProject || testProjects.length === 0) {
      throw new Error("testProjects should contain at least 2 projects");
    }

    const project = Projects.selectOne(user.id, selectedProject.id);

    return expect(project).resolves.toMatchObject(selectedProject);
  });
  it("Should not throw an error when no project is found", () => {
    const project = Projects.selectOne(user.id, uuid());
    return expect(project).resolves.toBeFalsy();
  });
});
