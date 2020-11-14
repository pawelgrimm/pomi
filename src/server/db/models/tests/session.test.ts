import { Sessions, pool, Projects, Tasks, Users } from "../../index";
import { v4 as uuid } from "uuid";
import { add, sub } from "date-fns";
import { ForeignKeyIntegrityConstraintViolationError, sql } from "slonik";
import {
  ProjectModel,
  SessionModel,
  TaskModel,
  UserModel,
} from "../../../../shared/types";
import {
  arrayContainingObjectsContaining,
  getSyncTokenForObject,
  insertTestSessions,
  wrapObjectContaining,
} from "../../../../shared/utils";

import * as validators from "../../../../shared/validators";
import { insertRandomTestUser } from "../../../../shared/utils/testing-helpers";
import { Method } from "../../../../shared/validators/shared";
const mockValidator = jest.spyOn(validators, "validateSession");

const getSyncTokenForSession = (sessionId: string) => {
  return getSyncTokenForObject("sessions", sessionId);
};

let user: Readonly<UserModel>;
let otherUser: typeof user;
let project: Readonly<Required<ProjectModel>>;
let task: Readonly<Required<TaskModel>>;
let otherUserTask: typeof task;

beforeAll(() => {
  return new Promise(async (resolve) => {
    user = await insertRandomTestUser();
    otherUser = await insertRandomTestUser();

    project = await Projects.create(user.id, {
      title: "test project",
    });

    task = await Tasks.create(user.id, {
      title: "test project",
      projectId: project.id,
    });

    otherUserTask = await Tasks.create(otherUser.id, {
      title: "test project",
    });

    resolve();
  });
});

afterAll(() => {
  return pool.end();
});

let validSession: SessionModel;

const createValidSession = (): SessionModel => ({
  taskId: task.id,
  startTimestamp: new Date("2020-11-12T21:27:10.359Z"),
  duration: 1234888,
  type: "session",
});

beforeEach(() => {
  mockValidator.mockClear();
  validSession = createValidSession();
});

const setupTimedSessions = async (referenceTimestamp: string) => {
  const reference = new Date(referenceTimestamp);
  const before = sub(reference, { hours: 1 });
  const beforeBefore = sub(reference, { hours: 2 });
  const after = add(reference, { hours: 1 });
  const afterAfter = add(reference, { hours: 2 });

  const testSessions = await insertTestSessions(
    user.id,
    [
      { startTimestamp: beforeBefore },
      { startTimestamp: before },
      { startTimestamp: reference },
      { startTimestamp: after },
      { startTimestamp: afterAfter },
    ],
    { defaults: { taskId: task.id } }
  );

  const timedSessions = new Map<
    Date,
    SessionModel & Required<Pick<SessionModel, "id">>
  >();

  testSessions.forEach((session) =>
    timedSessions.set(session.startTimestamp, session)
  );

  const sortedKeys = Array.from(timedSessions.keys()).sort();

  return { timedSessions, sortedKeys };
};

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

  it("Should not allow userId and taskId->task->userId mismatch", async () => {
    return expect(() =>
      Sessions.create(user.id, {
        ...validSession,
        taskId: otherUserTask.id,
      })
    ).rejects.toThrow(ForeignKeyIntegrityConstraintViolationError);
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

  it("Should not return sessions from another user", async () => {
    const otherSessions = await insertTestSessions(otherUser.id, [{}, {}, {}], {
      defaults: { taskId: otherUserTask.id },
    });

    return expect(Sessions.select(user.id)).resolves.not.toEqual(
      arrayContainingObjectsContaining(otherSessions)
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
        sleep: 100,
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

  it("Should only return sessions with startTimes in the provided range: start", async (done) => {
    const { timedSessions, sortedKeys } = await setupTimedSessions(
      new Date().toISOString()
    );

    const after = sortedKeys[2];
    let sessionsAfter: (SessionModel &
      Required<Pick<SessionModel, "id">>)[] = [];
    let sessionsBefore: typeof sessionsAfter = [];
    sortedKeys.forEach((timestamp) => {
      const date = timedSessions.get(timestamp);
      if (date) {
        if (timestamp >= after) {
          sessionsAfter.push(date);
        } else {
          sessionsBefore.push(date);
        }
      }
    });

    const sessions = await Sessions.select(user.id, { start: after });

    expect(sessions).toEqual(arrayContainingObjectsContaining(sessionsAfter));
    expect(sessions).not.toEqual(
      arrayContainingObjectsContaining(sessionsBefore)
    );

    done();
  });

  it("Should only return sessions with startTimes in the provided range: end", async (done) => {
    const { timedSessions, sortedKeys } = await setupTimedSessions(
      new Date().toISOString()
    );

    const before = sortedKeys[4];
    let sessionsAfter: (SessionModel &
      Required<Pick<SessionModel, "id">>)[] = [];
    let sessionsBefore: typeof sessionsAfter = [];
    sortedKeys.forEach((timestamp) => {
      const date = timedSessions.get(timestamp);
      if (date) {
        if (timestamp < before) {
          sessionsBefore.push(date);
        } else {
          sessionsAfter.push(date);
        }
      }
    });

    const sessions = await Sessions.select(user.id, { end: before });

    expect(sessions).toEqual(arrayContainingObjectsContaining(sessionsBefore));
    expect(sessions).not.toEqual(
      arrayContainingObjectsContaining(sessionsAfter)
    );

    done();
  });

  it("Should only return sessions with startTimes in the provided range: start and end", async (done) => {
    const { timedSessions, sortedKeys } = await setupTimedSessions(
      new Date().toISOString()
    );

    const after = sortedKeys[1];
    const before = sortedKeys[3];
    let sessionsIn: (SessionModel & Required<Pick<SessionModel, "id">>)[] = [];
    let sessionsOut: typeof sessionsIn = [];
    sortedKeys.forEach((timestamp) => {
      const date = timedSessions.get(timestamp);
      if (date) {
        if (timestamp >= after && timestamp < before) {
          sessionsIn.push(date);
        } else {
          sessionsOut.push(date);
        }
      }
    });

    const sessions = await Sessions.select(user.id, {
      start: after,
      end: before,
    });

    expect(sessions).toEqual(arrayContainingObjectsContaining(sessionsIn));
    expect(sessions).toEqual(
      expect.not.arrayContaining(wrapObjectContaining(sessionsOut))
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

describe("Update Session", () => {
  it("Should update allowed fields successfully", async () => {
    const insertedSession = await Sessions.create(user.id, validSession);
    const updatedSession = {
      taskId: insertedSession.taskId,
      startTimestamp: new Date("2020-11-18T18:00:00.000Z"),
      duration: 522200000,
      type: "long_break",
      notes: "this is a new note",
    };

    return expect(
      Sessions.update(user.id, insertedSession.id, updatedSession)
    ).resolves.toMatchObject(updatedSession);
  });

  it("Should call validateSession", async () => {
    const session = await Sessions.create(user.id, validSession);
    mockValidator.mockClear();
    const sessionUpdates = { type: session.type };
    await Sessions.update(user.id, session.id, sessionUpdates);
    return expect(mockValidator).toHaveBeenCalledWith(
      sessionUpdates,
      Method.PARTIAL
    );
  });

  it("Should not set disallowed fields", async () => {
    const session = await Sessions.create(user.id, validSession);
    const sessionUpdates = { isRetroAdded: false };
    return expect(() =>
      Sessions.update(user.id, session.id, sessionUpdates)
    ).rejects.toThrow(/"isRetroAdded" is not allowed/);
  });

  it("Should not allow userId and taskId->task->userId mismatch", async () => {
    const session = await Sessions.create(user.id, validSession);

    return expect(() =>
      Sessions.update(user.id, session.id, { taskId: otherUserTask.id })
    ).rejects.toThrow(ForeignKeyIntegrityConstraintViolationError);
  });
});
