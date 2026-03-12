import { logger } from "../config/logger";

export const errorHandler = (err:any, req:any, res:any, next:any) => {

  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    success:false,
    message:"Internal server error"
  });
};