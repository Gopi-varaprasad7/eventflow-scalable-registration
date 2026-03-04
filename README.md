🚀 EventFlow – Scalable Registration Backend
  A scalable backend system for managing events and user registrations.
  Built with Dockerized microservices architecture using Node.js, PostegreSQL and Redis

🛠️ Tech Stack
  Node.js
  Express
  TypeScript
  PostgreSQL
  Redis
  Docker & Docker Compose
  express-validator

🏗️ Architecture
  Browser
   ↓
  Express API (Port 5001)
   ↓
  PostgreSQL (Port 5432)
   ↓
  Redis (Port 6379)

📂 Project Structure
    src/
      │
      ├── config/
      │   └── db.ts
      │
      ├── models/
      │   └── user.model.ts
      │
      ├── controllers/
      │   └── user.controller.ts
      │
      ├── routes/
      │   └── user.routes.ts
      │
      ├── app.ts
      └── server.ts

🚀 How To Run Locally
  1.Clone the repository
      git clone <your-repo-url>
      cd eventflow-backend
  2.Start docker container
      docker compose up --build
      
  Server will run at: http://localhost:5001

  📌 API Documentation
    Base URL :- http://localhost:5001
    📍 GET /users

Description: Returns all registered users.
Response Type: application/json
✅ Success Response (200)
  {
    "success": true,
    "users": [
      {
        "id": 1,
        "name": "Gopi",
        "email": "gopi@test.com",
        "created_at": "2026-03-01T05:37:01.951Z"
      }
    ]
  }
  
📍 POST /users

Description: Creates a new user.
Request Type: application/json
📥 Request Body
  {
    "name": "string",
    "email": "string"
  }
✅ Success Response (200)
  {
    "success": true,
    "user": {
      "id": 1,
      "name": "Gopi",
      "email": "gopi@test.com",
      "created_at": "2026-03-01T05:37:01.951Z"
    }
  }
  ❌ Validation Error (400)
  {
    "success": false,
    "errors": [
      {
        "msg": "Name is required"
      },
      {
        "msg": "Invalid email"
      }
    ]
  }

🧪 Example CURL Requests
Create User
  curl -X POST http://localhost:5001/users \
    -H "Content-Type: application/json" \
    -d '{"name":"Gopi","email":"gopi@test.com"}'
  
Get All Users
  curl http://localhost:5001/users

🗄️ Database Schema
  users table
  Column	Type	Description
  id	SERIAL	Primary key
  name	VARCHAR	User name
  email	VARCHAR	Unique email address
  created_at	TIMESTAMP	Auto-generated timestamp

🔒 Validation Rules

  name → Required, minimum 2 characters
  email → Required, valid email format
  email → Must be unique

📦 Docker Services
  Service	Port	Description
  app	5001	Express API
  postgres	5432	Database
  redis	6379	Cache layer

🎯 Future Roadmap

 Events module
 Registration system
 Authentication (JWT)
 Redis caching
 Rate limiting
 Swagger documentation
 Production multi-stage Docker build
 CI/CD pipeline

👨‍💻 Author
  Gopi
  Backend Engineer (Learning & Building Scalable Systems)

💡 Notes

  Docker volumes ensure data persistence.
  Validation prevents invalid data from reaching the database.
  Project follows layered architecture (Model → Controller → Route).
