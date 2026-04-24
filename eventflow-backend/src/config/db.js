"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.createUser = exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.pool.on("connect", () => {
    console.log("Connected to PostgreSQL 🚀");
});
exports.pool.on("error", (err) => {
    console.error("Unexpected DB error", err);
});
const createUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield exports.pool.query("INSERT INTO users (name, email,password) VALUES ($1,$2,$3) RETURNING *", [name, email, password]);
    return result.rows[0];
});
exports.createUser = createUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield exports.pool.query("SELECT * FROM users");
    return result.rows;
});
exports.getAllUsers = getAllUsers;
