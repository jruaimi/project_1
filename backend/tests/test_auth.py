"""
Tests for the JWT authentication service.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# ─── /auth/login ──────────────────────────────────────────────────────────────


def test_login_success():
    response = client.post(
        "/auth/login", data={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in body
    assert body["token_type"] == "bearer"
    assert body["expires_in"] == 300


def test_login_wrong_password():
    response = client.post(
        "/auth/login", data={"username": "admin", "password": "wrong"}
    )
    assert response.status_code == 401


def test_login_wrong_username():
    response = client.post(
        "/auth/login", data={"username": "notadmin", "password": "admin123"}
    )
    assert response.status_code == 401


# ─── /auth/refresh ────────────────────────────────────────────────────────────


def test_refresh_success():
    login_resp = client.post(
        "/auth/login", data={"username": "admin", "password": "admin123"}
    )
    refresh_token = login_resp.json()["refresh_token"]

    response = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"
    assert body["expires_in"] == 300


def test_refresh_with_invalid_token():
    response = client.post("/auth/refresh", json={"refresh_token": "notavalidtoken"})
    assert response.status_code == 401


def test_refresh_with_access_token_fails():
    """Passing an access token to /auth/refresh must be rejected."""
    login_resp = client.post(
        "/auth/login", data={"username": "admin", "password": "admin123"}
    )
    access_token = login_resp.json()["access_token"]

    response = client.post("/auth/refresh", json={"refresh_token": access_token})
    assert response.status_code == 401


# ─── /users/me ────────────────────────────────────────────────────────────────


def test_users_me_authenticated():
    login_resp = client.post(
        "/auth/login", data={"username": "admin", "password": "admin123"}
    )
    access_token = login_resp.json()["access_token"]

    response = client.get(
        "/users/me", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["username"] == "admin"
    assert body["role"] == "admin"


def test_users_me_unauthenticated():
    response = client.get("/users/me")
    assert response.status_code == 401


def test_users_me_invalid_token():
    response = client.get(
        "/users/me", headers={"Authorization": "Bearer invalidtoken"}
    )
    assert response.status_code == 401
