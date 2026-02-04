import { Hono } from "hono";
import { ItemUsecase } from "../../usecase/ItemUsecase.js";
import { ItemRepositoryImpl } from "../../infra/repository/ItemRepositoryImpl.js";
import { InvalidIdError } from "../../usecase/error/InvalidIdError.js";
import { NoItemError } from "../../usecase/error/NoItemError.js";

const ItemController = new Hono();

ItemController.get("/", async (c) => {
  const ir = new ItemRepositoryImpl();
  const iu = new ItemUsecase(ir);

  try {
    const result = await iu.getItemList();

    return c.json({ items: result });
  } catch (error) {
    if (error instanceof InvalidIdError) {
      return c.json({ message: error.message }, 400);
    }
    if (error instanceof NoItemError) {
      return c.json({ message: error.message }, 404);
    }
  }
});

export { ItemController };
