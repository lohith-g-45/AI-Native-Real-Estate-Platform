# AI Native Real Estate Platform

## Overview

- Backend: `AI-Native-Real-Estate-Platform` root directory.
- Frontend: `AI-Native-Real-Estate-Platform/Frontend` static site.

The frontend is a simple HTML/CSS/JS static app. It should call the backend API at `http://localhost:3000/v1/auth`.

## Run the Backend

1. Open a terminal in the project root:
   - `D:\Ai_native_real-estate\AI-Native-Real-Estate-Platform`
2. Install dependencies (if needed):
   - `pnpm install`
3. Create `.env` from `.env.example` and update values:
   - `DB_TYPE=postgres` or `sqlite`
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`, `SMTP_*` values if email is used
4. Start the backend:
   - `pnpm run start:dev`
5. The backend listens on:
   - `http://localhost:3000`

## Run the Frontend

The frontend is static files in the `Frontend` folder.

Example local server command:

```powershell
Set-Location 'D:\Ai_native_real-estate\AI-Native-Real-Estate-Platform'
python -m http.server 8001 --directory .\Frontend
```

Then open in the browser:

- `http://localhost:8001`

## Backend API Base URL

Use this base URL from frontend code:

- `http://localhost:3000/v1/auth`

## Available Backend Routes

The frontend should call these backend endpoints.

- `GET /v1/auth/health`
  - Health check. Returns `{ status: 'ok', module: 'auth-identity' }`
- `POST /v1/auth/register`
  - Register a new user.
- `POST /v1/auth/login`
  - Login with credentials.
- `POST /v1/auth/logout`
  - Logout. Requires `Authorization: Bearer <token>` header.
- `POST /v1/auth/password-reset/request`
  - Request password reset email.
- `POST /v1/auth/password-reset`
  - Reset password with token.
- `POST /v1/auth/verify-email/request`
  - Request email verification.
- `POST /v1/auth/verify-email`
  - Verify email with token.
- `POST /v1/auth/verify-phone/request`
  - Request phone verification.
- `POST /v1/auth/verify-phone`
  - Verify phone with token.
- `GET /v1/auth/profile`
  - Returns user profile. Requires `Authorization: Bearer <token>`.
- `GET /v1/auth/google`
  - Starts Google OAuth login.
- `GET /v1/auth/google/redirect`
  - OAuth redirect callback.

## Frontend to Backend Wiring

In the frontend code, set the API URL constant like:

```js
const API_BASE = 'http://localhost:3000/v1/auth';
```

Then use `fetch` or `axios` to call the routes.

Example login request:

```js
await fetch(`${API_BASE}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

Example protected request:

```js
await fetch(`${API_BASE}/profile`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Notes for Your Friend

- The backend is NestJS and runs on port `3000`.
- The frontend is static and runs on port `8001` when served locally.
- Use POST requests from the frontend. Do not type POST routes directly into the browser address bar.
- If using `DB_TYPE=postgres`, make sure Postgres is running and the database exists.
- If `DB_TYPE=sqlite`, the app will use a local SQLite file.

## Current Frontend Status

- `Frontend/index.html` is the landing page.
- `Frontend/js/main.js` contains navigation logic only.
- `Frontend/register.html` and `Frontend/dashboard.html` are placeholders and need real form/API code.

## Recommended Next Step

Add actual frontend form pages that send JSON to the backend routes above and store the returned JWT in `localStorage`.
