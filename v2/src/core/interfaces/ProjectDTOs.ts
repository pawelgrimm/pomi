export class CreateProjectDTO {
  constructor(public name: string) {}
}

export interface SerializeProjectDTO {
  name: string;
  id: string;
  tasks: Array<{ name: string; isDone: boolean }>;
}
