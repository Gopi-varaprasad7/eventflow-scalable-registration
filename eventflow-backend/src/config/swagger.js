"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "EventFlow API",
            version: "1.0.0",
            description: "Event management backend API documentation",
        },
        servers: [
            {
                url: "http://localhost:5001",
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // path to route files
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
