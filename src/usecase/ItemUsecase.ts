import { Item } from "../domain/Item.js";
import { ItemId } from "../domain/ItemId.js";
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

function toItemDTO(item: Item): ItemDTO {
  return {
    id: item.id.toString(),
    title: item.title,
    content: item.content,
    isCompleted: item.isCompleted,
  };
}

function validateItemId(itemId: string): ItemId {
  try {
    return ItemId.reconstruct(itemId);
  } catch {
    throw new InvalidIdError();
  }
}

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

      return { items: items.map(toItemDTO) };
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new ItemRepositoryFailedError(error.message);
      }
      throw error;
    }
  }

  async getItemById({ itemId }: GetItemByIdInput): Promise<GetItemByIdOutput> {
    validateItemId(itemId);

    try {
      const item = await this.ItemRepository.find(itemId);

      if (!item) {
        throw new NoItemError();
      }

      return { item: toItemDTO(item) };
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new ItemRepositoryFailedError(error.message);
      }
      throw error;
    }
  }

  async addItem({ title, content }: AddItemInput): Promise<AddItemOutput> {
    try {
      if (!title && !content) {
        throw new NoRequiredFieldError();
      }

      const item = Item.create(title, content);

      await this.ItemRepository.save(item);

      return { item: toItemDTO(item) };
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
    validateItemId(itemId);

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

      return { item: toItemDTO(updatedItem) };
    } catch (error) {
      if (error instanceof RepositoryError) {
        throw new ItemRepositoryFailedError(error.message);
      }
      throw error;
    }
  }

  async removeItem({itemId}: RemoveItemInput): Promise<void> {
    validateItemId(itemId);

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
