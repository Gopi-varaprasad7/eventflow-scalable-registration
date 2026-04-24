"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2 }).withMessage("Name must be atleast two characters"),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email"),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty().withMessage("Password required")
        .isLength({ min: 6 }).withMessage("Password must be atleast 6 characters")
], user_controller_1.createUserHandler);
router.get('/', auth_middleware_1.authenticate, user_controller_1.getUsersHandler);
exports.default = router;
