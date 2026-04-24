"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redlock = void 0;
const redlock_1 = __importDefault(require("redlock"));
const redis_1 = require("./redis");
exports.redlock = new redlock_1.default([redis_1.redisClient], {
    retryCount: 3,
    retryDelay: 200,
});
