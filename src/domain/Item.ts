export class Item {
  public id: string;
  public title: string;
  public content: string;
  public isCompleted: boolean;

  private constructor(id: string, title: string, content: string, isCompleted?: boolean) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.isCompleted = isCompleted ?? false;
  }

  static create(title: string, content: string): Item {
    const id = crypto.randomUUID();
    return new Item(id, title, content, false);
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
