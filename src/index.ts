import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { healthCheckController } from "./presentation/controllers/healthCheckController.js";

const app = new Hono();

app.route("/", healthCheckController);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
