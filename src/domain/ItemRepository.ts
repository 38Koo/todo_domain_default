import type { Item } from "./Item.js";

export interface ItemRepository {
  find: (itemId: number) => Promise<Item | null>;
  findAll: () => Promise<Item[]>;
  save: (item: Item) => Promise<void>;
  delete: (itemId: number) => Promise<void>;
}
