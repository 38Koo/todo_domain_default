import { Item } from "../domain/Item.js";
import type { ItemRepository } from "../domain/ItemRepository.js";
import { RepositoryError } from "../infra/error/RepositoryError.js";
import { InvalidIdError } from "./error/InvalidIdError.js";
import { InvalidUpdateContentsError } from "./error/InvalidUpdateContentsError.js";
import { ItemRepositoryFailedError } from "./error/ItemRepositoryFailedError.js";
import { NoItemError } from "./error/NoItemError.js";
import { NoRequiredFieldError } from "./error/NoRequiredFieldError.js";

type ItemDTO = {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
};

type GetItemListOutput = {
  items: ItemDTO[];
};
type GetItemByIdInput = {
  itemId: string;
};

type GetItemByIdOutput = {
  item: ItemDTO;
};

type AddItemInput = {
  title: string;
  content: string;
};

type AddItemOutput = {
  item: ItemDTO;
};

type UpdateItemInput = {
  itemId: string;
  title?: string;
  content?: string;
  isCompleted?: boolean;
};

type UpdateItemOutput = {
  item: ItemDTO;
};

type RemoveItemInput = {
  itemId: string;
};

export class ItemUsecase {
  private ItemRepository: ItemRepository;
  constructor(ItemRepository: ItemRepository) {
    this.ItemRepository = ItemRepository;
  }

  async getItemList(): Promise<GetItemListOutput> {
    try {
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
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new ItemRepositoryFailedError(error.message);
      }
      throw error;
    }
  }

  async getItemById({ itemId }: GetItemByIdInput): Promise<GetItemByIdOutput> {
    if (!itemId) {
      throw new InvalidIdError();
    }

    try {
      const item = await this.ItemRepository.find(itemId);

      if (!item) {
        throw new NoItemError();
      }

      return {
        item: {
          id: item["id"],
          title: item["title"],
          content: item["content"],
          isCompleted: item["isCompleted"],
        },
      };
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new ItemRepositoryFailedError(error.message);
      }
      throw error;
    }
  }

  async addItem({ title, content }: AddItemInput): Promise<AddItemOutput> {
    try {
      console.log(2);
      
      if (!title && !content) {
        throw new NoRequiredFieldError();
      }

      console.log(3);
      
      const item = Item.create(title, content);

      await this.ItemRepository.save(item);

      return {
        item: {
          id: item["id"],
          title: item["title"],
          content: item["content"],
          isCompleted: item["isCompleted"],
        },
      };
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new ItemRepositoryFailedError(error.message);
      }
      throw error;
    }
  }
  async updateItem({
    itemId,
    title,
    content,
    isCompleted,
  }: UpdateItemInput): Promise<UpdateItemOutput> {
    if (!itemId) {
      throw new InvalidIdError();
    }

    try {
      const item = await this.ItemRepository.find(itemId);
      if (!item) {
        throw new NoItemError();
      }

      if (!title && !content && isCompleted === undefined) {
        throw new InvalidUpdateContentsError();
      }

      if (title) {
        item.updateTitle(title);
      }

      if (content) {
        item.updateContent(content);
      }

      if (isCompleted !== undefined) {
        if (item.isCompleted !== isCompleted) {
          item.toggleCompletion();
        }
      }
      await this.ItemRepository.save(item);

      const updatedItem = await this.ItemRepository.find(itemId);
      if (!updatedItem) {
        throw new NoItemError();
      }

      return {
        item: {
          id: updatedItem["id"],
          title: updatedItem["title"],
          content: updatedItem["content"],
          isCompleted: updatedItem["isCompleted"],
        },
      };
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new ItemRepositoryFailedError(error.message);
      }
      throw error;
    }
  }

  async removeItem({itemId}: RemoveItemInput): Promise<void> {
    if (!itemId) {
      throw new InvalidIdError();
    }

    try {
      const item = await this.ItemRepository.find(itemId);
      if (!item) {
        throw new NoItemError();
      }

      await this.ItemRepository.delete(itemId);
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new ItemRepositoryFailedError(error.message);
      }
      throw error;
    }
  }
}
