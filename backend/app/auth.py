import bcrypt as _bcrypt
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt

from app.config import settings

# ─── Password helpers ──────────────────────────────────────────────────────────

def verify_password(plain: str, hashed: bytes) -> bool:
    return _bcrypt.checkpw(plain.encode(), hashed)


def get_password_hash(plain: str) -> bytes:
    return _bcrypt.hashpw(plain.encode(), _bcrypt.gensalt())


# Pre-hash the demo password so it is never stored in plain text at runtime.
_ADMIN_HASHED_PASSWORD: bytes = get_password_hash(settings.admin_password)


def authenticate_user(username: str, password: str) -> bool:
    """Return True when credentials match the configured admin account."""
    return username == settings.admin_username and verify_password(
        password, _ADMIN_HASHED_PASSWORD
    )


# ─── Token helpers ─────────────────────────────────────────────────────────────

def _create_token(data: dict[str, Any], expire_seconds: int) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(seconds=expire_seconds)
    payload.update({"exp": expire})
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_access_token(username: str) -> str:
    return _create_token(
        {"sub": username, "type": "access"},
        settings.access_token_expire_seconds,
    )


def create_refresh_token(username: str) -> str:
    return _create_token(
        {"sub": username, "type": "refresh"},
        settings.refresh_token_expire_seconds,
    )


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT.  Raises JWTError on failure."""
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])


def get_username_from_refresh_token(token: str) -> str:
    """Extract the subject from a refresh token, raising JWTError on failure."""
    payload = decode_token(token)
    if payload.get("type") != "refresh":
        raise JWTError("Not a refresh token")
    sub: str | None = payload.get("sub")
    if sub is None:
        raise JWTError("Missing subject in token")
    return sub


def get_username_from_access_token(token: str) -> str:
    """Extract the subject from an access token, raising JWTError on failure."""
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise JWTError("Not an access token")
    sub: str | None = payload.get("sub")
    if sub is None:
        raise JWTError("Missing subject in token")
    return sub
