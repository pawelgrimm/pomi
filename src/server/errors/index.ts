type Path = {
  name: string;
  message?: string;
};

export class ParseOptionsError extends Error {
  paths: Path[];

  constructor(paths: Path[]) {
    super();
    this.name = "ParseOptionsError";
    this.paths = paths;
    this.message = paths
      .map((path) => `${path.name}: ${path.message}`)
      .join("\n");
  }
}
