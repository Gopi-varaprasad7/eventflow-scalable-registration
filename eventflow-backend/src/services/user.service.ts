import { createUser, getAllUsers } from "../config/db";
import { AppError } from "../utils/appError";

export const createUserService = async (name: string, email: string) => {
  if (!name || !email) {
    throw new AppError("Name and Email are required", 400);
  }

  const user = await createUser(name, email);
  return user;
};

export const getUsersService = async () => {
  const users = await getAllUsers();
  return users;
};