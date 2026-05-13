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

## 🧪 Module 14 – Test Stabilization + Edge Cases + CI Improvements
- Fixed failing Playwright E2E tests (timing issues, selectors, race conditions)
- Stabilized login flow and ensured JWT token handling works correctly in tests
- Added proper waits to handle async UI rendering (waitForSelector, toHaveURL)
- Fixed edit and delete calculation test failures
- Standardized API response handling (401 vs 403 issues)
- Covered key edge cases:
   - Division by zero
   - Invalid operation types
   - Empty/invalid inputs
   - Unauthorized requests
- Improved consistency between frontend validation and test expectations
- Ensured CI pipeline runs frontend + backend + Playwright tests reliably
- Verified Docker image build for module-14 release

---

## 🏁 Final Features Implemented
### 👤 User Profile Management
- Update first name, last name, email, username
- Backend validation for:
   - Duplicate email detection
   - Duplicate username detection
- Proper error responses returned to frontend
- Frontend displays validation messages dynamically
### 🔐 Password Change System
- Secure password update using bcrypt verification
- Validations:
   - Current password verification
   - New password must be at least 12 characters
   - New password cannot match old password
   - Required field validation
- Automatic logout after successful password change (security feature)
- Frontend redirect to login after password update
### 🌐 Frontend Enhancements
- Profile page with editable user fields
- Password change UI with validation messages
- Dashboard with logout functionality
- LocalStorage-based authentication handling
- Protected route enforcement (redirect if not logged in)
### 🧪 Comprehensive Testing Suite
Unit Tests
- Calculation factory logic
- Edge cases (power, division, invalid ops, case sensitivity)

Integration Tests
- Full API flow testing:
   - User registration/login
   - Profile updates
   - Password changes
   - Calculation CRUD operations
- Database integration verified

E2E Tests (Playwright)
- Full user journey:
   - Register → Login → Dashboard → Profile → Password Change → Re-login
- Negative test cases:
   - Duplicate email / username
   - Invalid email format
   - Password mismatch cases
   - Unauthorized access
- Token persistence validation
- Logout flow validation

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

├── dashboard.html

├── profile.html

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
### 2. Environment Variables

Create a .env file:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fastapi_db
```
Docker:
```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/fastapi_db
```
### 3. Install dependencies
```bash
pip install -r requirements.txt
npm install
```

### 4. 🧪 Running Tests

Backend Tests
```bash
pytest -v
```
Integration Tests 
```bash
pytest tests/integration
```

E2E Tests (Playwright)
```bash
npx playwright install
uvicorn app.main:app --reload
npx http-server frontend -p 8080
npx playwright test
```

### 5. 🌐 Run Frontend
```bash
cd frontend
npx http-server .
```
Open:

http://localhost:8080/register.html

## 🐳 Run with Docker 

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

Stop Docker:
```bash
docker compose down -v
```

📌 API Endpoints

User Routes
- POST /users/register – Register new user
- GET /users/{user_id} – Get user details
- GET /users/ – Get all user details

Auth Routes

- POST /users/login – Login and get JWT token

Profile Routes

- PUT /users/me
- PUT /users/change-password

Calculation Routes

- POST /calculations – Perform arithmetic operations
    
    Supported types:
  - addition
  - subtraction
  - multiplication
  - division
  - power
- GET /calculations/ - Get all calculations
- GET /calculations/{calc_id} - Get calculations by id
- PUT /calculations/{calc_id} - Update calculation by id
- DELETE /calculations/{calc_id} - Delete calculation by id

## 🐳 Docker Image

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
✅ Final Notes

This project demonstrates:

- Full-stack backend development
- Secure authentication system
- CRUD + business logic design
- Frontend-backend integration
- Comprehensive automated testing strategy
- CI/CD pipeline with Docker deployment