# 🧮  User Calculation API (FastAPI + PostgreSQL + Docker + CI/CD)

This project is a full-stack backend system built using FastAPI with PostgreSQL, JWT authentication, frontend UI, automated testing, and CI/CD pipeline using GitHub Actions and Docker.


---
# 🚀 Project Modules
## 📦 Module 12 (Backend + Docker + DB)

- User registration and authentication
- Password hashing using bcrypt
- JWT-based authentication
- Basic arithmetic calculation operations
- PostgreSQL database integration
- Full Docker support
- Pytest-based unit and integration testing

---
## 🌐 Module 13 (Frontend + E2E + CI/CD)

- HTML frontend (Register + Login pages)
- JavaScript API integration (fetch calls)
- JWT stored in localStorage
- Playwright end-to-end testing
- GitHub Actions CI/CD pipeline
- Automated Docker image build & push 

---

## 🛠️ Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic v2
- Passlib (bcrypt)
- Python-JOSE (JWT)
- HTML + JavaScript
- Playwright
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

frontend/

├── register.html

├── login.html

└── app.js

tests/

├── e2e/

├── unit/

├── integration/

└── conftest.py

.github/

└── workflows/

    └── test.yml


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
Docker:
```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/fastapi_db
```
## 🧪 Running Playwright Tests

Follow this order:

### 1. Install dependencies
```bash
pip install -r requirements.txt
npm install
```
2. Install Playwright browsers
```bash
npx playwright install --with-deps
```
3. Start backend server
```bash
uvicorn app.main:app --reload
```
4. Start frontend server
```bash
cd frontend
npx http-server .
```
5. Run Playwright tests
```bash
npx playwright test
```

🌐 Run Frontend
```bash
cd frontend
npx http-server .
```
Open:

http://localhost:8080/register.html

http://localhost:8080/login.html

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

🧪 Run Tests

Inside Docker:
```bash
docker compose exec web pytest -v
```
Locally backend:
```bash
pytest -v
```
E2E tests (Playwright)
```bash
npx playwright install
npx playwright test
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
Passwords hashed using bcrypt
JWT authentication (HS256)
Token stored in browser localStorage

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