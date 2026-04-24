"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
const db_1 = require("../config/db");
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
        yield db_1.pool.query(`CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            location VARCHAR(200),
            event_date TIMESTAMP NOT NULL,
            created_by INTEGER REFERENCES users(id),
            max_attendees INT DEFAULT 100,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
`);
        yield db_1.pool.query(`
    CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        event_id INTEGER REFERENCES events(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id,event_id)
    )
`);
        yield db_1.pool.query(`
        CREATE TABLE IF NOT EXISTS event_waitlist (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        event_id INT REFERENCES events(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        yield db_1.pool.query(`
      CREATE TABLE IF NOT EXISTS processed_events (
      event_id VARCHAR PRIMARY KEY,
      processed_at TIMESTAMP DEFAULT NOW()
);`);
        yield db_1.pool.query(`CREATE TABLE outbox_events (
    id UUID PRIMARY KEY,
    topic VARCHAR NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);`);
        console.log('Tables ready');
    }
    catch (err) {
        console.error('error creating table', err);
    }
});
exports.initDB = initDB;
