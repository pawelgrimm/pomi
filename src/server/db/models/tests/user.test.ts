import {
  createValidUser,
  insertTestUser,
} from "../../../../shared/utils/testing-helpers";
import { pool, Users } from "../../index";
import { UserModel } from "../../../../shared/types";
import { Method } from "../../../../shared/validators";

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
    return expect(user).resolves.toEqual({
      ...validUser,
      defaultProject: expect.any(String),
    });
  });

  it("Should call the validator during creation", async () => {
    const validUser = createValidUser();
    await Users.create(validUser);
    return expect(mockValidator).toHaveBeenCalledWith(validUser, Method.CREATE);
  });
});
