import { validateUser } from "../user";
import { UserModel } from "../../types";
import { Method } from "../shared";

let validUser: UserModel;

beforeEach(() => {
  validUser = {
    firebaseId: "%56^%6mmmsdfrandom",
    displayName: "test user",
    email: "some@valid.email",
  };
});

describe("User Validator", () => {
  it("Should pass validation when all required fields are provided", () => {
    const validatedUser = validateUser(validUser, Method.CREATE);
    expect(validatedUser).toEqual(validUser);
  });
  it("should not pass validation when a required field is missing", () => {
    const { firebaseId, ...rest } = validUser;
    expect(() => validateUser({ ...rest }, Method.CREATE)).toThrow(
      /"firebaseId" is required/
    );
  });
  it("Should strip unknown fields", () => {
    const strippedUser = validateUser(
      {
        extra: "junk",
        ...validUser,
      },
      Method.CREATE
    );
    expect(strippedUser).not.toMatchObject({ extra: "junk" });
  });
  it("Should require a valid email", () => {
    expect(() =>
      validateUser({ ...validUser, email: "junk" }, Method.CREATE)
    ).toThrow(/"email" must be a valid email/);
  });
  it("Should not allow empty strings", () => {
    expect(() =>
      validateUser({ ...validUser, firebaseId: "" }, Method.CREATE)
    ).toThrow(/"firebaseId" is not allowed to be empty/);
  });
});

describe("User Sync Options Validator", () => {
  it.todo("Add some tests");
});
