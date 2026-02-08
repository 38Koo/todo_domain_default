export class NoRequiredFieldError extends Error {
  constructor(message: string = "No Required Field") {
    super(message);
    this.name = "NoRequiredFieldError";
  }
}
