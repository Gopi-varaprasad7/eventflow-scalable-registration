import { createUser, getAllUsers } from "../config/db";
import { AppError } from "../utils/appError";
import bcrypt from 'bcrypt';

export const createUserService = async (name: string, email: string, password: string) => {
  if (!name || !email || !password) {
    throw new AppError("Name, Email and Password are required", 400);
  }
  const hashedPass = await bcrypt.hash(password,10);
  const user = await createUser(name, email,hashedPass);
  return user;
};

export const getUsersService = async () => {
  const users = await getAllUsers();
  return users;
};