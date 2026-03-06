import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";

export const loginHandler = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const data = await loginUser(email, password);

  res.json({
    success: true,
    ...data
  });

};