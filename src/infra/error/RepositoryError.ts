export class RepositoryError extends Error {
  constructor(message: string = "Repository operation failed") {
    super(message);
    this.name = "RepositoryError";
  }
}
