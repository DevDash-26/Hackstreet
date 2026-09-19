# Non-Functional Requirements

## NFR1 — Usability

- Consistent navigation and layout across the portal (`components/layout` plus the
  role-aware navigation tree in `constants/navigation.ts`).
- Design primitives only inside `frontend/src/components/ui/`.
- Responsive: usable on desktop, tablet, and mobile.

## NFR2 — Performance & Scalability

- The Node/Express backend is stateless; horizontally scalable behind Supabase.
- Database moved out of the application runtime — Supabase manages PostgreSQL,
  connection pooling, and scaling.
- The Vite frontend builds static assets served independently.

## NFR3 — Reliability & Availability

- Supabase provides managed availability, backups, and point-in-time recovery for the database.
- The Express app centralizes error handling (`middleware/error-handler.ts`) so no
  uncaught request error escapes as a raw stack trace.
- Graceful shutdown in `backend/src/server.ts`.
- Health endpoint `GET /api/v1/health` for uptime checks.

## NFR4 — Security & Privacy

- Authentication via Supabase Auth (never a hand-rolled credential store) when
  enabled; demo mode stores no credentials.
- Secrets only in `.env` (never committed); only the publishable key is exposed to
  the browser.
- Row Level Security is enabled on the Supabase tables the app reads.
- Environment configuration is Zod-validated at boot.
- Strict TypeScript; no `any` in application code.

## NFR5 — Maintainability

- Feature/domain-based frontend; each feature owns its components, store, and data.
- Shared role catalogue and constants live in `shared/` to avoid drift between
  workspaces.
- ESLint + Prettier enforced repository-wide.

## NFR6 — Robustness

- Environment validation fails fast at boot (Zod schema in `backend/src/config/env.ts`).
- Error handling is centralized so failures are caught and logged consistently.
- Import errors surface immediately (strict TS + `verbatimModuleSyntax`).
