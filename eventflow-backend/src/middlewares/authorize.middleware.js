"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const appError_1 = require("../utils/appError");
const authorize = (...roles) => (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new appError_1.AppError("Unauthorized", 401));
    }
    if (!roles.includes(user.role)) {
        return next(new appError_1.AppError("Forbidden: Access denied", 403));
    }
    next();
};
exports.authorize = authorize;
