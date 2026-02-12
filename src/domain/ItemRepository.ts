import type { Item } from "./Item.js";
import type { ItemId } from "./ItemId.js";

export interface ItemRepository {
  find: (itemId: ItemId) => Promise<Item | null>;
  findAll: () => Promise<Item[]>;
  save: (item: Item) => Promise<void>;
  delete: (itemId: ItemId) => Promise<void>;
}
