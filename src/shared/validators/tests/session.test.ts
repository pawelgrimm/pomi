import { differenceInMilliseconds } from "date-fns";
import { validateSession } from "../session";
import { SessionModel } from "../../types";
import { v4 as uuid } from "uuid";

let validSession: SessionModel;

beforeEach(() => {
  validSession = {
    startTimestamp: new Date("2020-10-23T15:00:00.000Z"),
    endTimestamp: new Date("2020-10-23T16:00:00.000Z"),
    type: "break",
  };
});

describe("Session Validator", () => {
  it("Should pass validation when all required fields are provided", () => {
    const validatedSession = validateSession(validSession);
    expect(validatedSession).toEqual({
      ...validSession,
      isRetroAdded: false,
      duration: expect.any(Number),
    });
  });

  it("should not pass validation when a required field is missing", () => {
    const { startTimestamp, ...rest } = validSession;
    expect(() => validateSession({ ...rest })).toThrow(
      /"startTimestamp" is required/
    );
  });

  it("Should not strip optional fields", () => {
    const notes = "these are my notes and they are important";
    const validSessionWithNotes = { ...validSession, notes };
    const strippedSession = validateSession(validSessionWithNotes);
    expect(strippedSession).toMatchObject({ notes });
  });

  it("Should strip unknown fields", () => {
    const strippedSession = validateSession({
      extra: "junk",
      ...validSession,
    });
    expect(strippedSession).not.toMatchObject({ extra: "junk" });
  });

  it("Should calculate duration correctly", () => {
    const { startTimestamp, endTimestamp } = validSession;
    const calculatedSession = validateSession(validSession);

    if (!endTimestamp) {
      throw new Error('"endTimestamp" is required to calculate a duration');
    }

    expect(calculatedSession).toMatchObject({
      duration: differenceInMilliseconds(endTimestamp, startTimestamp),
    });
  });

  it("Should throw if both endTimestamp AND duration are missing", () => {
    const { endTimestamp, ...rest } = validSession;
    const noDurationSession = { ...rest };
    expect(() => validateSession(noDurationSession)).toThrow(
      /"value" must contain at least one of \[endTimestamp, duration\]/
    );
  });

  it("Shouldn't return a duration when start/end timestamp is missing", () => {
    const { startTimestamp, endTimestamp, ...rest } = validSession;
    const noTimeSession = { ...rest };
    const noDurationSession = validateSession(noTimeSession, {
      isPartial: true,
    });
    expect(noDurationSession).not.toMatchObject({
      duration: expect.anything(),
    });
  });

  it("Shouldn't allow really long notes", () => {
    const longNote = "".padEnd(100000, "_");
    expect(() =>
      console.log(validateSession({ ...validSession, notes: longNote }))
    ).toThrow(
      /"notes" length must be less than or equal to \d+ characters long/
    );
  });
});
