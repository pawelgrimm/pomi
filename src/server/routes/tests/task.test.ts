import request from "supertest";
import app from "../../server";
// @ts-ignore
import { mockCreate, mockSelect, mockSelectOne } from "../../db/models/task";
import { v4 as uuid } from "uuid";
import { arrayContainingObjectsContaining } from "../../../shared/utils";

// Set up mock
jest.mock("../../db/index");

// const mockTasks = Task as jest.MockedClass<typeof Task>;
// const {
//   create: mockCreate,
//   select: mockSelect,
//   selectOne: mockSelectOne,
// } = mockTasks.prototype;
//
// const createMockTask = () => ({
//   id: uuid(),
//   projectId: uuid(),
//   isCompleted: false,
//   title: "",
// });

let user = { id: uuid() };

beforeEach(() => jest.clearAllMocks());

const validTask = {
  title: "a test task",
  isCompleted: true,
  projectId: uuid(),
};

describe("Authorization", () => {
  it("should require authorization on all paths", async (done) => {
    await request(app)
      .post("/api/tasks")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    await request(app)
      .get("/api/tasks")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    await request(app)
      .get("/api/tasks/123")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    done();
  });
});

describe("POST task/", () => {
  it("should call task create with correct parameters", async (done) => {
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${user.id}`)
      .send(validTask)
      .expect(201);

    expect(mockCreate).toHaveBeenCalledWith(user.id, validTask);

    done();
  });

  it("should not create a task", async (done) => {
    const { body } = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .send({ isCompleted: "black beans" })
      .expect(422);

    expect(body).toEqual(
      expect.objectContaining({
        errors: expect.any(Array),
      })
    );

    done();
  });
});

describe("GET tasks/", () => {
  it("Should get all (incomplete) tasks", async (done) => {
    await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      includeCompleted: false,
      syncToken: "*",
    });

    done();
  });
  it("Should get only new tasks", async (done) => {
    const syncToken = new Date().toISOString();

    await request(app)
      .get(`/api/tasks?sync_token=${syncToken}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      includeCompleted: false,
      syncToken,
    });

    done();
  });

  it("A bad sync token should return a 422 error", async (done) => {
    const syncToken = "this-is-not-an-iso-8601-date";

    const { body } = await request(app)
      .get(`/api/tasks?sync_token=${syncToken}`)
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(422);

    expect(body).toEqual({
      errors: {
        paths: arrayContainingObjectsContaining([
          {
            name: "syncToken",
            message: /could not be parsed/,
          },
        ]),
      },
    });
    done();
  });

  it("A bad value for includeCompleted should return a 422 error", async (done) => {
    const { body } = await request(app)
      .get(`/api/tasks?include_completed=tamales`)
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(422);

    expect(body).toEqual({
      errors: {
        paths: arrayContainingObjectsContaining([
          {
            name: "includeCompleted",
            message: /could not be parsed/,
          },
        ]),
      },
    });
    done();
  });

  it("Should get tasks including completed tasks", async (done) => {
    await request(app)
      .get("/api/tasks?include_completed=1")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      includeCompleted: true,
      syncToken: "*",
    });
    done();
  });

  it("Should return correctly when user has no tasks", async (done) => {
    mockSelect.mockImplementationOnce(
      () => new Promise((resolve) => resolve([]))
    );

    const { body } = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(404);

    expect(body).toEqual({
      tasks: [],
    });
    done();
  });
});

describe("GET tasks/:id", () => {
  it("Should get specific tasks", async (done) => {
    const taskId = uuid();

    await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockSelectOne).toHaveBeenCalledWith(user.id, taskId);
    done();
  });

  it("Should return correctly when task is not found", async () => {
    mockSelectOne.mockImplementationOnce(
      () => new Promise((resolve) => resolve(null))
    );

    const body = request(app)
      .get(`/api/tasks/${uuid()}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(404)
      .then((res) => res.body);

    return expect(body).resolves.toEqual({
      task: null,
    });
  });
});
