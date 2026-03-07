import bcrypt from "bcrypt";
import { getUserByEmail } from "../repository/user.repository";
import { generateToken } from "../utils/jwt";

export const loginUser = async (email: string, password: string) => {

  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};