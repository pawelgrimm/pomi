import { validateProject } from "../project";
import { ProjectModel } from "../../models";

let validProject: ProjectModel;

beforeEach(() => {
  validProject = {};
});

describe("Project Validator ", () => {
  it("Should pass validation when all required fields are provided", () => {
    const validatedProject = validateProject(validProject);
    expect(validatedProject).toEqual(validProject);
  });
  // No required fields, but if some are added, there needs to be a test for that
  it("Should not strip optional fields", () => {
    const title = "my title";
    const projectWithOptionalField = { title, ...validProject };
    const validatedProject = validateProject(projectWithOptionalField);
    expect(validatedProject).toMatchObject({ title });
  });
  it("Should strip unknown fields", () => {
    const strippedProject = validateProject({
      extra: "junk",
      ...validProject,
    });
    expect(strippedProject).not.toMatchObject({ extra: "junk" });
  });
  it("Should allow ids that are valid uuids", () => {
    const id = "fbbf7f5a-bad5-4f49-9862-16ddb45f1a6d";
    const validatedProject = validateProject({ id, ...validProject });
    expect(validatedProject).toMatchObject({ id });
  });
  it("Should allow uuids without delimiters", () => {
    const id = "fbbf7f5abad54f49986216ddb45f1a6d";
    const validatedProject = validateProject({ id, ...validProject });
    expect(validatedProject).toMatchObject({ id });
  });
  it("Should not allow ids that are invalid uuids", () => {
    let id = "fbbf7f5a-bad5-4f49-9862-16ddb45f1a6df"; // too long
    expect(() => validateProject({ id, ...validProject })).toThrow(
      /"id" must be a valid GUID/
    );
    id = "fbbf7f5abad54f49986216ddb45f1a6df"; // no delimiters
    expect(() => validateProject({ id, ...validProject })).toThrow(
      /"id" must be a valid GUID/
    );
  });
});
