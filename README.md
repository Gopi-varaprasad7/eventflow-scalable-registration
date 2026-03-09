# EventFlow Backend

EventFlow is a scalable backend for managing events and registrations.  
It is built using Node.js, Express, PostgreSQL, Redis, and Docker.

The project demonstrates production-ready backend architecture including caching, rate limiting, transactional operations, and API documentation.

---

## Features

- User authentication
- Event creation and management
- Event registration and cancellation
- Event capacity limits
- Transaction-safe registration
- Redis caching for faster responses
- Redis-based rate limiting
- Swagger API documentation
- Dockerized environment

---

## Tech Stack

Backend:
- Node.js
- Express.js
- TypeScript

Database:
- PostgreSQL

Caching & Rate Limiting:
- Redis

Infrastructure:
- Docker
- Docker Compose

API Documentation:
- Swagger

---

## System Architecture

Client
   ↓
Express API
   ↓
Redis (Caching + Rate Limiting)
   ↓
PostgreSQL (Database)

---

## Project Structure

src/
 ├── config/
 │    ├── redis.ts
 │    └── swagger.ts
 │
 ├── controllers/
 │
 ├── middlewares/
 │    ├── auth.middleware.ts
 │    ├── error.middleware.ts
 │    └── rateLimiter.ts
 │
 ├── routes/
 │    ├── auth.routes.ts
 │    ├── event.routes.ts
 │    └── user.routes.ts
 │
 ├── models/
 │
 └── app.ts

Dockerfile
docker-compose.yml
package.json
tsconfig.json

---

## Running the Project

Clone the repository

git clone https://github.com/YOUR_USERNAME/eventflow-backend.git

Go to project directory

cd eventflow-backend

Start containers

docker compose up --build

Server will run at

http://localhost:5001

---

## API Documentation

Swagger documentation is available at:

http://localhost:5001/docs

You can test APIs directly from the browser.

---

## Example API Endpoints

Create Event

POST /events

Get All Events

GET /events

Register for Event

POST /events/:id/register

Get Event Attendees

GET /events/:id/attendees

Event Statistics

GET /events/:id/stats

---

## Performance Optimizations

Redis caching for event listing

Database indexing for faster queries

Rate limiting using Redis to prevent abuse

Transaction-based event registration to prevent overbooking

---

## Future Improvements

Email notifications for event reminders

Background job queues

Pagination improvements

Search and filtering for events

Cloud deployment

---

## Author

Built by Gopi Varaprasad Koduri