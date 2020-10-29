import { validateProject } from "../project";
import { ProjectModel } from "../../models";

let validProject: ProjectModel;

beforeEach(() => {
  validProject = {
    user_id: "4545yfg%%random",
  };
});

describe("Project Validator ", () => {
  it("Should pass validation when all required fields are provided", () => {
    const validatedProject = validateProject(validProject);
    expect(validatedProject).toEqual(validProject);
  });
  it("should not pass validation when a required field is missing", () => {
    const { user_id, ...rest } = validProject;
    expect(() => validateProject({ ...rest })).toThrow(/"user_id" is required/);
  });
  it("Should not strip optional fields", () => {
    const title = "my title";
    const projectWithOptionalField = { title, ...validProject };
    const strippedProject = validateProject(projectWithOptionalField);
    expect(strippedProject).toMatchObject({ title });
  });
  it("Should strip unknown fields", () => {
    const strippedProject = validateProject({
      extra: "junk",
      ...validProject,
    });
    expect(strippedProject).not.toMatchObject({ extra: "junk" });
  });
});
