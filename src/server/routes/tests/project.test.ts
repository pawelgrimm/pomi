import request from "supertest";
import app from "../../server";
import { Project } from "../../db/models";
import { v4 as uuid } from "uuid";
import { arrayContainingObjectsContaining } from "../../../shared/utils";

// Set up mock
jest.mock("../../db/models");
const mockProjects = Project as jest.MockedClass<typeof Project>;

const {
  create: mockCreate,
  select: mockSelect,
  selectOne: mockSelectOne,
} = mockProjects.prototype;

const createMockProject = () => ({ id: uuid(), title: "", isArchived: false });

mockSelect.mockImplementation(
  () => new Promise((resolve) => resolve([createMockProject()]))
);
mockSelectOne.mockImplementation(
  () => new Promise((resolve) => resolve(createMockProject()))
);

let user = { id: uuid() };

beforeEach(() => mockProjects.mockClear());

const validProject = {
  title: "a test project",
  isArchived: true,
};

describe("Authorization", () => {
  it("should require authorization on all paths", async (done) => {
    await request(app)
      .post("/api/projects")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    await request(app)
      .get("/api/projects")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    await request(app)
      .get("/api/projects/123")
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(401);
    done();
  });
});

describe("POST project/", () => {
  it("should call project create with correct parameters", async (done) => {
    await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${user.id}`)
      .send(validProject)
      .expect(201);

    expect(mockCreate).toHaveBeenCalledWith(user.id, validProject);

    done();
  });

  it("should not create a project", async (done) => {
    const { body } = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .send({ isArchived: "black beans" })
      .expect(422);

    expect(body).toEqual(
      expect.objectContaining({
        errors: expect.any(Array),
      })
    );

    done();
  });
});

describe("GET projects/", () => {
  it("Should get all (unarchived) projects", async (done) => {
    await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      includeArchived: false,
      syncToken: "*",
    });

    done();
  });
  it("Should get only new projects", async (done) => {
    const syncToken = new Date().toISOString();

    await request(app)
      .get(`/api/projects?sync_token=${syncToken}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      includeArchived: false,
      syncToken,
    });

    done();
  });

  it("A bad sync token should return a 422 error", async (done) => {
    const syncToken = "this-is-not-an-iso-8601-date";

    const { body } = await request(app)
      .get(`/api/projects?sync_token=${syncToken}`)
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

  it("A bad value for includeArchived should return a 422 error", async (done) => {
    const { body } = await request(app)
      .get(`/api/projects?include_archived=tamales`)
      .set("Authorization", `Bearer ${user.id}`)
      .set("X-Test-Suppress-Error-Logging", "true")
      .expect(422);

    expect(body).toEqual({
      errors: {
        paths: arrayContainingObjectsContaining([
          {
            name: "includeArchived",
            message: /could not be parsed/,
          },
        ]),
      },
    });
    done();
  });

  it("Should get projects including archived projects", async (done) => {
    await request(app)
      .get("/api/projects?include_archived=1")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200);

    expect(mockSelect).toHaveBeenCalledWith(user.id, {
      includeArchived: true,
      syncToken: "*",
    });
    done();
  });

  it("Should return correctly when user has no projects", async (done) => {
    mockSelect.mockImplementationOnce(
      () => new Promise((resolve) => resolve([]))
    );

    const { body } = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${user.id}`)
      .expect(404);

    expect(body).toEqual({
      projects: [],
    });
    done();
  });
});

describe("GET projects/:id", () => {
  it("Should get specific projects", async (done) => {
    const projectId = uuid();

    await request(app)
      .get(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(200)
      .then((res) => res.body);

    expect(mockSelectOne).toHaveBeenCalledWith(user.id, projectId);
    done();
  });

  it("Should return correctly when project is not found", async () => {
    mockSelectOne.mockImplementationOnce(
      () => new Promise((resolve) => resolve(null))
    );

    const body = request(app)
      .get(`/api/projects/${uuid()}`)
      .set("Authorization", `Bearer ${user.id}`)
      .expect(404)
      .then((res) => res.body);

    return expect(body).resolves.toEqual({
      project: null,
    });
  });
});
