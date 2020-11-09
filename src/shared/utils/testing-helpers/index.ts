import { ProjectModel } from "../../types";
import { pool } from "../../../server/db";
import { sql } from "slonik";

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
