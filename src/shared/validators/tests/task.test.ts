import { validateTask } from "../task";
import { TaskModel } from "../../types";

let validTask: TaskModel;

beforeEach(() => {
  validTask = {
    /* TODO: add properties from TaskModel */
  };
});

describe("Task Validator ", () => {
  it("Should pass validation when all required fields are provided", () => {
    const validatedTask = validateTask(validTask);
    expect(validatedTask).toEqual(validTask);
  });
  it("should not pass validation when a required field is missing", () => {
    const { /* TODO: add a required field */, ...rest } = validTask;
    expect(() => validateTask({ ...rest })).toThrow(
      /"/* TODO: add a required field */" is required/
    );
  });
  it("Should not strip optional fields", () => {
    /* TODO: intialize optional field */
    const optionalField = new Object();
    const taskWithOptionalField = { optionalField, ...validTask };
    const strippedTask = validateTask(taskWithOptionalField);
    expect(strippedTask).toMatchObject({ optionalField });
  });
  it("Should strip unknown fields", () => {
    const strippedTask = validateTask({
      extra: "junk",
      ...validTask,
    });
    expect(strippedTask).not.toMatchObject({ extra: "junk" });
  });
});