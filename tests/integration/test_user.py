import pytest


# -------------------------
# REGISTER USER - SUCCESS
# -------------------------
def test_register_user_success(client):
    response = client.post("/users/register", json={
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@test.com",
        "username": "johndoe",
        "password": "password123"
    })

    assert response.status_code == 200
    data = response.json()

    assert data["email"] == "john@test.com"
    assert "id" in data


# -------------------------
# DUPLICATE USER
# -------------------------
def test_register_duplicate_user(client):
    payload = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@test.com",
        "username": "janedoe",
        "password": "password123"
    }

    client.post("/users/register", json=payload)
    response = client.post("/users/register", json=payload)

    assert response.status_code == 400


# -------------------------
# INVALID EMAIL
# -------------------------
def test_register_invalid_email(client):
    response = client.post("/users/register", json={
        "first_name": "Bad",
        "last_name": "Email",
        "email": "invalid-email",
        "username": "bademail",
        "password": "password123"
    })

    assert response.status_code == 422


# -------------------------
# LOGIN SUCCESS
# -------------------------
def test_login_success(client):
    client.post("/users/register", json={
        "first_name": "Login",
        "last_name": "User",
        "email": "login@test.com",
        "username": "loginuser",
        "password": "password123"
    })

    response = client.post("/users/login", json={
        "username": "loginuser",
        "password": "password123"
    })

    assert response.status_code == 200
    data = response.json()

    assert "access_token" in data
    assert data["user"]["username"] == "loginuser"


# -------------------------
# LOGIN FAILURES (PARAMETRIZED)
# -------------------------
@pytest.mark.parametrize(
    "username,password,expected",
    [
        ("validuser", "password123", 200),
        ("validuser", "wrongpass", 401),
        ("nouser", "password123", 401),
    ]
)
def test_login_cases(client, username, password, expected):

    client.post("/users/register", json={
        "first_name": "Test",
        "last_name": "User",
        "email": "valid@test.com",
        "username": "validuser",
        "password": "password123"
    })

    response = client.post("/users/login", json={
        "username": username,
        "password": password
    })

    assert response.status_code == expected


# -------------------------
# INVALID LOGIN (EDGE)
# -------------------------
def test_invalid_login(client):
    response = client.post("/users/login", json={
        "username": "wrong",
        "password": "wrong"
    })

    assert response.status_code == 401


# -------------------------
# GET USER BY ID (MISSING BEFORE)
# -------------------------
def test_get_user_by_id(client):
    reg = client.post("/users/register", json={
        "first_name": "Get",
        "last_name": "User",
        "email": "get@test.com",
        "username": "getuser",
        "password": "password123"
    })

    user_id = reg.json()["id"]

    response = client.get(f"/users/{user_id}")

    assert response.status_code == 200
    assert response.json()["username"] == "getuser"


# -------------------------
# GET NON EXISTENT USER (404)
# -------------------------
def test_get_nonexistent_user(client):
    response = client.get("/users/00000000-0000-0000-0000-000000000000")

    assert response.status_code == 404