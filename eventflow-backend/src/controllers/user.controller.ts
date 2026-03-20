import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/appError';
import { createUserService, getUsersService } from '../services/user.service';

export const createUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400);
    }

    const { name, email } = req.body;

    const user = await createUserService(name, email);

    res.status(201).json({
      success: false,
      user,
    });
  },
);

export const getUsersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await getUsersService();

    res.json({
      success: true,
      users,
    });
  },
);
