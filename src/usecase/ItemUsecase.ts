import type { ItemRepository } from "../domain/ItemRepository.js";

type ItemDTO = {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
};

type GetItemListOutput = {
  items: ItemDTO[];
};

type AddItemInput = {
  id: string;
  title?: string;
  content?: string;
  isCompleted?: boolean;
};

type AddItemOutput = {
  item: ItemDTO;
};

export class ItemUsecase {
  private ItemRepository: ItemRepository;
  constructor(ItemRepository: ItemRepository) {
    this.ItemRepository = ItemRepository;
  }

  async getItemList(): Promise<GetItemListOutput> {
    const items = await this.ItemRepository.findAll();

    if (items.length === 0) {
      return { items: [] };
    }

    const itemDTOs = items.map((item) => ({
      id: item["id"],
      title: item["title"],
      content: item["content"],
      isCompleted: item["isCompleted"],
    }));

    return { items: itemDTOs };
  }
  async addItem({
    id,
    title,
    content,
    isCompleted,
  }: AddItemInput): Promise<AddItemOutput> {
    const isValidId = Number.isNaN(Number(id));
    if (isValidId) {
      // TODO: Errorクラス化
      throw new Error("Invalid ID");
    }
    const validId = Number(id);
    const item = await this.ItemRepository.find(validId);

    if (!item) {
      throw new Error("Item not found");
    }

    console.log(item);

    if (title) {
      item.updateTitle(title);
    }

    if (content) {
      item.updateContent(content);
    }

    if (isCompleted) {
      item.toggleCompletion();
    }

    await this.ItemRepository.save(item);

    return {
      item: {
        id: item["id"],
        title: item["title"],
        content: item["content"],
        isCompleted: item["isCompleted"],
      },
    };
  }
  removeItem(item: any): void {}
  updateItem(item: any): void {}
}
