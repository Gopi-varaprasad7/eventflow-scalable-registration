import { pool } from "../config/db";

export const initDB = async () => {
    try{
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`    
        );
        console.log("user table is ready")
    }
    catch(err){
        console.error("error creating table", err);
    }
}