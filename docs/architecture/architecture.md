# Architecture

## Overview

A monorepo (`npm workspaces`) containing a React/Vite frontend, a small Node/Express
API, a shared constants package, an optional Supabase backend, and supporting
scripts.

```
university-portal/
├── frontend/      React + TypeScript + Vite + Tailwind + shadcn-style primitives
├── backend/       Node + Express + TypeScript (health/liveness API)
├── shared/        Role catalogue + app constants shared between workspaces
├── docs/          Requirements, architecture, security, AI design
├── scripts/       Env checks, Supabase type generation
├── supabase/      Supabase CLI project (migrations, seed, config)
├── .gitignore
├── README.md
└── package.json   Workspaces + root scripts
```

## Key decisions

- **Demo-first frontend.** The app runs without any backend or credentials: a
  persisted persona store (`app/store/demo-session.ts`) drives role-aware routing,
  and feature sections render mock data. This keeps the hackathon build runnable on
  any machine.
- **Supabase is the optional production platform.** When `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_PUBLISHABLE_KEY` are set, `AuthProvider` hydrates from
  `supabase.auth.getSession()` + `onAuthStateChange` and reads the role from
  `public.user_roles`; otherwise it falls back to the persona session.
- **The Express backend is a thin, stateless API layer.** It currently exposes only
  `GET /api/v1/health`. It is the intended seam for service-role operations
  (admin mutations, role assignment, cross-user reads, AI retrieval) as hosted
  features are added.
- **No SSR.** The frontend is a plain Vite SPA.

## Frontend

```
frontend/src/
├── app/            router (protected/role routes), providers, zustand stores
├── components/
│   ├── ui/         design primitives (button, card, dialog, form, ...)
│   └── layout/     shell, sidebar, header, search, theme toggle, brand
├── constants/      navigation tree, role badge metadata, app name
├── features/       bookings, sections, assistant, onboarding, finance, whatsapp
├── hooks/          use-portal-auth (auth + persona bridge)
├── lib/            utils (cn), supabase client
├── pages/          login, portal home, section page, dashboards, not-found
├── services/       ai, whatsapp
├── styles/         Tailwind entry + design tokens
└── types/          shared frontend types
```

- Routing shell in `frontend/src/app/router`:
  - `protected-route.tsx` — blocks unauthenticated users.
  - `role-route.tsx` — restricts routes to a set of roles (UX only; real
    enforcement belongs at the RLS/backend layer).
- Global state with Zustand: theme, demo persona, bookings, assistant chat,
  onboarding checklist, and notifications.
- The role-aware navigation tree lives in `constants/navigation.ts`; sections are
  registered in `features/sections/data.ts`.

## Backend

```
backend/src/
├── config/env.ts       Zod-validated environment (fails fast at boot)
├── middleware/
│   ├── error-handler.ts   Central JSON error responses
│   ├── logging.ts         Structured request logging
│   └── not-found.ts       404 for unknown routes
├── lib/logger.ts       Leveled JSON logger
├── utils/api-error.ts  Typed ApiError + ErrorCode
├── app.ts              Express app (helmet, JSON limit, logging, health)
└── server.ts           Bootstrap + graceful shutdown
```

- Env schema covers `NODE_ENV` and `PORT` only; the service boots without secrets.
- Error handling is centralized so no unhandled request error escapes as a stack
  trace, and the process shuts down gracefully on SIGINT/SIGTERM.

## Shared package

`shared/src/constants` is the single source of truth for `APP_NAME`, `API_PREFIX`,
and the role catalogue (`RoleKeys`, `ROLE_KEYS`, `isRoleKey`). It is built to
`dist/` before the frontend/backend typecheck or run.

## Supabase project (`supabase/`)

- `config.toml` — local CLI configuration.
- `migrations/` — SQL migrations. `20260101000000_init.sql` is the original
  auth/authorization foundation; `20260919000000_rbac_announcements.sql` defines the
  active `user_roles` + `announcements` model and RLS policies.
- `seed.sql` — idempotent seed data.

## Development flow

`npm run dev` builds `shared`, then runs backend (`tsx watch`, port 4000) and
frontend (Vite, port 5173) concurrently via `concurrently`. The Vite dev server
proxies `/api` → `http://localhost:4000`.

See `README.md` for commands.
