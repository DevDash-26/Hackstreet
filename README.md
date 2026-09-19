# UCL University Student Portal

A single platform giving students, staff, and parents unified access to university
life: announcements, events, societies, academic calendars, room bookings, support
services, and an AI assistant. Built as an npm-workspaces monorepo with a
React + TypeScript SPA and a small Express API; Supabase (Auth + PostgreSQL + RLS)
is the optional production backend.

## 1. Overview

- **Unified access (BR1)** — one login page with four persona roles that route to a
  role-aware dashboard and navigation tree.
- **33 business requirements** are surfaced as browsable, interactive sections
  (feed pages with interest / join / book / claim / request / save actions) plus
  role-specific dashboards. See `docs/requirements/business-requirements.md`.
- **Profile management** — every persona gets a real profile editor with
  role-specific sections (academic record, employment & research, admin access,
  ward details), persisted per persona.
- **Demo-first** — the app runs fully without any backend or credentials using a
  persisted "persona" session and mock data. Supabase can be enabled for real auth.

## 2. Feature highlights

| Area                   | What is implemented                                                             |
| ---------------------- | ------------------------------------------------------------------------------- |
| Authentication & roles | Login personas, `AuthProvider` (Supabase-ready), role-aware routing and nav     |
| Dashboards             | Student, academic staff, society staff, admin, parent dashboards                |
| Content sections       | 30+ sections backed by `features/sections/data.ts` (feeds, tags, meta, actions) |
| Room booking (BR8)     | Interactive booking grid with validation, persisted to localStorage             |
| Profile editing        | Per-persona profile manager with role-specific sections and per-persona saves   |
| AI assistant (BR33)    | "Mr. Damith" chat widget with role-aware suggestions and campus floor map       |
| Admin tools            | Finance analytics, WhatsApp targeted-message composer, notification centre      |
| Onboarding (BR14)      | Goal-gradient setup checklist                                                   |
| Theming                | Light / dark / system theme with persisted preference                           |

## 3. Technology stack

| Layer                | Technology                                            |
| -------------------- | ----------------------------------------------------- |
| Frontend             | React 19, TypeScript, Vite, Tailwind v4, Zustand      |
| UI primitives        | `@base-ui/react` (shadcn-style components)            |
| Backend              | Node.js, Express 5, TypeScript                        |
| Validation           | Zod (backend environment config)                      |
| Backend-as-a-service | Supabase (Auth, PostgreSQL, RLS) — optional           |
| Tooling              | npm workspaces, ESLint (flat config), Prettier, `tsx` |

## 4. Architecture

```
university-portal/
├── frontend/      React SPA (features/, pages/, components/, app/, services/)
├── backend/       Express API (currently health/liveness only)
├── shared/        Role catalogue + app constants shared by all workspaces
├── supabase/      Migrations + seed for the optional Supabase backend
├── scripts/       Env checks, Supabase type generation
├── docs/          Requirements, architecture, security, AI design
└── package.json   Workspaces + root scripts
```

- **Frontend** is a feature-based SPA. Routing lives in `app/router`, role-aware
  layout in `components/layout`, and business data in `features/<domain>/`.
- **Backend** is a stateless Express service exposing `GET /api/v1/health`. It is a
  deliberate seam: feature routers can be mounted under `backend/src/` as the
  hosted (service-role) surface grows.
- **Shared** is built to `dist/` before the other workspaces typecheck or run.

Full details: `docs/architecture/architecture.md`.

## 5. Getting started

```bash
npm install
npm run dev            # builds shared, then runs frontend + backend together
```

- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/api/v1/health

The app is usable immediately in demo mode. To enable real Supabase auth:

```bash
cp frontend/.env.example frontend/.env.local   # fill in Supabase values
```

## 6. Environment variables

Frontend (`frontend/.env.local`, optional — falls back to demo mode):

| Variable                        | Description                         |
| ------------------------------- | ----------------------------------- |
| `VITE_SUPABASE_URL`             | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key              |

Backend (`backend/.env`, optional):

| Variable   | Description           |
| ---------- | --------------------- |
| `NODE_ENV` | Default `development` |
| `PORT`     | Default `4000`        |

`.env*` files are gitignored; only `.env.example` files are committed. Run
`npm run check:env` to print the resolved configuration.

## 7. Development commands

| Command                                        | Action                                               |
| ---------------------------------------------- | ---------------------------------------------------- |
| `npm run dev`                                  | Build `shared`, run backend (4000) + frontend (5173) |
| `npm run dev:backend` / `npm run dev:frontend` | Start one side                                       |
| `npm run build`                                | Build `shared`, frontend, then backend               |
| `npm run typecheck`                            | Typecheck all workspaces                             |
| `npm run lint` / `npm run lint:fix`            | ESLint                                               |
| `npm run format` / `npm run format:check`      | Prettier                                             |
| `npm run check:env`                            | Print resolved `.env` configuration                  |

## 8. Database / Supabase (optional)

Migrations are plain SQL under `supabase/migrations/` and run through the Supabase
CLI. `20260919000000_rbac_announcements.sql` defines the active `user_roles` +
`announcements` model and RLS policies.

```bash
npm run supabase:start             # local stack (Docker)
npm run supabase:types             # regenerate TS types (needs SUPABASE_PROJECT_ID)
npm run supabase:stop
```

Seed data lives in `supabase/seed.sql`. See `docs/architecture/database.md`.

## 9. Roles

The single source of truth is `shared/src/constants/roles.ts`:

| Role             | Scope                                |
| ---------------- | ------------------------------------ |
| `student`        | Student-facing features              |
| `staff_academic` | Academic content + academic calendar |
| `staff_society`  | Society content + activities         |
| `admin`          | Portal administration                |
| `parent`         | Guardian view of student information |

See `docs/security/access-control.md`.

## 10. Testing & validation

There is no automated test runner in this scope. Every change is validated with:

```bash
npm run lint
npm run typecheck
npm run build
```

and a dev-server smoke test of `/` and the public assets.

## 11. Known limitations

- The AI assistant (`frontend/src/services/ai.ts`) is a deterministic mock with
  canned, keyword-driven answers — including the University College Sri Lanka floor
  map — and the conversation resets to the welcome message when the widget is
  closed. Wire a provider by replacing the function body.
- Profile edits persist to `localStorage` per persona; closing the assistant
  clears its chat history.
- WhatsApp delivery (`frontend/src/services/whatsapp.ts`) is a stub.
- Business requirements are demonstrated with client-side mock data; a subset maps
  to the Supabase `announcements` table.
- The backend exposes only a health endpoint; service-role write paths are not yet
  implemented.
