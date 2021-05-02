import { TaskModel } from "../../types";
import { validateTask } from "../task";

let validTask: TaskModel;

beforeEach(() => {
  validTask = {};
});

describe("Task Validator ", () => {
  it("Should pass validation when all required fields are provided", () => {
    const validatedTask = validateTask(validTask);
    expect(validatedTask).toEqual(validTask);
  });

  it("Should convert isCompleted = `false` to boolean", () => {
    const completedTask = validateTask({ ...validTask, isCompleted: "false" });
    expect(completedTask).toEqual({ isCompleted: false });
  });

  it("Should require isCompleted to be a boolean", () => {
    const invalidTask = { ...validTask, isCompleted: "yes" };
    expect(() => validateTask(invalidTask)).toThrow(/must be a boolean/);
  });

  it("Should not strip optional fields", () => {
    const title = "my title";
    const taskWithOptionalField = { title, ...validTask };
    const strippedTask = validateTask(taskWithOptionalField);
    expect(strippedTask).toMatchObject({ title });
  });

  it("Should strip unknown fields", () => {
    const strippedTask = validateTask({
      extra: "junk",
      ...validTask,
    });
    expect(strippedTask).not.toMatchObject({ extra: "junk" });
  });

  it("Should not along very long titles", () => {
    const title = "".padEnd(256, "Z");
    expect(() => validateTask({ ...validTask, title })).toThrow(
      /"title" length must be less than or equal to/
    );
  });

  it("Should not allow invalid projectIds", () => {
    const projectId = "fbbf7f5a-bad5-4f49-9862-16ddb45f1a6dZZZ";
    expect(() => validateTask({ ...validTask, projectId })).toThrow(
      /"projectId" must be a valid GUID/
    );
  });

  it("Should not allow invalid ids", () => {
    const id = "fbbf7f5a-bad5-4f49-9862-16ddb45f1a6dZZZ";
    expect(() => validateTask({ ...validTask, id })).toThrow(
      /"id" must be a valid GUID/
    );
  });
});
