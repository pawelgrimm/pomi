const request = require("supertest");
const app = require("../../server");
const { users, close } = require("../../db");

afterAll(() => {
  close();
});

describe("User route tests", () => {
  it("should create a user", async (done) => {
    const username = "Test User";
    const res = await request(app)
      .post("/users")
      .send({
        username,
      })
      .expect(201);

    expect(await users.getAll()).toEqual([
      { id: expect.any(Number), username },
    ]);
    done();
  });
});
