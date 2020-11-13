import request from "supertest";
import app from "../../server";
import { Session } from "../../db/models";
import { SessionModel } from "../../../shared/types";
import { v4 as uuid } from "uuid";

// Set up mock
jest.mock("../../db/models");

const mockSessions = Session as jest.MockedClass<typeof Session>;

// A Mock of Sessions
const Sessions = mockSessions.prototype;

const createMockSession = (): Required<SessionModel> => ({
  id: uuid(),
  taskId: uuid(),
  startTimestamp: new Date("2020-10-23T19:59:29.853Z"),
  duration: 500000,
  notes: "",
  type: "session",
  isRetroAdded: false,
});

Sessions.select.mockImplementation(
  () => new Promise((resolve) => resolve([createMockSession()]))
);

Sessions.selectOne.mockImplementation(
  () => new Promise((resolve) => resolve(createMockSession()))
);

let user = { id: uuid() };

beforeEach(() => mockSessions.mockClear());

const validSession = createMockSession();

describe("Session create tests", () => {
  it("should create a session", async (done) => {
    const { body } = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${user.id}`)
      .send(validSession)
      .expect(201);

    expect(await Sessions.select(user.id)).toContainEqual({
      id: body.id,
      start_timestamp: new Date(validSession.startTimestamp),
      notes: validSession.notes,
      duration: validSession.duration,
    });
    done();
  });
  // it("should not create a session", async (done) => {
  //   const res = await request(app).post("/api/sessions").expect(400);
  //
  //   expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
  //   done();
  // });
});
