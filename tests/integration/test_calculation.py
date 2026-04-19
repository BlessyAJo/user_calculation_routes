import pytest


# -------------------------
# CREATE - PARAMETRIZED CORE OPS
# -------------------------
@pytest.mark.parametrize(
    "a,b,op,expected",
    [
        (10, 5, "addition", 15),
        (10, 5, "subtraction", 5),
        (10, 5, "multiplication", 50),
        (10, 5, "division", 2),
        (-10, 5, "addition", -5),
        (2.5, 2.5, "multiplication", 6.25),
        (1e10, 2, "multiplication", 2e10),
    ]
)
def test_create_calculation(client, a, b, op, expected):
    res = client.post("/calculations/", json={
        "a": a,
        "b": b,
        "type": op
    })

    assert res.status_code == 200
    assert res.json()["result"] == expected


# -------------------------
# INVALID INPUTS
# -------------------------
@pytest.mark.parametrize(
    "payload,status",
    [
        ({"a": 10, "b": 0, "type": "division"}, 400),
        ({"a": 10, "b": 5, "type": "invalid"}, 422),
        ({"a": 10}, 422),
        ({}, 422),
        ({"a": "abc", "b": 5, "type": "addition"}, 422),
    ]
)
def test_invalid_calculations(client, payload, status):
    res = client.post("/calculations/", json=payload)
    assert res.status_code == status


# -------------------------
# FULL CRUD FLOW
# -------------------------
def test_full_crud_flow(client):
    create = client.post("/calculations/", json={
        "a": 4,
        "b": 2,
        "type": "division"
    })
    assert create.status_code == 200

    cid = create.json()["id"]

    # READ
    assert client.get(f"/calculations/{cid}").status_code == 200

    # UPDATE
    upd = client.put(f"/calculations/{cid}", json={
        "a": 5,
        "b": 5,
        "type": "multiplication"
    })
    assert upd.status_code == 200
    assert upd.json()["result"] == 25

    # DELETE
    assert client.delete(f"/calculations/{cid}").status_code == 200

    # VERIFY DELETE
    assert client.get(f"/calculations/{cid}").status_code == 404


# -------------------------
# NOT FOUND CASES
# -------------------------
def test_not_found_cases(client):
    fake = "00000000-0000-0000-0000-000000000000"

    assert client.get(f"/calculations/{fake}").status_code == 404
    assert client.put(f"/calculations/{fake}", json={
        "a": 1, "b": 1, "type": "addition"
    }).status_code == 404
    assert client.delete(f"/calculations/{fake}").status_code == 404


# -------------------------
# EDGE CASES
# -------------------------
def test_negative_and_zero(client):
    res = client.post("/calculations/", json={
        "a": -10,
        "b": 0,
        "type": "addition"
    })

    assert res.status_code == 200
    assert res.json()["result"] == -10


def test_float_precision(client):
    res = client.post("/calculations/", json={
        "a": 0.1,
        "b": 0.2,
        "type": "addition"
    })

    assert res.status_code == 200