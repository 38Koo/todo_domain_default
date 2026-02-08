import { Hono } from "hono";
import { ItemUsecase } from "../../usecase/ItemUsecase.js";
import { ItemRepositoryImpl } from "../../infra/repository/ItemRepositoryImpl.js";
import { InvalidIdError } from "../../usecase/error/InvalidIdError.js";
import { NoItemError } from "../../usecase/error/NoItemError.js";
import { ItemRepositoryFailedError } from "../../usecase/error/ItemRepositoryFailedError.js";
import { InvalidUpdateContentsError } from "../../usecase/error/InvalidUpdateContentsError.js";
import { NoRequiredFieldError } from "../../usecase/error/NoRequiredFieldError.js";

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
    if (error instanceof ItemRepositoryFailedError) {
      return c.json({ message: error.message }, 500);
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
    if (error instanceof ItemRepositoryFailedError) {
      return c.json({ message: error.message }, 500);
    }
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

ItemController.post("/new", async (c) => {
  const ir = new ItemRepositoryImpl();
  const iu = new ItemUsecase(ir);

  const body = await c.req.json().catch(() => null);
  if (!body || !body.title || !body.content) {
    return c.json({ message: "title and content are required" }, 400);
  }

  try {
    const item = await iu.addItem({
      title: body.title,
      content: body.content,
    });

    return c.json(item);
  } catch (error) {
    if (error instanceof NoRequiredFieldError) {
      return c.json({ message: error.message }, 400);
    }
    if (error instanceof ItemRepositoryFailedError) {
      return c.json({ message: error.message }, 500);
    }
    return c.json({ message: "Internal Server Error" }, 500);
  }
})

ItemController.post("/:id", async (c) => {
  const ir = new ItemRepositoryImpl();
  const iu = new ItemUsecase(ir);

  try {
    const itemId = c.req.param("id");
      const body = await c.req.json().catch(() => null);
  if (!body || !body.title || !body.content || body.isCompleted === undefined) {
    return c.json({ message: "title and content are required" }, 400);
  }

    const item = await iu.updateItem({
      itemId,
      title: body.title,
      content: body.content,
      isCompleted: body.isCompleted,
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
    if (error instanceof ItemRepositoryFailedError) {
      return c.json({ message: error.message }, 500);
    }
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

ItemController.delete("/:id", async (c) => {
  const ir = new ItemRepositoryImpl();
  const iu = new ItemUsecase(ir);

  try {
    const itemId = c.req.param("id");
    
    await iu.removeItem({ itemId });
    
    return c.json({ message: "Item deleted successfully" }, 200);
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return c.json({ message: error.message }, 400);
    }
    if (error instanceof NoItemError) {
      return c.json({ message: error.message }, 404);
    }
    if (error instanceof ItemRepositoryFailedError) {
      return c.json({ message: error.message }, 500);
    }
    return c.json({ message: "Internal Server Error" }, 500);
  }
})

export { ItemController };
