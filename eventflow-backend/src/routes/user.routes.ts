import { Router } from "express";
import { createUserHandler,getUsersHandler } from "../controllers/user.controller";
import { body } from 'express-validator';
import { authenticate } from "../middlewares/auth.middleware";

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
    body("password")
      .trim()
      .notEmpty().withMessage("Password required")
      .isLength({ min: 6 }).withMessage("Password must be atleast 6 characters")
],createUserHandler);
router.get('/',authenticate,getUsersHandler);

export default router;