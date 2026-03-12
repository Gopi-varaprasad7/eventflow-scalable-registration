import { z } from "zod";

export const registerEventSchema = z.object({
  body: z.object({
    eventId: z.number({
      message: "eventId must be a number",
    }),
  }),
  query: z.object({
    id: z.string({
      message: "userId is required",
    }),
  }),
});