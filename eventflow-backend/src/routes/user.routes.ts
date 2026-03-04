import { Router } from "express";
import { createUserHandler,getUsersHandler } from "../controllers/user.controller";
import { body } from 'express-validator';

const router = Router();

router.post('/',[
    body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({min:2}).withMessage("Name must be atleast two characters"),
    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
],createUserHandler);
router.get('/',getUsersHandler);

export default router;