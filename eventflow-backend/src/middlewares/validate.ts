import { ZodObject } from "zod";

export const validate =
  (schema: ZodObject) =>
  (req: any, res: any, next: any) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.errors,
      });
    }
  };