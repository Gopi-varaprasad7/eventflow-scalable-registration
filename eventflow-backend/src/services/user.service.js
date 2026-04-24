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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersService = exports.createUserService = void 0;
const db_1 = require("../config/db");
const appError_1 = require("../utils/appError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUserService = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name || !email || !password) {
        throw new appError_1.AppError("Name, Email and Password are required", 400);
    }
    const hashedPass = yield bcrypt_1.default.hash(password, 10);
    const user = yield (0, db_1.createUser)(name, email, hashedPass);
    return user;
});
exports.createUserService = createUserService;
const getUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, db_1.getAllUsers)();
    return users;
});
exports.getUsersService = getUsersService;
