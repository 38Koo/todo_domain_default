export class ItemRepositoryFailedError extends Error {
  constructor(message: string = "Item repository operation failed") {
    super(message);
    this.name = "ItemRepositoryFailedError";
  }
}
