import { validateSession } from "../session";
import { SessionModel } from "../../types";
import { v4 as uuid } from "uuid";
import { Method } from "../shared";

let validSession: SessionModel;
let validSessionWithID: SessionModel & Required<Pick<SessionModel, "id">>;

const createValidSession = (): SessionModel => ({
  taskId: uuid(),
  startTimestamp: new Date("2020-10-23T15:00:00.000Z"),
  duration: 3600000,
  type: "break",
});

beforeEach(() => {
  validSession = createValidSession();
  validSessionWithID = { id: uuid(), ...createValidSession() };
});

describe("Session Validator (method: CREATE)", () => {
  it("Should pass validation when all required fields are provided", () => {
    const validatedSession = validateSession(validSession);
    expect(validatedSession).toEqual({
      ...validSession,
      isRetroAdded: false,
    });
  });

  it("Should not pass validation when a required field is missing", () => {
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

  it("Shouldn't allow really long notes", () => {
    const longNote = "".padEnd(100000, "_");
    expect(() =>
      console.log(validateSession({ ...validSession, notes: longNote }))
    ).toThrow(
      /"notes" length must be less than or equal to \d+ characters long/
    );
  });
});

describe("Session Validator (method: PARTIAL)", () => {
  it("Should throw when unknown fields are present", () => {
    const sessionWithJunk = { extra: "junk", ...validSessionWithID };

    expect(() => validateSession(sessionWithJunk, Method.PARTIAL)).toThrow(
      /"extra" is not allowed/
    );
  });

  it("Should not throw when the session only has an id", () => {
    const sessionWithIdOnly = { id: validSessionWithID.id };

    expect(() =>
      validateSession(sessionWithIdOnly, Method.PARTIAL)
    ).not.toThrow();
  });

  it("Should not throw if a startTimestamp is not provided and a duration is missing", () => {
    const { startTimestamp, ...noDurationSession } = validSessionWithID;

    expect(() =>
      validateSession(noDurationSession, Method.PARTIAL)
    ).not.toThrow();
  });

  it("Should throw if a startTimestamp is provided, but a duration is missing", () => {
    const { duration, ...noDurationSession } = validSessionWithID;
    expect(() => validateSession(noDurationSession, Method.PARTIAL)).toThrow(
      /"duration" is required/
    );
  });
});
