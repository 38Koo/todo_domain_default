import type { Item } from "./Item.js";

export interface ItemRepository {
  find: (id: number) => Promise<Item | null>;
  findAll: () => Promise<Item[]>;
  save: (item: Item) => Promise<void>;
  remove: (item: Item) => Promise<void>;
}
