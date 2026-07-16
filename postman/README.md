# AI Native Real Estate Postman Collection

This folder contains a ready-made Postman collection for your local backend testing.

## Files

- `AI-Native-Real-Estate-Platform.postman_collection.json`
- `AI-Native-Real-Estate-Platform.postman_environment.json`

## How to use

1. Open Postman.
2. Import the collection file.
3. Import the environment file.
4. Select the `AI Native Real Estate Local` environment.
5. Start your backend locally on `http://localhost:3000`.
6. Use the `Register` request to create a user.
7. Use the `Login` request and save the returned `accessToken`.
8. Add `{{accessToken}}` to the `Authorization` header for protected requests.

## Endpoints included

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/logout`
- `POST /v1/auth/password-reset/request`
- `POST /v1/auth/password-reset`
- `POST /v1/auth/verify-email/request`
- `POST /v1/auth/verify-email`
- `GET /v1/auth/profile`

## Notes

- Use `{{baseUrl}}` as the base URL for all requests.
- Replace placeholder tokens in request bodies with actual tokens from email responses.
