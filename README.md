# AI Native Real Estate Platform

This repository contains the NestJS backend for the AI Native Real Estate platform.

## What is implemented

- User authentication backend with **NestJS** and **TypeORM**
- PostgreSQL / SQLite support via `DB_TYPE`
- JWT login and protected routes
- Email-based password reset flow
- Email verification flow
- JWT logout revocation with persistent blacklist storage
- Real SMTP email delivery support via `MailService`
- Postman collection for manual local API testing

> Note: Google OAuth and Twilio SMS are not required for the current backend test cycle and are intentionally left for later.

## Local setup

1. Copy `.env.example` to `.env`
2. Fill in your PostgreSQL and SMTP details
3. Run:

```bash
pnpm install
pnpm exec tsc --noEmit
pnpm run start:dev
```

If the app starts successfully, the API base is:

```text
http://localhost:3000
```

## Available backend routes

### Public routes
- `POST /v1/auth/register` — create a new user
- `POST /v1/auth/login` — login and receive a JWT
- `POST /v1/auth/password-reset/request` — request password reset email
- `POST /v1/auth/password-reset` — confirm password reset with token
- `POST /v1/auth/verify-email/request` — send email verification link
- `POST /v1/auth/verify-email` — confirm email verification with token

### Protected routes
- `POST /v1/auth/logout` — revoke the current token
- `GET /v1/auth/profile` — get authenticated user profile

### Health
- `GET /v1/auth/health`

## Postman test collection

Import the collection and environment from:

- `postman/AI-Native-Real-Estate-Platform.postman_collection.json`
- `postman/AI-Native-Real-Estate-Platform.postman_environment.json`

Set `{{baseUrl}}` to `http://localhost:3000` and run the requests in the following order:

1. `Register`
2. `Login`
3. `Request Password Reset`
4. `Request Email Verification`
5. `Logout`
6. `Get Profile`

## Frontend integration guidance

Your frontend should connect to the backend using the API endpoints above.

### What the frontend must do

- Send `POST /v1/auth/register` with:
  - `email`
  - `password`
  - `fullName`
- Send `POST /v1/auth/login` with:
  - `email`
  - `password`
- Store the returned `accessToken` and send it as:
  - `Authorization: Bearer <accessToken>`
- Use protected routes after login:
  - `GET /v1/auth/profile`
  - `POST /v1/auth/logout`
- Support password-reset flow:
  - request reset via `POST /v1/auth/password-reset/request`
  - submit reset token to `POST /v1/auth/password-reset`
- Support email verification flow:
  - request verification via `POST /v1/auth/verify-email/request`
  - submit verification token to `POST /v1/auth/verify-email`

### Required frontend behavior

- Use JSON bodies for all `POST` requests
- Include `Content-Type: application/json`
- Keep the user token in memory or secure local storage
- Attach the token to the `Authorization` header for protected calls

### What is not yet required

- Google sign-in integration
- Twilio SMS verification

These can be added later once the frontend is wired to the core auth backend.

## What your friend should connect first

1. Registration screen → `POST /v1/auth/register`
2. Login screen → `POST /v1/auth/login`
3. After login, save `accessToken`
4. Profile page → `GET /v1/auth/profile`
5. Logout button → `POST /v1/auth/logout`
6. Password reset UI → request + confirm routes
7. Email verification UI → request + confirm routes

## Useful environment variables

The backend expects values from `.env` such as:

- `DB_TYPE`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `PASSWORD_RESET_SECRET`
- `EMAIL_VERIFICATION_SECRET`
- `PHONE_VERIFICATION_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `APP_URL`

## Notes

- The app automatically includes the auth routes under `/v1/auth`
- Use Postman or any HTTP client to test the backend manually
- The current code already supports real email delivery if SMTP is configured
