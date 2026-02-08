export class InvalidUpdateContentsError extends Error {
  constructor(message: string = "Invalid Update Contents") {
    super(message);
    this.name = "InvalidUpdateContentsError";
  }
}
