import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { healthCheckController } from "./presentation/controllers/healthCheckController.js";
import { ItemController } from "./presentation/controllers/itemController.js";

const app = new Hono();

app.route("/", healthCheckController);
app.route("/items", ItemController);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
