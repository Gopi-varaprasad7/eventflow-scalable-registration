"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventQueue = void 0;
const bullmq_1 = require("bullmq");
exports.eventQueue = new bullmq_1.Queue("event-notifications", {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379
    }
});
