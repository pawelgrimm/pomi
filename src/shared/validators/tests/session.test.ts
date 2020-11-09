import { differenceInMilliseconds } from "date-fns";
import { validateClientSession, hydrateDatabaseSession } from "../session";
import { ClientSessionModel, DatabaseSessionModel } from "../../types";
import { v4 as uuid } from "uuid";
let validClientSession: ClientSessionModel;
let validDatabaseSession: Omit<DatabaseSessionModel, "start_timestamp"> & {
  start_timestamp: string;
};
beforeEach(() => {
  const taskId = uuid();
  const id = uuid();
  validClientSession = {
    userId: "sodf5%$32random",
    taskId,
    startTimestamp: new Date("2020-10-23T15:00:00.000Z"),
    endTimestamp: new Date("2020-10-23T16:00:00.000Z"),
    type: "break",
  };
  validDatabaseSession = {
    id,
    user_id: "sodf5%$32random",
    task_id: taskId,
    start_timestamp: "2020-10-23T15:00:00.000Z",
    duration: 3600000,
    type: "break",
    is_retro_added: false,
  };
});

describe("Session Validator (client to database)", () => {
  it("Should pass validation when all required fields are provided", () => {
    const {
      userId,
      taskId,
      startTimestamp,
      endTimestamp,
      ...rest
    } = validClientSession;

    const validatedSession = validateClientSession(validClientSession);
    expect(validatedSession).toEqual({
      ...rest,
      user_id: userId,
      task_id: taskId,
      start_timestamp: startTimestamp,
      is_retro_added: false,
      duration: expect.any(Number),
    });
  });
  it("should not pass validation when a required field is missing", () => {
    const { userId, ...rest } = validClientSession;
    expect(() => validateClientSession({ ...rest })).toThrow(
      /"userId" is required/
    );
  });
  it("Should not strip optional fields", () => {
    const notes = "these are my notes and they are important";
    const validSessionWithNotes = { notes, ...validClientSession };
    const strippedSession = validateClientSession(validSessionWithNotes);
    expect(strippedSession).toMatchObject({ notes });
  });

  it("Should strip unknown fields", () => {
    const strippedSession = validateClientSession({
      extra: "junk",
      ...validClientSession,
    });
    expect(strippedSession).not.toMatchObject({ extra: "junk" });
  });
  it("Should rename fields", () => {
    const renamedSession = validateClientSession(validClientSession);
    expect(renamedSession).toMatchObject({
      user_id: expect.any(String),
      task_id: expect.any(String),
      start_timestamp: expect.any(Date),
      is_retro_added: expect.any(Boolean),
    });
  });
  it("Should calculate duration correctly", () => {
    const { startTimestamp, endTimestamp } = validClientSession;
    const calculatedSession = validateClientSession(validClientSession);
    expect(calculatedSession).toMatchObject({
      duration: differenceInMilliseconds(endTimestamp, startTimestamp),
    });
    expect(calculatedSession).not.toMatchObject({
      end_timestamp: expect.any(Date),
    });
    expect(calculatedSession).not.toMatchObject({
      endTimestamp: expect.any(Date),
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
  it("Shouldn't allow really long notes", () => {
    const longNote = "".padEnd(100000, "_");
    expect(() =>
      console.log(
        validateClientSession({ ...validClientSession, notes: longNote })
      )
    ).toThrow(
      /"notes" length must be less than or equal to \d+ characters long/
    );
  });
});

describe("Session Validator (database to client)", () => {
  it("Should pass validation when all required fields are provided", () => {
    const {
      user_id,
      task_id,
      start_timestamp,
      duration,
      is_retro_added,
      ...rest
    } = validDatabaseSession;
    const validatedSession = hydrateDatabaseSession(validDatabaseSession);

    expect(validatedSession).toEqual({
      ...rest,
      userId: user_id,
      taskId: task_id,
      startTimestamp: new Date(start_timestamp),
      isRetroAdded: is_retro_added,
      endTimestamp: expect.any(Date),
    });
  });
});
