# JWT Authentication Service

A lightweight **FastAPI** web service that demonstrates a complete **JWT (JSON Web Token)** authentication workflow.  
Dependencies are managed with **[Poetry](https://python-poetry.org/)** and the application can be deployed with **Docker / Docker Compose**.

---

## Features

| Endpoint | Method | Description |
|---|---|---|
| `/auth/login` | `POST` | Authenticate and receive an access token (300 s) + refresh token |
| `/auth/refresh` | `POST` | Exchange a refresh token for a new access token |
| `/users/me` | `GET` | Protected route – returns the current user's info |
| `/docs` | `GET` | Auto-generated Swagger UI |
| `/redoc` | `GET` | Auto-generated ReDoc UI |

### Demo credentials

| Field | Value |
|---|---|
| username | `admin` |
| password | `admin123` |

---

## Project structure

```
backend/
├── app/
│   ├── auth.py        # JWT helpers (create / verify tokens, password hashing)
│   ├── config.py      # Settings loaded from environment variables / .env
│   ├── main.py        # FastAPI application and route definitions
│   └── schemas.py     # Pydantic request / response models
├── tests/
│   └── test_auth.py   # Pytest test suite
├── docker-compose.yml
├── Dockerfile
├── pyproject.toml     # Poetry project & dependency declaration
└── README.md
```

---

## Quick start

### Option A – Docker Compose (recommended)

```bash
# From the backend/ directory
docker compose up --build
```

The API will be available at <http://localhost:8000>.

### Option B – Local development with pip

**Prerequisites:** Python 3.11+

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Usage examples

### 1. Login – obtain tokens

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

**Response**

```json
{
  "access_token": "<JWT>",
  "refresh_token": "<JWT>",
  "token_type": "bearer",
  "expires_in": 300
}
```

### 2. Access a protected route

```bash
ACCESS_TOKEN="<access_token from step 1>"

curl http://localhost:8000/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Response**

```json
{
  "username": "admin",
  "role": "admin"
}
```

### 3. Refresh the access token

```bash
REFRESH_TOKEN="<refresh_token from step 1>"

curl -X POST http://localhost:8000/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\": \"$REFRESH_TOKEN\"}"
```

**Response**

```json
{
  "access_token": "<new JWT>",
  "token_type": "bearer",
  "expires_in": 300
}
```

---

## Running the tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest -v
```

---

## Configuration

Settings can be overridden via environment variables or a `.env` file placed in the `backend/` directory.

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | `supersecretkey_change_in_production` | HMAC signing key – **change this in production** |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_SECONDS` | `300` | Access token lifetime in seconds |
| `REFRESH_TOKEN_EXPIRE_SECONDS` | `86400` | Refresh token lifetime in seconds (24 h) |
| `ADMIN_USERNAME` | `admin` | Demo admin username |
| `ADMIN_PASSWORD` | `admin123` | Demo admin password |

> ⚠️ **Security notice:** The default `SECRET_KEY` and credentials are for demonstration purposes only.  
> Always set a strong, randomly generated `SECRET_KEY` and store credentials securely (e.g. hashed in a database) before deploying to production.
