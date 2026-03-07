import { Request, Response,NextFunction } from "express";
import { AppError } from "../utils/appError";

export const authorize = (...roles:string[]) => (req:Request, res:Response, next:NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }
    if (!roles.includes(user.role)) {
      return next(new AppError("Forbidden: Access denied", 403));
    }
    next();
}