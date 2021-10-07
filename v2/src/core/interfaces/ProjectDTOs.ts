import Project from "@core/projectAggregate/Project";
export interface CreateProjectDTO {
  name: string;
}

export interface CreateProjectTaskDTO {
  name: string;
}

export class CreateProjectTaskDTO {
  constructor(public name: string) {}
}

export class CreateTaskDTO {
  constructor(public name: string) {}
}

export interface SerializeProjectDTO {
  name: string;
  id: string;
  tasks: Array<{ name: string; isDone: boolean }>;
}
