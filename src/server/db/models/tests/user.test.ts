import {
  createValidUser,
  insertTestUser,
} from "../../../../shared/utils/testing-helpers";
import { pool, Users } from "../../index";
import { UserModel } from "../../../../shared/types";
import { Method } from "../../../../shared/validators";
import { v4 as uuid } from "uuid";

// Set up mocks
import * as validators from "../../../../shared/validators";
const mockValidator = jest.spyOn(validators, "validateUser");

let testUser: UserModel;

afterAll(() => {
  return pool.end();
});

beforeEach(async (done) => {
  testUser = await insertTestUser();
  mockValidator.mockClear();
  done();
});

describe("Create user", () => {
  it("Should create a user (with a default project)", () => {
    const validUser = createValidUser();
    const user = Users.create(validUser);
    const { firebaseId, ...expectedUser } = validUser;

    return expect(user).resolves.toEqual({
      ...expectedUser,
      id: expect.any(String),
      defaultProject: expect.any(String),
    });
  });

  it("Should call the validator during creation", async () => {
    const validUser = createValidUser();
    await Users.create(validUser);
    return expect(mockValidator).toHaveBeenCalledWith(validUser, Method.CREATE);
  });
});

describe("Get user", () => {
  it("Should get user", async () => {
    const validUser = await insertTestUser();
    const user = Users.selectOne(validUser.id);
    return expect(user).resolves.toEqual(validUser);
  });

  it("Should fail gracefully when user doesn't exist", () => {
    const user = Users.selectOne(uuid());
    return expect(user).resolves.toEqual(null);
  });
});

describe("Get by Firebase ID", () => {
  it("Should get user by a firebase ID", async () => {
    const firebaseId = uuid();
    const validUser = await insertTestUser({ firebaseId });

    const user = Users.getByFirebaseId(firebaseId);

    return expect(user).resolves.toEqual(validUser);
  });
});
