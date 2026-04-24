"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
const bull_1 = __importDefault(require("bull"));
exports.emailQueue = new bull_1.default("email-queue", {
    redis: {
        host: process.env.REDIS_HOST || "redis",
        port: 6379,
    },
});
