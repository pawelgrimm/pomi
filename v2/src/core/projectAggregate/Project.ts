import ProjectTask from "./ProjectTask";

class Project {
  public name: string;
  public readonly id: string;
  private readonly _tasks: ProjectTask[] = [];

  constructor(id: string, name: string, tasks?: ProjectTask[]) {
    this.id = id;
    this.name = name;
    if (tasks != null) {
      this._tasks.push(...tasks);
    }
  }

  public getTasks(): readonly ProjectTask[] {
    return Array.from(this._tasks);
  }

  public addTask(newTask: ProjectTask) {
    this._tasks.push(newTask);
  }
}

export default Project;
