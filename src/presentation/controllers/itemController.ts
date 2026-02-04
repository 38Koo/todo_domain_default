import { Hono } from "hono";
import { ItemUsecase } from "../../usecase/ItemUsecase.js";
import { ItemRepositoryImpl } from "../../infra/repository/ItemRepositoryImpl.js";

const ItemController = new Hono();

ItemController.get("/", async (c) => {
  const ir = new ItemRepositoryImpl();
  const iu = new ItemUsecase(ir);

  const result = await iu.getItemList();

  return c.json({ items: result });
});

export { ItemController };
