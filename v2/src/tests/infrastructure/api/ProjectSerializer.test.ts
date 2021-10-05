import Project from "@core/projectAggregate/Project";
import ProjectTask from "@core/projectAggregate/ProjectTask";
import ProjectSerializer from "@infra/api/ProjectSerializer";

describe("ProjectSerializer Tests", () => {
  it("Should serialize some projects", () => {
    const project1 = new Project("123", "foo", [
      new ProjectTask("123a"),
      new ProjectTask("123b"),
    ]);
    const project2 = new Project("234", "bar", []);
    const projects = { [project1.id]: project1, [project2.id]: project2 };

    const serializer = new ProjectSerializer();
    const serializedProjects = serializer.serialize(projects);
    const deserializedProjects = serializer.deserialize(serializedProjects);

    expect(deserializedProjects).toEqual(projects);
  });

  it("Should serialize task status", () => {
    const project = new Project("123", "foo", [
      new ProjectTask("123a"),
      new ProjectTask("123b"),
    ]);

    project.getTasks()[0].isDone = true;

    const projects = { [project.id]: project };

    const serializer = new ProjectSerializer();
    const serializedProject = serializer.serialize(projects);
    const deserializedProjects = serializer.deserialize(serializedProject);

    expect(deserializedProjects[project.id].getTasks()[0]).toEqual(
      project.getTasks()[0]
    );
  });
});
