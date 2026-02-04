export class InvalidIdError extends Error {
  constructor(message: string = "Invalid Id") {
    super(message);
    this.name = "InvalidIdError";
  }
}
