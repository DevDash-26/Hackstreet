# UCL University Student Portal

A role-based university portal prototype built as a TypeScript monorepo. The project is designed for students, academic staff, administrators, and parents, and it demonstrates a single-campus digital experience through role-aware dashboards, service feeds, bookings, announcements, profile management, and an AI assistant.

## Project overview

This application is a demo-first university portal. It runs immediately with mock persona data, while also being structured for future real-world integration with Supabase authentication, PostgreSQL persistence, and AI-powered support.

The project is centered on one main idea: every user signs in as a persona and lands on a different, role-aware version of the same campus portal instead of using separate disconnected apps.

## What is implemented

### 1. Role-based login and persona selection
The app includes a persona-based sign-in screen with demo users for:

- Student
- Lecturer / Academic Staff
- Administrator
- Parent

This flow is implemented in `frontend/src/pages/login.tsx` and controlled through the router in `frontend/src/app/router/index.tsx`.

### 2. Role-aware landing pages and dashboards
The application chooses a different landing dashboard based on the active role.

- `frontend/src/pages/portal-home.tsx`
- `frontend/src/pages/dashboards/admin-dashboard.tsx`
- `frontend/src/pages/dashboards/lecturer-dashboard.tsx`
- `frontend/src/pages/dashboards/parent-dashboard.tsx`

The role model is centralized in `shared/src/constants/roles.ts`.

### 3. Portal shell and section-based navigation
The main app uses a shared portal shell that routes to section-based pages and information feeds.

This includes:

- `frontend/src/components/layout/portal-shell.tsx`
- `frontend/src/pages/portal.tsx`
- `frontend/src/pages/portal-section.tsx`
- `frontend/src/features/sections/data.ts`

The section catalogue includes many campus services and information areas such as:

- timetable and academic schedule
- courses and assignments
- announcements and updates
- support services
- financial support
- wellbeing and emergency info
- IT support
- bookings and facilities
- student life and societies
- events and volunteering

### 4. Booking and campus operations flows
The platform includes booking and operations interactions for campus facilities and services.

Relevant files:

- `frontend/src/features/bookings/booking-grid.tsx`
- `frontend/src/features/bookings/store.ts`
- `frontend/src/pages/dashboards/admin-dashboard.tsx`

### 5. Profile and personalization
The project includes persona-based profile and state management for different users.

Relevant files:

- `frontend/src/features/profile/profile-page.tsx`
- `frontend/src/features/profile/profile-store.ts`
- `frontend/src/features/profile/profile-definitions.ts`

### 6. AI assistant
The app includes an AI assistant experience for campus-related queries.

Relevant files:

- `frontend/src/features/assistant/assistant-widget.tsx`
- `backend/src/routes/ai.ts`
- `backend/src/services/ai-provider.ts`
- `backend/src/services/ai-prompt.ts`

The backend houses the AI endpoint and validates request payloads using Zod. If ai configuration is missing, the flow can fall back to a mock response path.

### 7. Admin tools and communication features
The admin experience includes supporting operations like:

- finance analytics
- notifications
- WhatsApp message composer
- onboarding checklist
- maintenance and issue tracking
- announcements

Examples:

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
- Lucide React
- `@base-ui/react` for base UI primitives

### Backend
- Node.js
- Express 5
- TypeScript
- Zod validation
- Helmet security middleware

### Data and auth layer
- Supabase
  - Auth
  - PostgreSQL
  - Row Level Security (RLS)
- SQL migration files under `supabase/migrations/`

### Shared / tooling
- npm workspaces monorepo
- shared TypeScript package
- ESLint
- Prettier
- tsx
- concurrently

### AI integration
- OpenAI-compatible backend integration
- Configurable through environment variables
- Optional live provider support
- Mock fallback path when not configured

## Architecture

The repository is structured as a multi-package application:

```text
university-portal/
├── frontend/        React + TypeScript portal frontend
├── backend/         Express API for app health and AI endpoints
├── shared/          Shared utilities and role definitions
├── supabase/        Database migrations and seed data
├── scripts/         Environment and type generation helpers
├── docs/            Requirements, architecture, AI, and security docs
├── package.json     Workspace configuration and root scripts
├── README.md
├── .gitignore
└── .prettierrc.json
```

### Frontend architecture
The frontend is organized in a feature-oriented structure:

- `src/app/` — router, providers, and app-wide state
- `src/components/` — shared UI and layout components
- `src/features/` — business modules and each feature area
- `src/pages/` — route-level screens and dashboards
- `src/services/` — API integration and service calls

### Backend architecture
The backend is intentionally lightweight and modular:

- `backend/src/app.ts` initializes the Express app
- `backend/src/routes/ai.ts` exposes the assistant API route
- `backend/src/services/` contains AI provider logic and prompt construction
- `backend/src/middleware/` handles request logging, error handling, and 404s

### Shared layer
`shared` is used for cross-workspace constants and shared definitions, especially role keys and values.

## Role model

The application uses the following role keys:

- `student`
- `staff_academic`
- `staff_society`
- `admin`
- `parent`

Defined in:

- `shared/src/constants/roles.ts`

This role model is used for routing, persona switching, and service access patterns.

## Demo and local execution

### Prerequisites
- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run the application locally

```bash
npm run dev
```

This boots both the frontend and backend together.

### Run individual services

```bash
npm run dev:frontend
npm run dev:backend
```

### Local URLs
- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/api/v1/health

## Demo login personas

The app includes pre-filled demo credentials for easy demonstrations.

Example accounts:

- Student: `nimal.perera@ucl.ac.lk` / `demo1234`
- Lecturer: `sanjaya.s@ucl.ac.lk` / `demo1234`
- Administrator: `priyanka.s@ucl.ac.lk` / `demo1234`
- Parent: `sharon.p@email.lk` / `demo1234`

## Environment variables

### Frontend (optional)
If using Supabase auth or live services, add a local environment file:

```bash
cp frontend/.env.example frontend/.env.local
```

Typical variables include:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Backend (optional)
The backend supports AI configuration through environment variables such as:

- `NODE_ENV`
- `PORT`
- `AI_API_KEY`
- `AI_PROVIDER_URL`
- `AI_MODEL`
- `AI_TIMEOUT_MS`

There is also a script to check resolved configuration:

```bash
npm run check:env
```

## Database and Supabase setup

The project includes a configured Supabase setup and SQL migrations:

- `supabase/config.toml`
- `supabase/migrations/`
- `supabase/seed.sql`

This indicates the app is designed to evolve from a demo-first prototype into a platform with real data layers and auth policies.

Useful scripts:

```bash
npm run supabase:start
npm run supabase:types
npm run supabase:stop
```

## Validation commands

```bash
npm run build
npm run typecheck
npm run lint
```

## Documentation

The repository includes support documents under `docs/`:

- `docs/requirements/business-requirements.md`
- `docs/requirements/non-functional-requirements.md`
- `docs/architecture/architecture.md`
- `docs/architecture/database.md`
- `docs/security/access-control.md`
- `docs/ai/ai-architecture.md`
- `docs/report/DevDash26-report.md`

## Presentation summary

This project is a role-based university portal MVP built with a modern TypeScript monorepo architecture. It combines a polished React frontend, a lightweight Express backend, optional Supabase integration, and AI assistant support. The app demonstrates how a university could centralize academic services, operational dashboards, student support, communication, and service discovery in a single digital campus experience.

It is especially strong for presentations because it shows:

- a complete product flow from login to portal experience
- role-aware dashboard design
- a scalable full-stack project structure
- modern UI and UX patterns
- optional AI and database integration paths
- acceptable MVP-level architecture for future production expansion

## Notes

- The app works immediately in demo mode without external credentials.
- Real authentication and database connectivity are optional and can be enabled through Supabase.
- AI assistant support requires backend configuration to use a live provider.
