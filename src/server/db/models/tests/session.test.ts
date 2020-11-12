import { Sessions, pool, Projects, Tasks } from "../../index";
import { v4 as uuid } from "uuid";
import { NotNullIntegrityConstraintViolationError, sql } from "slonik";
import {
  ProjectModel,
  SessionModel,
  TaskModel,
  UserModel,
} from "../../../../shared/types";
import { resetTestDb } from "../../../setupTest";
import {
  arrayContainingObjectsContaining,
  getSyncTokenForObject,
  wrapObjectContaining,
} from "../../../../shared/utils";

import * as validators from "../../../../shared/validators";
const mockValidator = jest.spyOn(validators, "validateSession");

const getSyncTokenForSession = (sessionId: string) => {
  return getSyncTokenForObject("sessions", sessionId);
};

let user: Readonly<UserModel>;
let defaultProject: Readonly<Required<ProjectModel>>;
let project: typeof defaultProject;
let task: Readonly<Required<TaskModel>>;

beforeAll(() => {
  user = {
    id: uuid(),
    display_name: "sessionsTestUser",
    email: "sessions@example.com",
  };

  return new Promise(async (resolve) => {
    await resetTestDb();

    // create user
    await pool.query(sql`
        INSERT INTO users(id, display_name, email) 
        VALUES (${user.id}, ${user.display_name}, ${user.email});`);

    defaultProject = await Projects.create(user.id, {
      title: "default project",
    });

    // link default project
    await pool.query(sql`
        UPDATE users 
        SET default_project = ${defaultProject.id}
        WHERE id = ${user.id}
        RETURNING *;`);

    project = await Projects.create(user.id, {
      title: "test project",
    });

    task = await Tasks.create(user.id, {
      title: "test project",
      projectId: project.id,
    });

    resolve();
  });
});

afterAll(() => {
  return pool.end();
});

let validSession: SessionModel;

beforeEach(() => {
  mockValidator.mockClear();
  validSession = {
    taskId: task.id,
    startTimestamp: new Date("2020-11-12T21:27:10.359Z"),
    duration: 1234888,
    type: "session",
  };
});

describe("Create Session", () => {
  it("Should create a session", async () => {
    const newSession = await Sessions.create(user.id, validSession);
    const session = pool.one(sql`
        SELECT *
        FROM sessions
        WHERE id = ${newSession.id}`);
    expect(mockValidator).toHaveBeenCalledWith(validSession);
    return expect(session).resolves.toEqual(
      expect.objectContaining({
        ...validSession,
        id: newSession.id,
      })
    );
  });
  //
  //   it("Should create a project with the specified project", async () => {
  //     const specificSession = { ...validSession, projectId: project.id };
  //     const newSession = await Sessions.create(user.id, specificSession);
  //     const sessions = pool.any(sql`
  //         SELECT id, title, is_completed, project_id
  //         FROM sessions`);
  //     return expect(sessions).resolves.toContainEqual({
  //       ...specificSession,
  //       id: newSession.id,
  //     });
  //   });
  //
  //   it("Should create a session w/o optional values successfully", async () => {
  //     const newSession = await Sessions.create(user.id, {});
  //     const sessions = pool.any(sql`
  //         SELECT id, title, is_completed, project_id
  //         FROM sessions`);
  //     return expect(sessions).resolves.toContainEqual({
  //       id: newSession.id,
  //       isCompleted: false,
  //       title: "",
  //       projectId: defaultProject.id,
  //     });
  //   });
  //
  //   it("Should fail gracefully when a non-existent user is provided", () => {
  //     const newSession = Sessions.create(uuid(), validSession);
  //     return expect(newSession).rejects.toThrow(
  //       NotNullIntegrityConstraintViolationError
  //     );
  //   });
  // });
  //
  // describe("Select All Sessions", () => {
  //   it("Should select all sessions for a user", async () => {
  //     const testSessions = await insertTestSessions(user.id, [{}, {}]);
  //
  //     const sessions = Sessions.select(user.id);
  //
  //     return expect(sessions).resolves.toEqual(
  //       arrayContainingObjectsContaining(testSessions)
  //     );
  //   });
  //
  //   it("Should not select completed sessions by default", async (done) => {
  //     const testSessions = await insertTestSessions(user.id, [
  //       {},
  //       { isCompleted: true },
  //     ]);
  //     const [incompleteSession, completeSession] = testSessions;
  //
  //     const sessions = await Sessions.select(user.id);
  //
  //     expect(sessions).toEqual(
  //       arrayContainingObjectsContaining([incompleteSession])
  //     );
  //     expect(sessions).not.toEqual(
  //       arrayContainingObjectsContaining([completeSession])
  //     );
  //
  //     done();
  //   });
  //
  //   it("Should select completed sessions when instructed to", async () => {
  //     const testSessions = await insertTestSessions(user.id, [
  //       {},
  //       { isCompleted: true },
  //     ]);
  //
  //     const sessions = Sessions.select(user.id, {
  //       includeCompleted: true,
  //     });
  //
  //     return expect(sessions).resolves.toEqual(
  //       arrayContainingObjectsContaining(testSessions)
  //     );
  //   });
  //
  //   it("Should select only sessions modified after a given time", async (done) => {
  //     const testSessions = await insertTestSessions(user.id, [{}, {}, {}], {
  //       sleep: 5,
  //     });
  //
  //     const lastSession = testSessions.pop();
  //
  //     if (!lastSession) {
  //       throw new Error(
  //         "Make sure there are at least 2 test sessions to work with"
  //       );
  //     }
  //
  //     const syncToken = await getSyncTokenForSession(lastSession.id);
  //
  //     const sessions = await Sessions.select(user.id, {
  //       syncToken,
  //     });
  //
  //     expect(sessions).toEqual(arrayContainingObjectsContaining([lastSession]));
  //
  //     expect(sessions).not.toEqual(
  //       arrayContainingObjectsContaining(testSessions)
  //     );
  //
  //     done();
  //   });
  //
  //   it("Should always return completed sessions when using a sync token", async (done) => {
  //     const testSessions = await insertTestSessions(
  //       user.id,
  //       [{}, { isCompleted: true }, {}],
  //       { sleep: 5 }
  //     );
  //
  //     const oldSession = testSessions.shift();
  //     const [lastSession] = testSessions;
  //
  //     if (!oldSession || !lastSession || testSessions.length < 2) {
  //       throw new Error("testSessions must start with at least 3 sessions");
  //     }
  //
  //     const syncToken = await getSyncTokenForSession(lastSession.id);
  //
  //     const sessions = await Sessions.select(user.id, { syncToken });
  //
  //     expect(sessions).toEqual(arrayContainingObjectsContaining(testSessions));
  //     expect(sessions).not.toEqual(
  //       arrayContainingObjectsContaining([oldSession])
  //     );
  //
  //     done();
  //   });
});
//
// describe("Select One Session", () => {
//   it("Should return one session", async () => {
//     const testSessions = await insertTestSessions(user.id, [{}, {}]);
//     const selectedSession = testSessions.pop();
//
//     if (!selectedSession || testSessions.length === 0) {
//       throw new Error("testSessions should contain at least 2 sessions");
//     }
//
//     const session = Sessions.selectOne(user.id, selectedSession.id);
//
//     return expect(session).resolves.toMatchObject(selectedSession);
//   });
//
//   it("Should not throw an error when no session is found", () => {
//     const session = Sessions.selectOne(user.id, uuid());
//     return expect(session).resolves.toBeFalsy();
//   });
// });
