import { createRoute, z } from "@hono/zod-openapi";

const ErrorSchema = z
  .object({
    message: z.string().openapi({
      example: "Error message",
    }),
  })
  .openapi("Error");

const ItemIdSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "806ea4c0-cbb7-4023-8341-beb1bc6112ab",
    }),
});

const ItemSchema = z
  .object({
    id: z.string().openapi({
      example: "806ea4c0-cbb7-4023-8341-beb1bc6112ab",
    }),
    title: z.string().openapi({
      example: "Sample Item Title",
    }),
    content: z.string().openapi({
      example: "This is a sample item content.",
    }),
    isCompleted: z.boolean().openapi({
      example: false,
    }),
  })
  .openapi("Item");

export const getItemListRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            items: z.array(ItemSchema),
          }),
        },
      },
      description: "Successful Response",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Bad Request",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Not Found",
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Internal Server Error",
    },
  },
});
