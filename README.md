# UCL University Student Portal

A role-based university portal prototype for students, academic staff, administrators, and parents. The project is structured as a TypeScript monorepo and demonstrates a modern campus experience with dashboards, announcements, bookings, onboarding, profile management, and an AI assistant.

## Project overview

This application is designed around a single portal experience where different user personas land on role-specific views after login. The codebase is intentionally built as a demo-first system: it works with mock/demo session data out of the box, while also including optional Supabase and server-side AI integration for future production use.

The product is centered around the following user goals:

- Give users one place to access university services and information
- Show different views depending on role and permissions
- Provide a polished portal experience for campus life
- Demonstrate AI assistance within an educational context
- Support future integration with real authentication and persistent backend data

## What is implemented

### 1. Role-based login experience
The app includes a persona-based sign-in screen with demo users for:

- Student
- Lecturer / Academic Staff
- Administrator
- Parent

This is implemented in `frontend/src/pages/login.tsx` and routed through the app router in `frontend/src/app/router/index.tsx`.

### 2. Role-specific dashboards
Each persona lands on a different dashboard:

- `frontend/src/pages/dashboards/lecturer-dashboard.tsx`
- `frontend/src/pages/dashboards/admin-dashboard.tsx`
- `frontend/src/pages/dashboards/parent-dashboard.tsx`
- `frontend/src/pages/portal-home.tsx` selects the correct dashboard based on the active role

The role model is centralized in `shared/src/constants/roles.ts`.

### 3. Portal shell and section-based navigation
The app uses a portal shell with section-level pages and role-aware routing:

- `frontend/src/components/layout/portal-shell.tsx`
- `frontend/src/pages/portal.tsx`
- `frontend/src/pages/portal-section.tsx`
- `frontend/src/features/sections/data.ts`

This provides a feed-style section system for information such as announcements, support, events, academic content, and other university activities.

### 4. Booking and operations features
The repository includes functionality for booking-related interactions and campus operations, including a booking grid and administrative views for facility management.

Relevant code:

- `frontend/src/features/bookings/booking-grid.tsx`
- `frontend/src/features/bookings/store.ts`
- `frontend/src/pages/dashboards/admin-dashboard.tsx`

### 5. Profile and personalization
The app includes profile-based data and user state management for each persona.

Relevant code:

- `frontend/src/features/profile/profile-page.tsx`
- `frontend/src/features/profile/profile-store.ts`
- `frontend/src/features/profile/profile-definitions.ts`

### 6. AI assistant
There is a built-in assistant experience called "Mr. Damith" which is designed to assist with campus-related queries.

Relevant code:

- `frontend/src/features/assistant/assistant-widget.tsx`
- `backend/src/routes/ai.ts`
- `backend/src/services/ai-provider.ts`
- `backend/src/services/ai-prompt.ts`

The AI call is server-side and expects an OpenAI-compatible provider. If the backend is not configured, the app falls back to a mock response path.

### 7. Admin and communication tools
The system includes admin-style management experiences such as:

- finance analytics
- notifications
- WhatsApp message composer
- onboarding checklist
- announcement and issue tracking

Relevant code:

- `frontend/src/features/finance/finance-analytics.tsx`
- `frontend/src/features/onboarding/setup-checklist.tsx`
- `frontend/src/features/whatsapp/composer.tsx`
- `frontend/src/app/store/notifications.ts`

## Tech stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS v4
- shadcn-style UI primitives using `@base-ui/react`
- Lucide icons

### Backend
- Node.js
- Express 5
- TypeScript
- Zod validation
- Helmet security middleware

### Data / backend services
- Supabase
  - Auth
  - PostgreSQL
  - Row Level Security (RLS)
- SQL migrations stored under `supabase/migrations/`

### Shared / tooling
- npm workspaces monorepo
- TypeScript shared package
- ESLint
- Prettier
- tsx
- concurrently

### AI integration
- OpenAI-compatible backend integration through Express
- Configurable via environment variables
- Defaulted to a Groq-like model configuration described in the project docs

## Architecture

The repository is organized as a multi-package app:

```text
university-portal/
├── frontend/        React + TypeScript SPA
├── backend/         Express API
├── shared/          Shared constants and role definitions
├── supabase/        Database migrations and seed data
├── scripts/         Environment and type-generation helpers
├── docs/            Requirements, architecture, AI docs, and reports
├── package.json     Workspace configuration and root scripts
├── README.md
└── .gitignore
```

### Frontend architecture
The frontend follows a feature-driven structure:

- `src/app/` for app setup, router, state providers
- `src/components/` for reusable UI and layout
- `src/features/` for business-specific feature modules
- `src/pages/` for route-level screens and dashboards
- `src/services/` for API integration

### Backend architecture
The backend is intentionally lightweight and modular:

- `backend/src/app.ts` creates the Express app
- `backend/src/routes/ai.ts` exposes assistant routes
- `backend/src/services/` holds provider logic and prompt-building logic
- `backend/src/middleware/` contains request logging, error handling, and 404 handling

### Shared layer
The shared package centralizes cross-app rules and constants, especially for role definitions.

## Role model

The app is built around the following personas:

- `student`
- `staff_academic`
- `staff_society`
- `admin`
- `parent`

Defined in:

- `shared/src/constants/roles.ts`

This role model is used by routing and access checks throughout the app.

## Demo and local execution

### Prerequisites
- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

This starts the backend and frontend together.

### Individual services

```bash
npm run dev:backend
npm run dev:frontend
```

### Frontend URL
- http://localhost:5173

### Backend health endpoint
- http://localhost:4000/api/v1/health

## Demo login personas

The app includes pre-filled demo credentials for mock sign-ins. This is intentional demo mode and is defined in `frontend/src/pages/login.tsx`.

Example personas:

- Student: `nimal.perera@ucl.ac.lk` / `demo1234`
- Lecturer: `sanjaya.s@ucl.ac.lk` / `demo1234`
- Administrator: `priyanka.s@ucl.ac.lk` / `demo1234`
- Parent: `sharon.p@email.lk` / `demo1234`

## Environment variables

### Frontend (optional)
If using Supabase auth or live backend services, add a local env file:

```bash
cp frontend/.env.example frontend/.env.local
```

Required variables may include:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Backend (optional)
The backend supports optional AI configuration:

- `NODE_ENV`
- `PORT`
- `AI_API_KEY`
- `AI_PROVIDER_URL`
- `AI_MODEL`
- `AI_TIMEOUT_MS`

The project includes `.env.example` files and a script to check resolved environment values:

```bash
npm run check:env
```

## Database and Supabase setup

The repo includes a Supabase configuration and migration files:

- `supabase/config.toml`
- `supabase/migrations/`
- `supabase/seed.sql`

This is a strong sign that the app is planned to evolve from a mock/demo system into a production-ready role-based portal with real data and security rules.

Useful scripts:

```bash
npm run supabase:start
npm run supabase:types
npm run supabase:stop
```

## Verification and current state

The project includes standard validation scripts:

```bash
npm run build
npm run typecheck
npm run lint
```

This project is best understood as a polished prototype / MVP rather than a fully productionized university system. The readme and codebase clearly show that the app is designed to demonstrate a concept and provide a reusable architecture for real deployment later.

## Key documentation

The repository includes design and product docs under `docs/`:

- `docs/requirements/business-requirements.md`
- `docs/requirements/non-functional-requirements.md`
- `docs/architecture/architecture.md`
- `docs/architecture/database.md`
- `docs/security/access-control.md`
- `docs/ai/ai-architecture.md`
- `docs/report/DevDash26-report.md`

## Presentation summary

This project is a modern university portal MVP built with a TypeScript monorepo approach. It combines a role-based frontend experience, a lightweight Express backend, and optional Supabase integration to demonstrate how a university ecosystem can unify login, dashboards, booking, communication, and AI assistance into one digital portal.

It is especially suitable for presentations because it shows:

- a complete product vision
- strong frontend UX design
- real role-based portal behavior
- modern full-stack architecture
- optional AI and data integration paths
- maintainable modular structure

## Notes

- The app works immediately in demo mode without external credentials.
- Real auth and database connectivity are optional and can be enabled through Supabase.
- AI assistant support is present but requires backend configuration to operate with a live provider.

