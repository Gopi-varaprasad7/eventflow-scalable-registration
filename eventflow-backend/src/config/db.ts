import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL 🚀");
});

pool.on("error", (err:any) => {
  console.error("Unexpected DB error", err);
});

export const createUser = async (name:string,email:string,password:string) => {
    const result = await pool.query(
        "INSERT INTO users (name, email,password) VALUES ($1,$2,$3) RETURNING *", [name,email,password]
    )
    return result.rows[0];
}

export const getAllUsers = async () => {
    const result = await pool.query(
        "SELECT * FROM users"
    );
    return result.rows;
}