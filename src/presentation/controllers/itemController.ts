import { Hono } from "hono";
import { ItemUsecase } from "../../usecase/ItemUsecase.js";
import { ItemRepositoryImpl } from "../../infra/repository/ItemRepositoryImpl.js";
import { InvalidIdError } from "../../usecase/error/InvalidIdError.js";
import { NoItemError } from "../../usecase/error/NoItemError.js";
import { InvalidUpdateContentsError } from "../../usecase/error/InvalidUpdateContentsError.js";

const ItemController = new Hono();

ItemController.get("/", async (c) => {
  const ir = new ItemRepositoryImpl();
  const iu = new ItemUsecase(ir);

  try {
    const result = await iu.getItemList();

    return c.json(result);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return c.json({ message: error.message }, 400);
    }
    if (error instanceof NoItemError) {
      return c.json({ message: error.message }, 404);
    }
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

ItemController.get("/:id", async (c) => {
  const ir = new ItemRepositoryImpl();
  const iu = new ItemUsecase(ir);

  try {
    const itemId = c.req.param("id");

    const Item = await iu.getItemById({ itemId });

    return c.json(Item);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return c.json({ message: error.message }, 400);
    }
    if (error instanceof NoItemError) {
      return c.json({ message: error.message }, 404);
    }
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

ItemController.post("/:id", async (c) => {
  const ir = new ItemRepositoryImpl();
  const iu = new ItemUsecase(ir);

  try {
    const itemId = c.req.param("id");
    const body = await c.req.json();
    const { title, content, isCompleted } = body;

    const item = await iu.updateItem({
      itemId,
      title,
      content,
      isCompleted,
    });

    return c.json(item);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return c.json({ message: error.message }, 400);
    }
    if (error instanceof InvalidUpdateContentsError) {
      return c.json({ message: error.message }, 400);
    }
    if (error instanceof NoItemError) {
      return c.json({ message: error.message }, 404);
    }
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export { ItemController };
