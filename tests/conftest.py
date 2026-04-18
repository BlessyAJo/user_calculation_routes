import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db


# -------------------------
# TEST DATABASE
# -------------------------
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/test_fastapi_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# -------------------------
# OVERRIDE DB DEPENDENCY
# -------------------------
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


# -------------------------
# CREATE TEST DB TABLES
# -------------------------
@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# -------------------------
# TEST CLIENT
# -------------------------
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


# -------------------------
# USER FIXTURE
# -------------------------
@pytest.fixture
def test_user():
    return {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "password": "securepass123"
    }