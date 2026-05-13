import uuid

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
username = f"user_{uuid.uuid4()}"
email = f"{username}@test.com"
@pytest.mark.parametrize(
    "username,password,expected",
    [
        (username, "password123", 200),
        (username, "wrongpass", 401),
        ("nouser", "password123", 401),
    ]
)
def test_login_cases(client, username, password, expected):

    client.post("/users/register", json={
        "first_name": "Test",
        "last_name": "User",
        "email": email,
        "username": username,
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

# -------------------------
def test_update_profile_success(client, auth_headers):
    res = client.put("/users/me", json={
        "first_name": "Updated",
        "last_name": "User",
        "email": "updated@test.com",
        "username": "updateduser"
    }, headers=auth_headers)

    assert res.status_code == 200
    data = res.json()
    assert data["first_name"] == "Updated"


def test_update_profile_unauthorized(client):
    res = client.put("/users/me", json={
        "first_name": "X",
        "last_name": "Y",
        "email": "x@y.com",
        "username": "xuser"
    })

    assert res.status_code in [401, 403]

def test_change_password_success(client, auth_headers):

    res = client.put("/users/change-password", json={
        "current_password": "testpassword",
        "new_password": "newsecurepassword123"
    }, headers=auth_headers)

    assert res.status_code == 200
    assert res.json()["message"] == "Password updated successfully"

def test_change_password_wrong_current(client, auth_headers):

    res = client.put("/users/change-password", json={
        "current_password": "wrongpassword",
        "new_password": "newsecurepassword123"
    }, headers=auth_headers)

    assert res.status_code == 400

def test_login_after_password_change(client, auth_headers):

    client.put("/users/change-password", json={
        "current_password": "testpassword",
        "new_password": "newsecurepassword123"
    }, headers=auth_headers)

    login = client.post("/users/login", json={
        "username": auth_headers["username"],
        "password": "newsecurepassword123"
    })

    assert login.status_code == 200

def test_update_profile_invalid_email(client, auth_headers):

    res = client.put("/users/me", json={
        "first_name": "A",
        "last_name": "B",
        "email": "invalid-email",
        "username": "abc"
    }, headers=auth_headers)

    assert res.status_code == 422

def test_change_password_same_as_old(client, auth_headers):

    res = client.put("/users/change-password", json={
        "current_password": "testpassword",
        "new_password": "testpassword"
    }, headers=auth_headers)

    assert res.status_code == 400
    assert "same as old password" in res.json()["error"].lower()


def test_change_password_too_short(client, auth_headers):

    res = client.put("/users/change-password", json={
        "current_password": "testpassword",
        "new_password": "short"
    }, headers=auth_headers)

    assert res.status_code == 400
    assert "at least 12 characters" in res.json()["error"].lower()