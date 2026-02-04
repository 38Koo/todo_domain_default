export class NoItemError extends Error {
  constructor(message: string = "No Item Found") {
    super(message);
    this.name = "NoItemError";
  }
}
