import type { Item } from "./Item.js";

export interface ItemRepository {
  find: (itemId: string) => Promise<Item | null>;
  findAll: () => Promise<Item[]>;
  save: (item: Item) => Promise<void>;
  delete: (itemId: string) => Promise<void>;
}
