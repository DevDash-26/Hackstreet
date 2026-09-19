# API

## Conventions

- Base path: `/api/v1` (`API_PREFIX` from `shared`).
- JSON bodies; ISO-8601 timestamps; string UUIDs.
- Errors: centralized handler in `backend/src/middleware/error-handler.ts`.

### Error shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {}
  }
}
```

Error codes (see `backend/src/utils/api-error.ts`):

| Code               | HTTP | Meaning                       |
| ------------------ | ---- | ----------------------------- |
| `BAD_REQUEST`      | 400  | Malformed request             |
| `UNAUTHORIZED`     | 401  | Missing/invalid token         |
| `FORBIDDEN`        | 403  | Authenticated but not allowed |
| `NOT_FOUND`        | 404  | Resource does not exist       |
| `CONFLICT`         | 409  | Unique-constraint violation   |
| `VALIDATION_ERROR` | 400  | Zod validation failed         |
| `INTERNAL_ERROR`   | 500  | Unexpected error              |

## Endpoints

| Method | Path             | Description    | Auth   |
| ------ | ---------------- | -------------- | ------ |
| GET    | `/api/v1/health` | Liveness probe | public |

Feature routes will be mounted under the API router as they are implemented.

## Middleware chain

`helmet` → `express.json({ limit: '1mb' })` → `requestLogger` → routes →
`notFound` → `errorHandler`

Authentication/authorization and request-validation middleware are not part of the
current backend; when hosted (service-role) features are added they should be
reintroduced ahead of the feature routers:

- `authenticate` — verify a Supabase JWT and load the actor into `req.user`.
- `requireAuthenticated` / `requireRoles` / `requirePermission` — authorize.
- `validate(schema)` — Zod validation for body/query/params.
