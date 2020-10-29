import { differenceInMilliseconds } from "date-fns";
import { validateClientSession, hydrateDatabaseSession } from "../session";
import { ClientSessionModel, DatabaseSessionModel } from "../../models";

let validClientSession: ClientSessionModel;
let validDatabaseSession: Omit<DatabaseSessionModel, "start_timestamp"> & {
  start_timestamp: string;
};
beforeEach(() => {
  validClientSession = {
    userId: "sodf5%$32random",
    taskId: 456,
    startTimestamp: new Date("2020-10-23T15:00:00.000Z"),
    endTimestamp: new Date("2020-10-23T16:00:00.000Z"),
    type: "break",
  };
  validDatabaseSession = {
    id: 123,
    user_id: "sodf5%$32random",
    task_id: 457,
    start_timestamp: "2020-10-23T15:00:00.000Z",
    duration: 3600000,
    type: "break",
    retro_added: false,
  };
});

describe("Session Validator (client to database)", () => {
  it("Should require correct fields and return correct object", () => {
    const validatedSession = validateClientSession(validClientSession);
    const {
      userId,
      taskId,
      startTimestamp,
      endTimestamp,
      ...rest
    } = validClientSession;
    expect(validatedSession).toMatchObject({
      ...rest,
      user_id: userId,
      task_id: taskId,
      start_timestamp: startTimestamp,
      retro_added: false,
      duration: expect.any(Number),
    });
  });
  it("Should strip extra fields", () => {
    const strippedSession = validateClientSession({
      extra: "junk",
      ...validClientSession,
    });
    expect(strippedSession).not.toMatchObject({ extra: "junk" });
  });
  it("Should rename fields", () => {
    const renamedSession = validateClientSession(validClientSession);
    expect(renamedSession).toMatchObject({
      user_id: expect.any(Number),
      task_id: expect.any(Number),
      start_timestamp: expect.any(Date),
      retro_added: expect.any(Boolean),
    });
  });
  it("Should calculate duration correctly", () => {
    const { startTimestamp, endTimestamp } = validClientSession;
    const calculatedSession = validateClientSession(validClientSession);
    expect(calculatedSession).toMatchObject({
      duration: differenceInMilliseconds(endTimestamp, startTimestamp),
    });
  });
  it("Shouldn't return a duration when start/end timestamp is missing", () => {
    const { startTimestamp, endTimestamp, ...rest } = validClientSession;
    const noTimeSession = { ...rest };
    const noDurationSession = validateClientSession(noTimeSession, {
      isPartial: true,
    });
    expect(noDurationSession).not.toMatchObject({
      duration: expect.anything(),
    });
  });
});

describe("Session Validator (database to client)", () => {
  it("Should require correct fields and return correct object", () => {
    const validatedSession = hydrateDatabaseSession(validDatabaseSession);
    const {
      user_id,
      task_id,
      start_timestamp,
      duration,
      retro_added,
      ...rest
    } = validDatabaseSession;
    expect(validatedSession).toMatchObject({
      ...rest,
      userId: user_id,
      taskId: task_id,
      startTimestamp: expect.objectContaining(new Date(start_timestamp)),
      retroAdded: retro_added,
      endTimestamp: expect.any(Date),
    });
  });
});
