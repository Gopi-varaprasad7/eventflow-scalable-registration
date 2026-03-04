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

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
});

export const createUser = async (name:string,email:string) => {
    const result = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1,$2) RETURNING *", [name,email]
    )
    return result.rows[0];
}

export const getAllUsers = async () => {
    const result = await pool.query(
        "SELECT * FROM users"
    );
    return result.rows;
}