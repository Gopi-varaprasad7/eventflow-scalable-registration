import bcrypt from 'bcrypt';
import { pool } from '../config/db';
import {generateToken} from '../utils/jwt';

export const loginUser = async (email:string,password:string) => {
    const result  = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
    const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id);

  return {
    user,
    token
  };
}