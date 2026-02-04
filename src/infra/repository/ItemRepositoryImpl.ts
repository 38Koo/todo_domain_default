import type { Row } from "@libsql/client";
import { Item } from "../../domain/Item.js";
import type { ItemRepository } from "../../domain/ItemRepository.js";
import { turso } from "../db/clinent.js";

export class ItemRepositoryImpl implements ItemRepository {
  async find(id: number): Promise<Item | null> {
    const { rows } = await turso.execute("SELECT * FROM items WHERE id = ?", [
      id,
    ]);

    if (rows.length > 0) {
      return toItem(rows[0]);
    }

    return null;
  }
  async findAll(): Promise<Item[]> {
    const { rows } = await turso.execute("SELECT * FROM items");

    return rows.map((row) => toItem(row));
  }
  save(item: Item): Promise<void> {}
  remove(item: Item): Promise<void> {}
}

function toItem(row: Row): Item {
  return Item.reconstruct(
    String(row["id"]),
    String(row["title"]),
    String(row["content"]),
    Boolean(row["is_completed"]),
  );
}
