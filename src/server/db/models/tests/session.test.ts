import { Sessions, pool, Projects, Tasks } from "../../index";
import { v4 as uuid } from "uuid";
import { ForeignKeyIntegrityConstraintViolationError, sql } from "slonik";
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
  insertTestSessions,
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

  it("should not create a session with a missing task", async () => {
    delete validSession.taskId;
    expect(() => Sessions.create(user.id, validSession)).toThrow(
      /"taskId" is required/
    );
  });

  it("Should fail gracefully when a non-existent user is provided", () => {
    const newSession = Sessions.create(uuid(), validSession);
    return expect(newSession).rejects.toThrow(
      ForeignKeyIntegrityConstraintViolationError
    );
  });
});

describe("Select All Sessions", () => {
  it("Should select all sessions for a user", async () => {
    const testSessions = await insertTestSessions(
      user.id,
      [{ type: "session" }, { type: "break" }, { type: "session" }],
      {
        defaults: { taskId: task.id },
      }
    );

    const sessions = Sessions.select(user.id);

    return expect(sessions).resolves.toEqual(
      arrayContainingObjectsContaining(testSessions)
    );
  });

  it("Should select only sessions modified after a given time", async (done) => {
    const testSessions = await insertTestSessions(
      user.id,
      [
        { type: "session" },
        { type: "break" },
        { type: "session" },
        { type: "long_break" },
      ],
      {
        sleep: 5,
        defaults: { taskId: task.id },
      }
    );

    const lastSession = testSessions.pop();

    if (!lastSession) {
      throw new Error(
        "Make sure there are at least 2 test sessions to work with"
      );
    }

    const syncToken = await getSyncTokenForSession(lastSession.id);

    const sessions = await Sessions.select(user.id, {
      syncToken,
    });

    expect(sessions).toEqual(arrayContainingObjectsContaining([lastSession]));

    expect(sessions).not.toEqual(
      arrayContainingObjectsContaining(testSessions)
    );

    done();
  });
});

describe("Select One Session", () => {
  it("Should return one session", async () => {
    const testSessions = await insertTestSessions(user.id, [{}, {}], {
      defaults: { taskId: task.id },
    });

    const selectedSession = testSessions.pop();

    if (!selectedSession || testSessions.length === 0) {
      throw new Error("testSessions should contain at least 2 sessions");
    }

    const session = Sessions.selectOne(user.id, selectedSession.id);

    return expect(session).resolves.toMatchObject(selectedSession);
  });

  it("Should not throw an error when no session is found", () => {
    const session = Sessions.selectOne(user.id, uuid());
    return expect(session).resolves.toBeFalsy();
  });
});
