import { ProjectModel, SessionModel, TaskModel, UserModel } from "../../types";
import { pool, Projects, Sessions, Users } from "../../../server/db";
import { sql } from "slonik";
import { v4 as uuid } from "uuid";
import { User } from "../../../server/db/models";
import { parseISO, isValid } from "date-fns";

/**
 * Pause execution for the specified duration. Don't forget to add await, as this returns a Promise.
 * @param duration time to sleep in milliseconds
 */
export const sleep = (duration: number) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

/**
 * Wrap an array of objects in expect.objectContaining
 * @param objects an array of objects
 */
export const wrapObjectContaining = (objects: {}[]) =>
  objects.map((object) => expect.objectContaining(object));

/**
 * Wrap an array of objects in expect.objectContaining and wrap that in expect.arrayContaining
 * @param objects an array of objects
 */
export const arrayContainingObjectsContaining = (objects: {}[]) =>
  expect.arrayContaining(wrapObjectContaining(objects));

/**
 * Insert an array of projects into the test database and add newly generated id to the project
 * @param userId id of user to which these projects belong
 * @param testProjects an array of projects
 * @param options provide a sleep duration in milliseconds if desired
 */
export const insertTestProjects = async (
  userId: string,
  testProjects: ProjectModel[],
  options?: { sleep?: number; defaults?: {} }
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

/**
 * Insert an array of sessions into the test database and add newly generated id to the session
 * @param userId id of user to which these sessions belong
 * @param testSessions an array of sessions
 * @param options provide a sleep duration in milliseconds if desired
 */
export const insertTestSessions = async (
  userId: string,
  testSessions: Partial<SessionModel>[],
  options: {
    sleep?: number;
    defaults: Partial<SessionModel> & Required<Pick<SessionModel, "taskId">>;
  }
): Promise<Array<SessionModel & Required<Pick<SessionModel, "id">>>> => {
  const fallbacks: SessionModel = {
    startTimestamp: new Date(),
    duration: 454000,
    type: "session",
    ...options.defaults,
  };
  return Promise.all(
    testSessions.map(async (session, index) => {
      if (options?.sleep) {
        const sleepDuration = options.sleep * index;
        await sleep(sleepDuration);
      }

      return await Sessions.create(userId, {
        ...fallbacks,
        ...session,
      });
    })
  );
};

/**
 * Get the sync token corresponding to a project
 * @param projectId a project id
 */
export const getSyncTokenForProject = async (projectId: string) => {
  const lastModifiedTime = await pool.oneFirst<number>(sql`
        SELECT last_modified FROM projects
        WHERE id = ${projectId}
    `);

  //TODO: fix the slonic Date parser and remove this workaround
  return new Date(lastModifiedTime).toISOString();
};

/**
 * Get the sync token corresponding to an object
 * @param model name of the table the object is stored in
 * @param id the object's id
 */
export const getSyncTokenForObject = async (model: string, id: string) => {
  const table = sql.identifier([model]);
  // noinspection SqlResolve
  const lastModifiedTime = await pool.oneFirst<number>(sql`
        SELECT last_modified FROM ${table}
        WHERE id = ${id}
    `);

  //TODO: fix the slonic Date parser and remove this workaround
  return new Date(lastModifiedTime).toISOString();
};

/**
 * Insert an array of tasks into the test database and add newly generated id to the task
 * @param userId id of user to which these tasks belong
 * @param testTasks an array of tasks
 * @param options provide a sleep duration in milliseconds if desired
 */
export const insertTestTasks = async (
  userId: string,
  testTasks: TaskModel[],
  options?: { sleep?: number }
): Promise<Array<TaskModel & Required<Pick<TaskModel, "id">>>> => {
  return Promise.all(
    testTasks.map(async (task, index) => {
      if (options?.sleep) {
        const sleepDuration = options.sleep * index;
        await sleep(sleepDuration);
      }

      const {
        title = `task ${index + 1}`,
        isCompleted = false,
        projectId = null,
      } = task;

      const mark = Date.now();
      const { id, lastModified } = await pool.one(sql`
        INSERT INTO tasks(user_id, 
                          title, 
                          project_id, 
                          is_completed) 
        VALUES (${userId}, 
                ${title}, 
                COALESCE(${projectId}, (SELECT default_project FROM users WHERE id = ${userId})), 
                ${isCompleted})
        RETURNING id, last_modified;
      `);
      if (title === "debug") {
        console.log({
          index,
          mark,
          lastModified: lastModified.valueOf(),
          difference: lastModified.valueOf() - mark,
        });
      }
      return { ...task, id };
    })
  );
};

/**
 * Insert an array of users into the test database
 * @param testUsers an array of users
 */
export const insertTestUsers = async (
  testUsers: Partial<UserModel>[]
): Promise<Array<UserModel>> => {
  const randomId = uuid();
  const fallbacks: UserModel = {
    firebaseId: randomId,
    displayName: `user-${randomId}`,
    email: `${randomId}@example.com`,
  };

  return Promise.all(
    testUsers.map(async (user) => await Users.create({ ...fallbacks, ...user }))
  );
};

/**
 * Insert a user into the database
 */
export const insertTestUser = (
  overrideUserParams?: Partial<UserModel>,
  overrideDefaultProjectParams?: Partial<ProjectModel>
) => insertRandomTestUser(overrideUserParams, overrideDefaultProjectParams);

/**
 * Insert a random user into the database
 */
export const insertRandomTestUser = async (
  overrideUserParams: Partial<UserModel> = {},
  overrideDefaultProjectParams: Partial<ProjectModel> = {}
) => {
  const randomId = uuid();

  let user: UserModel & Required<Pick<UserModel, "firebaseId">> = {
    firebaseId: randomId,
    displayName: `user-${randomId}`,
    email: `${randomId}@example.com`,
    ...overrideUserParams,
  };

  user = await pool.one(sql`
        INSERT INTO users(firebase_id, display_name, email) 
        VALUES (${user.firebaseId}, ${user.displayName}, ${user.email})
        RETURNING id, firebase_id, display_name, email;`);

  if (!user.id) {
    throw new Error("User returned from database must have an id");
  }

  const defaultProject = await Projects.create(user.id, {
    title: "default project",
    ...overrideDefaultProjectParams,
  });

  return pool.one<Required<UserModel>>(sql`
        UPDATE users 
        SET default_project = ${defaultProject.id}
        WHERE id = ${user.id}
        RETURNING id, display_name, email, default_project;`);
};

/**
 * Create a new valid user
 */
export const createValidUser = (): UserModel => ({
  firebaseId: uuid(),
  displayName: "createValidUser",
  email: "createValidUser@example.com",
});

/**
 * Create a new valid project
 */
export const createValidProject = () => ({
  id: uuid(),
  title: "",
  isArchived: false,
});

/**
 * Create a new valid task
 */
export const createValidTask = () => ({
  id: uuid(),
  projectId: uuid(),
  isCompleted: false,
  title: "",
});

/**
 * Create a new valid session
 */
export const createValidSession = (): Required<SessionModel> => ({
  id: uuid(),
  taskId: uuid(),
  startTimestamp: new Date("2020-10-23T19:59:29.853Z"),
  duration: 500000,
  notes: "",
  type: "session",
  isRetroAdded: false,
  lastModified: new Date("2020-10-23T20:00:00.000Z"),
});

export const objectWithDatesAsStrings = (object: any) => {
  const newObject: any = {};
  Object.entries(object).forEach(([key, value]) => {
    let newValue = value;
    if (value instanceof Date) {
      newValue = value.toISOString();
    }
    newObject[key] = newValue;
  });
  return newObject;
};
