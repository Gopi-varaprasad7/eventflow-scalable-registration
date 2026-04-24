"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const appError_1 = require("../utils/appError");
const ErrorMiddleware = (err, req, res, next) => {
    if (err instanceof appError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
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
};
exports.ErrorMiddleware = ErrorMiddleware;
