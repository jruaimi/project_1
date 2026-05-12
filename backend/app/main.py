import logging
import warnings
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError

from app.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_username_from_access_token,
    get_username_from_refresh_token,
)
from app.config import settings
from app.schemas import AccessTokenResponse, RefreshRequest, TokenResponse, UserInfo

logger = logging.getLogger(__name__)

_DEFAULT_SECRET = "INSECURE_DEFAULT_CHANGE_ME"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    if settings.secret_key == _DEFAULT_SECRET:
        warnings.warn(
            "SECRET_KEY is set to the default placeholder value. "
            "Set a strong random SECRET_KEY before deploying to production.",
            UserWarning,
            stacklevel=1,
        )
        logger.warning(
            "⚠️  SECRET_KEY is using the default insecure value. "
            "Please set a strong SECRET_KEY via environment variable or .env file."
        )
    yield


app = FastAPI(
    title="JWT Authentication Service",
    description="FastAPI service that issues and refreshes JWT tokens.",
    version="0.1.0",
    lifespan=lifespan,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ─── Auth routes ──────────────────────────────────────────────────────────────


@app.post(
    "/auth/login",
    response_model=TokenResponse,
    summary="Obtain access and refresh tokens",
)
def login(form_data: OAuth2PasswordRequestForm = Depends()) -> TokenResponse:
    """Authenticate with **username** and **password**.

    Returns an access token (valid for
    `{expire}` seconds) and a refresh token.
    """.format(
        expire=settings.access_token_expire_seconds
    )
    if not authenticate_user(form_data.username, form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenResponse(
        access_token=create_access_token(form_data.username),
        refresh_token=create_refresh_token(form_data.username),
        expires_in=settings.access_token_expire_seconds,
    )


@app.post(
    "/auth/refresh",
    response_model=AccessTokenResponse,
    summary="Refresh an access token",
)
def refresh_token(body: RefreshRequest) -> AccessTokenResponse:
    """Exchange a valid **refresh token** for a new access token."""
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        username = get_username_from_refresh_token(body.refresh_token)
    except JWTError:
        raise credentials_error
    return AccessTokenResponse(
        access_token=create_access_token(username),
        expires_in=settings.access_token_expire_seconds,
    )


# ─── Protected route (demo) ───────────────────────────────────────────────────


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        return get_username_from_access_token(token)
    except JWTError:
        raise credentials_error


@app.get(
    "/users/me",
    response_model=UserInfo,
    summary="Get current authenticated user",
)
def read_users_me(current_user: str = Depends(get_current_user)) -> UserInfo:
    """Returns information about the currently authenticated user."""
    return UserInfo(username=current_user, role="admin")
