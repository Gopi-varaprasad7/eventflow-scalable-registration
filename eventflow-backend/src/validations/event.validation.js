"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEventSchema = void 0;
const zod_1 = require("zod");
exports.registerEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        eventId: zod_1.z.number({
            message: "eventId must be a number",
        }),
    }),
    query: zod_1.z.object({
        id: zod_1.z.string({
            message: "userId is required",
        }),
    }),
});
