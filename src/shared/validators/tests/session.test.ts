import { validateSession, validateSessionSelectOptions } from "../session";
import { SessionModel } from "../../types";
import { v4 as uuid } from "uuid";
import { Method } from "../shared";
import { InvalidMethodError } from "../errors";

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

it("Should throw when bad method is passed to validator", () => {
  // @ts-ignore
  const test = () => validateSession({}, "BOGUS");

  expect(test).toThrow(InvalidMethodError);
});

describe("Session Select Options Validator", () => {
  it("Should add the default syncToken value for empty options object", () => {
    const validatedOptions = validateSessionSelectOptions({});
    expect(validatedOptions).toEqual({
      syncToken: "*",
    });
  });

  it("Should not overwrite a provided syncToken", () => {
    const syncToken = "2020-11-13T02:59:29.853Z";
    const validatedOptions = validateSessionSelectOptions({ syncToken });
    expect(validatedOptions).toEqual({ syncToken });
  });

  it("Should throw an error when sync token format is invalid", () => {
    const badSyncToken = "2012-11-13-badly";
    expect(() =>
      validateSessionSelectOptions({ syncToken: badSyncToken })
    ).toThrow(/could not be parsed as an ISO 8601 date string/);
  });

  it("Should accept 1806 ISO strings for start and end", () => {
    const start = "2020-11-13T02:59:29.853Z";
    const end = "2020-11-13T02:59:29.854Z";
    const validatedOptions = validateSessionSelectOptions({ start, end });
    expect(validatedOptions).toMatchObject({
      start: new Date(start),
      end: new Date(end),
    });
  });

  it("Should throw if start is malformed", () => {
    const start = "not a date";
    expect(() => validateSessionSelectOptions({ start })).toThrow(
      /"start" must be in ISO 8601 date format/
    );
  });

  it("Should throw if end is malformed", () => {
    const end = "not a date";
    expect(() => validateSessionSelectOptions({ end })).toThrow(
      /"end" must be in ISO 8601 date format/
    );
  });

  it("Should throw if end > start", () => {
    const start = "2020-11-13T02:59:29.853Z";
    const end = "2020-11-13T02:59:29.000Z";
    expect(() => validateSessionSelectOptions({ start, end })).toThrow(
      /"end" must be greater than/
    );
  });

  it("should throw if end = start", () => {
    const start = "2020-11-13T02:59:29.853Z";
    expect(() => validateSessionSelectOptions({ start, end: start })).toThrow(
      /"end" must be greater than/
    );
  });

  it("should not throw if only end is provided", () => {
    const end = "2020-11-13T02:59:29.853Z";
    expect(() => validateSessionSelectOptions({ end })).not.toThrow();
  });
});
