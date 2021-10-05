import { SerializeProjectDTO } from "../../core/interfaces/ProjectDTOs";
import ProjectTask from "../../core/projectAggregate/ProjectTask";
import Project from "../../core/projectAggregate/Project";

export default class ProjectSerializer {
  public deserialize(serializedProjects: SerializeProjectDTO[]) {
    const projects: Record<Project["id"], Project> = {};
    serializedProjects.forEach((project) => {
      const hydratedTasks = project.tasks.map((rawTask) => {
        const newTask = new ProjectTask(rawTask.name);
        newTask.isDone = rawTask.isDone;
        return newTask;
      });
      const newProject = new Project(project.id, project.name, hydratedTasks);
      projects[newProject.id] = newProject;
    });
    return projects;
  }

  public serialize(projects: Record<Project["id"], Project>) {
    return Object.values(projects).map((project) => {
      const serializedTasks = project
        .getTasks()
        .map((task) => ({ name: task.name, isDone: task.isDone }));
      const serializedProject: SerializeProjectDTO = {
        name: project.name,
        id: project.id,
        tasks: serializedTasks,
      };
      return serializedProject;
    });
  }
}
