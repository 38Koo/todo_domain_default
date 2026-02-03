import { Hono } from "hono";

const healthCheckController = new Hono();

healthCheckController.get("/", (c) => {
  return c.text("Hello Hono!");
});

export { healthCheckController };
