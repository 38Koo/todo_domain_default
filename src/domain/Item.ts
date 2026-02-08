export class Item {
  private id: string;
  private title: string;
  private content: string;
  private isCompleted: boolean;

  private constructor(id: string, title: string, content: string, isCompleted: boolean) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.isCompleted = isCompleted;
  }

  static create(generateId: () => string, title: string, content: string): Item {
    return new Item(generateId(), title, content, false);
  }

  static reconstruct(id: string, title: string, content: string, isCompleted: boolean): Item {
    return new Item(id, title, content, isCompleted);
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
