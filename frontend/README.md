# Compliance Platform — Frontend

React + Vite frontend for the JWT authentication project.

## Tech Stack

- **React 19** with React Router v7
- **Vite 6** dev server with proxy to FastAPI backend
- **WebGL** ambient background with custom GLSL shaders
- Inter font, glass-surface design system (no Tailwind, no UI library)

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (proxies /auth and /users to http://localhost:8000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Router setup
├── index.css                   # Global styles / design tokens
├── components/
│   ├── ProtectedRoute.jsx      # Auth guard — redirects to /login if unauthenticated
│   └── WebGLBackground.jsx     # WebGL ambient shader background
├── pages/
│   ├── LoginPage.jsx           # /login — POST /auth/login, stores token
│   └── WelcomePage.jsx         # /welcome — protected, GET /users/me
└── services/
    └── auth.js                 # login / logout / getToken / isAuthenticated / getMe
```

## Routes

| Path       | Component      | Auth required |
|------------|----------------|---------------|
| `/`        | → `/welcome`   | —             |
| `/login`   | LoginPage      | No            |
| `/welcome` | WelcomePage    | **Yes**       |
| `*`        | → `/welcome`   | —             |

## Authentication Flow

1. User submits credentials on `/login`.
2. `POST /auth/login` (form-data) returns `{ access_token, ... }`.
3. `access_token` is stored in `sessionStorage`.
4. All protected routes check `sessionStorage` via `ProtectedRoute`.
5. `/users/me` is called with `Authorization: Bearer <token>` to fetch the user profile.
6. Logout removes the token from `sessionStorage` and redirects to `/login`.

## Vite Proxy

In development the Vite dev server proxies API paths:

```
/auth  → http://localhost:8000
/users → http://localhost:8000
```

Make sure the FastAPI backend is running on port 8000 before starting the dev server.

## Design System

Follows the Compliance Platform design spec in `../DESIGN.md`:

- **Font**: Inter (loaded from Google Fonts)
- **Colors**: Primary `#0F172A`, Background `#FAFAFA`, Surface `#F8F9FA`
- **Elevation**: Gradient border shell technique with 12px backdrop blur
- **Motion**: 160ms/200ms, `ease` / `cubic-bezier(0.23, 1, 0.32, 1)`
- **WebGL**: Soft bloom haze, ambient drift, pointer-reactive, with DOM fallback
