# project_1 — Compliance Platform

Full-stack web application with a FastAPI JWT backend and a React frontend.

## Project Structure

```
project_1/
├── backend/   # FastAPI JWT authentication service
├── frontend/  # React + Vite web application
└── DESIGN.md  # Design system specification
```

## Quick Start

### 1. Start the Backend

```bash
cd backend
# With Poetry (recommended)
poetry install
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or with pip
pip install -r requirements.txt   # if applicable
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or with Docker Compose
docker compose up --build
```

The API will be available at http://localhost:8000.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173.

### Demo Credentials

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

## Application Overview

### Backend (`/backend`)

FastAPI service that issues and verifies JWT tokens.

| Endpoint       | Method | Description                             |
|----------------|--------|-----------------------------------------|
| `/auth/login`  | POST   | Authenticate and receive access + refresh tokens |
| `/auth/refresh`| POST   | Exchange a refresh token for a new access token  |
| `/users/me`    | GET    | Protected route – returns current user info      |

See [`backend/README.md`](backend/README.md) for full details.

### Frontend (`/frontend`)

React + Vite single-page application with:

- **Login page** (`/login`) — authenticates via the backend and stores the JWT in `sessionStorage`
- **Welcome page** (`/welcome`) — protected dashboard showing user info; requires authentication

See [`frontend/README.md`](frontend/README.md) for full details.

## Design System

The UI follows the Compliance Platform design specification defined in [`DESIGN.md`](DESIGN.md):

- **Palette**: Primary `#0F172A`, Background `#FAFAFA`, Surface `#F8F9FA`
- **Typography**: Inter font
- **Elevation**: Glass surfaces with gradient border shell
- **Motion**: 160ms/200ms transitions
