import dotenv from "dotenv";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { healthCheckController } from "./presentation/controllers/healthCheckController.js";
import { ItemController } from "./presentation/controllers/itemController.js";
import { cors } from "hono/cors";

dotenv.config();

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.CLIENT_DOMAIN || "",
    allowHeaders: ["X-Custom-Header"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.route("/api", healthCheckController);
app.route("/api/items", ItemController);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
