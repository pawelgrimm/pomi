import { Tasks, pool } from "../../index";
import { v4 as uuid } from "uuid";
import { NotNullIntegrityConstraintViolationError, sql } from "slonik";
import { ProjectModel, TaskModel, UserModel } from "../../../../shared/types";
import { resetTestDb } from "../../../setupTest";
import {
  arrayContainingObjectsContaining,
  getSyncTokenForObject,
  insertTestTasks,
} from "../../../../shared/utils";

import * as validators from "../../../../shared/validators";
const mockValidator = jest.spyOn(validators, "validateTask");

const getSyncTokenForTask = (taskId: string) => {
  return getSyncTokenForObject("tasks", taskId);
};

let user: UserModel;
let defaultProject: ProjectModel & Required<Pick<ProjectModel, "title">>;
let project: typeof defaultProject;

beforeAll(() => {
  user = {
    id: uuid(),
    display_name: "tasksTestUser",
    email: "tasks@example.com",
  };

  defaultProject = {
    title: "default project",
  };
  project = {
    title: "test project",
  };

  return new Promise(async (resolve) => {
    await resetTestDb();

    // create user
    await pool.query(sql`
        INSERT INTO users(id, display_name, email) 
        VALUES (${user.id}, ${user.display_name}, ${user.email});`);

    // create default project
    const newProjects = await pool.many(
      sql`
        INSERT INTO projects(user_id, title) 
        VALUES  (${user.id}, ${defaultProject.title}),
                (${user.id}, ${project.title})
        RETURNING id;`
    );

    defaultProject.id = newProjects[0].id as string;
    project.id = newProjects[1].id as string;

    if (!defaultProject.id || !defaultProject.id) {
      throw new Error(
        "Something went wrong during project creation in beforeAll"
      );
    }

    // link default project
    await pool.query(sql`
        UPDATE users 
        SET default_project = ${defaultProject.id}
        WHERE id = ${user.id}
        RETURNING *;`);

    resolve();
  });
});

afterAll(() => {
  return pool.end();
});

let validTask: TaskModel;

beforeEach(() => {
  validTask = {
    title: "some title",
    isCompleted: true,
  };
  mockValidator.mockClear();
});

describe("Create Task", () => {
  it("Should create a task, using the default project", async () => {
    const newTask = await Tasks.create(user.id, validTask);
    const tasks = pool.any(sql`
        SELECT id, title, is_completed, project_id
        FROM tasks`);
    expect(mockValidator).toHaveBeenCalledWith(validTask);
    return expect(tasks).resolves.toContainEqual({
      ...validTask,
      projectId: defaultProject.id,
      id: newTask.id,
    });
  });

  it("Should create a project with the specified project", async () => {
    const specificTask = { ...validTask, projectId: project.id };
    const newTask = await Tasks.create(user.id, specificTask);
    const tasks = pool.any(sql`
        SELECT id, title, is_completed, project_id
        FROM tasks`);
    return expect(tasks).resolves.toContainEqual({
      ...specificTask,
      id: newTask.id,
    });
  });

  it("Should create a task w/o optional values successfully", async () => {
    const newTask = await Tasks.create(user.id, {});
    const tasks = pool.any(sql`
        SELECT id, title, is_completed, project_id
        FROM tasks`);
    return expect(tasks).resolves.toContainEqual({
      id: newTask.id,
      isCompleted: false,
      title: "",
      projectId: defaultProject.id,
    });
  });

  it("Should fail gracefully when a non-existent user is provided", () => {
    const newTask = Tasks.create(uuid(), validTask);
    return expect(newTask).rejects.toThrow(
      NotNullIntegrityConstraintViolationError
    );
  });
});

describe("Select All Tasks", () => {
  it("Should select all tasks for a user", async () => {
    const testTasks = await insertTestTasks(user.id, [{}, {}]);

    const tasks = Tasks.select(user.id);

    return expect(tasks).resolves.toEqual(
      arrayContainingObjectsContaining(testTasks)
    );
  });

  it("Should not select completed tasks by default", async (done) => {
    const testTasks = await insertTestTasks(user.id, [
      {},
      { isCompleted: true },
    ]);
    const [incompleteTask, completeTask] = testTasks;

    const tasks = await Tasks.select(user.id);

    expect(tasks).toEqual(arrayContainingObjectsContaining([incompleteTask]));
    expect(tasks).not.toEqual(arrayContainingObjectsContaining([completeTask]));

    done();
  });

  it("Should select completed tasks when instructed to", async () => {
    const testTasks = await insertTestTasks(user.id, [
      {},
      { isCompleted: true },
    ]);

    const tasks = Tasks.select(user.id, {
      includeCompleted: true,
    });

    return expect(tasks).resolves.toEqual(
      arrayContainingObjectsContaining(testTasks)
    );
  });

  it("Should select only tasks modified after a given time", async (done) => {
    const testTasks = await insertTestTasks(user.id, [{}, {}, {}], {
      sleep: 5,
    });

    const lastTask = testTasks.pop();

    if (!lastTask) {
      throw new Error("Make sure there are at least 2 test tasks to work with");
    }

    const syncToken = await getSyncTokenForTask(lastTask.id);

    const tasks = await Tasks.select(user.id, {
      syncToken,
    });

    expect(tasks).toEqual(arrayContainingObjectsContaining([lastTask]));

    expect(tasks).not.toEqual(arrayContainingObjectsContaining(testTasks));

    done();
  });

  it("Should always return completed tasks when using a sync token", async (done) => {
    const testTasks = await insertTestTasks(
      user.id,
      [{}, { isCompleted: true }, {}],
      { sleep: 5 }
    );

    const oldTask = testTasks.shift();
    const [lastTask] = testTasks;

    if (!oldTask || !lastTask || testTasks.length < 2) {
      throw new Error("testTasks must start with at least 3 tasks");
    }

    const syncToken = await getSyncTokenForTask(lastTask.id);

    const tasks = await Tasks.select(user.id, { syncToken });

    expect(tasks).toEqual(arrayContainingObjectsContaining(testTasks));
    expect(tasks).not.toEqual(arrayContainingObjectsContaining([oldTask]));

    done();
  });
});

describe("Select One Task", () => {
  it("Should return one task", async () => {
    const testTasks = await insertTestTasks(user.id, [{}, {}]);
    const selectedTask = testTasks.pop();

    if (!selectedTask || testTasks.length === 0) {
      throw new Error("testTasks should contain at least 2 tasks");
    }

    const task = Tasks.selectOne(user.id, selectedTask.id);

    return expect(task).resolves.toMatchObject(selectedTask);
  });

  it("Should not throw an error when no task is found", () => {
    const task = Tasks.selectOne(user.id, uuid());
    return expect(task).resolves.toBeFalsy();
  });
});
