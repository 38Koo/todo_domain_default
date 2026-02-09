import { ItemId } from "./ItemId.js";

export class Item {
  public readonly id: ItemId;
  public title: string;
  public content: string;
  public isCompleted: boolean;

  private constructor(id: ItemId, title: string, content: string, isCompleted?: boolean) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.isCompleted = isCompleted ?? false;
  }

  static create(title: string, content: string): Item {
    return new Item(ItemId.generate(), title, content, false);
  }

  static reconstruct(id: string, title: string, content: string, isCompleted: boolean): Item {
    return new Item(ItemId.reconstruct(id), title, content, isCompleted);
  }

  toggleCompletion(): void {
    this.isCompleted = !this.isCompleted;
  }

  updateTitle(title: string): void {
    this.title = title;
  }

  updateContent(content: string): void {
    this.content = content;
  }
}
