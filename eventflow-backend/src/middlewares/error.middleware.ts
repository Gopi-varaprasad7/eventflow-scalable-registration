import { Request, Response ,NextFunction } from "express";
import { AppError } from "../utils/appError";

export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next : NextFunction,
) => {
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }
    if (err.code === "23505") {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    });
  }
     console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}