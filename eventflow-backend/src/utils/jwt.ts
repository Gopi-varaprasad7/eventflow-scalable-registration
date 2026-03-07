import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const generateToken = (user: any, role: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};