import { pool } from '../config/db';

export const initDB = async () => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
    );
    await pool.query(
      `CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            location VARCHAR(200),
            event_date TIMESTAMP NOT NULL,
            created_by INTEGER REFERENCES users(id),
            max_attendees INT DEFAULT 100,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
`,
    );
    await pool.query(`
    CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        event_id INTEGER REFERENCES events(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id,event_id)
    )
`);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS event_waitlist (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        event_id INT REFERENCES events(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS processed_events (
      event_id VARCHAR PRIMARY KEY,
      processed_at TIMESTAMP DEFAULT NOW()
);`);
    console.log('Tables ready');
  } catch (err) {
    console.error('error creating table', err);
  }
};
