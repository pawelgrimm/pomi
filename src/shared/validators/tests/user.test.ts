import { validateUser } from "../user";
import { UserModel } from "../../models";

let validUser: UserModel;

beforeEach(() => {
  validUser = {
    id: "%56^%6mmmsdfrandom",
    display_name: "test user",
    email: "some@valid.email",
  };
});

describe("User Validator ", () => {
  it("Should pass validation when all required fields are provided", () => {
    const validatedUser = validateUser(validUser);
    expect(validatedUser).toEqual(validUser);
  });
  it("should not pass validation when a required field is missing", () => {
    const { id, ...rest } = validUser;
    expect(() => validateUser({ ...rest })).toThrow(/"id" is required/);
  });
  it("Should strip unknown fields", () => {
    const strippedUser = validateUser({
      extra: "junk",
      ...validUser,
    });
    expect(strippedUser).not.toMatchObject({ extra: "junk" });
  });
  it("Should require a valid email", () => {
    expect(() => validateUser({ ...validUser, email: "junk" })).toThrow(
      /"email" must be a valid email/
    );
  });
  it("Should not allow empty strings", () => {
    expect(() => validateUser({ ...validUser, id: "" })).toThrow(
      /"id" is not allowed to be empty/
    );
  });
});
