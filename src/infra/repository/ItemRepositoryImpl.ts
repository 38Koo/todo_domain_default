import type { Row } from "@libsql/client";
import { Item } from "../../domain/Item.js";
import type { ItemRepository } from "../../domain/ItemRepository.js";
import { turso } from "../db/clinent.js";
import { RepositoryError } from "../error/RepositoryError.js";

export class ItemRepositoryImpl implements ItemRepository {
  async find(id: string): Promise<Item | null> {
    try {
      const { rows } = await turso.execute("SELECT * FROM items WHERE id = ?", [id]);

      if (rows.length > 0) {
        return toItem(rows[0]);
      }

      return null;
    } catch (error) {
      throw new RepositoryError(`Failed to find item (id: ${id})`);
    }
  }

  async findAll(): Promise<Item[]> {
    try {
      const { rows } = await turso.execute("SELECT * FROM items");

      return rows.map((row) => toItem(row));
    } catch (error) {
      throw new RepositoryError("Failed to fetch items");
    }
  }

  async save(item: Item): Promise<void> {
    try {
      await turso.execute({
        sql: `INSERT INTO items (id, title, content, is_completed)
              VALUES (?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                content = excluded.content,
                is_completed = excluded.is_completed`,
        args: [item.id.toString(), item.title, item.content, item.isCompleted ? 1 : 0],
      });
    } catch (error) {
      throw new RepositoryError(`Failed to save item (id: ${item.id})`);
    }
  }

  async delete(itemId: string): Promise<void> {
    try {
      return await turso.execute("DELETE FROM items WHERE id = ?", [itemId]).then(() => {});
    } catch (error) {
      throw new RepositoryError(`Failed to delete item (id: ${itemId})`);
    }
  }
}

function toItem(row: Row): Item {
  return Item.reconstruct(
    String(row["id"]),
    String(row["title"]),
    String(row["content"]),
    Boolean(row["is_completed"]),
  );
}
