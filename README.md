# 🧮 User Calculation API (FastAPI + PostgreSQL + Docker)

This project is a backend REST API built using FastAPI that supports user management and basic calculation operations. It uses PostgreSQL as the database, SQLAlchemy as the ORM, and Docker for containerization.

---

## 🚀 Features(Module 12)

- User registration and authentication
- Password hashing using bcrypt
- JWT-based authentication
- Basic arithmetic calculation operations
- PostgreSQL database integration
- Full Docker support
- Pytest-based unit and integration testing

---

## 🛠️ Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic v2
- Passlib (bcrypt)
- Python-JOSE (JWT)
- Docker & Docker Compose
- Pytest

---

## 📁 Project Structure
app/

├── main.py

├── core/

├── database.py

├── models/

├── routes/

├── schemas/

├── factory/

└── utils/


tests/

├── unit/

├── integration/

└── conftest.py

docker-compose.yml

Dockerfile

requirements.txt


---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd user_calculation_routes
```
2. Environment Variables

Create a .env file:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fastapi_db
```
Local:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fastapi_db
```
Docker:
```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/fastapi_db
```
Add local run command:
```bash
uvicorn app.main:app --reload
```

🐳 Run with Docker 

Build and start services

```bash
docker compose up --build
```
API will be available at:
```bash
http://localhost:8000
```
Swagger UI:
```bash
http://localhost:8000/docs
```

🧪 Run Integration Tests

Inside Docker:
```bash
docker compose exec web pytest -v
```
Locally:
```bash
pytest -v
```
## 🧪 Integration Tests

Integration tests verify the full system including:
- FastAPI routes
- Database connection (PostgreSQL)
- Authentication flow
- Business logic execution

Stop Docker:
```bash
docker compose down -v
```
🔐 Authentication

Passwords are hashed using bcrypt:

```bash
from passlib.context import CryptContext
```

JWT is used for authentication:

- HS256 algorithm
- Expiry-based access tokens

📌 API Endpoints

User Routes
- POST /users/register – Register new user
- GET /users/{user_id} – Get user details
- GET /users/ – Get all user details

Auth Routes

- POST /users/login – Login and get JWT token

Calculation Routes

- POST /calculations – Perform arithmetic operations
- GET /calculations/ - Get all calculations
- GET /calculations/{calc_id} - Get calculations by id
- PUT /calculations/{calc_id} - Update calculation by id
- DELETE /calculations/{calc_id} - Delete calculation by id

🐳 Docker Image

The project is available on Docker Hub:

https://hub.docker.com/r/blessyajo/user_calculation_routes

### Pull Image:
```bash
docker pull blessyajo/user_calculation_routes:latest
```
Run Image:
```bash 
docker run -p 8000:8000 blessyajo/user_calculation_routes:latest
```