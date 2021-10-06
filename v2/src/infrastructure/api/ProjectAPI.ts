import {
  CreateProjectDTO,
  SerializeProjectDTO,
} from "@core/interfaces/ProjectDTOs";
import Project from "@core/projectAggregate/Project";
import { v4 as uuid } from "uuid";
import ProjectSerializer from "@infra/api/ProjectSerializer";

const PROJECT_STORAGE_KEY = "persistence-project-api";

export class ProjectAPI {
  private readonly _projects: Record<string, Project> = {};

  constructor(private readonly serializer: ProjectSerializer) {
    const serializedProjects = this.load();
    this._projects = serializer.deserialize(serializedProjects);
  }

  async getActive(): Promise<Project[]> {
    return Object.values(this._projects);
  }

  async getById(id: string): Promise<Project> {
    const foundProject = this._projects[id];
    if (foundProject == null) {
      throw new Error(`Project w/ id "{id}" not found`);
    }
    return foundProject;
  }

  async create(request: CreateProjectDTO) {
    const newProject = new Project(uuid(), request.name);
    this._projects[newProject.id] = newProject;
    await this.save();
    return newProject;
  }

  private load(): SerializeProjectDTO[] {
    const rawStorage = window.localStorage.getItem(PROJECT_STORAGE_KEY) ?? "";
    try {
      return JSON.parse(rawStorage);
    } catch {
      return [];
    }
  }

  private async save() {
    const serializedProjects = this.serializer.serialize(this._projects);
    window.localStorage.setItem(
      PROJECT_STORAGE_KEY,
      JSON.stringify(serializedProjects)
    );
  }
}

export default new ProjectAPI(new ProjectSerializer());
