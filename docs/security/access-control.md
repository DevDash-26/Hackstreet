# Access Control

## Authentication — Supabase (optional) + demo mode

- When configured, all credentials live in Supabase Auth (`auth.users`). We do
  **not** duplicate users or implement our own password/JWT system.
- `frontend/src/app/providers/auth-provider.tsx` hydrates from
  `supabase.auth.getSession()` + `onAuthStateChange` and reads the caller's role
  from `public.user_roles`.
- Without Supabase environment variables the app runs in **demo (persona) mode**:
  the login screen records a persona in a persisted Zustand store, and
  `use-portal-auth` resolves the effective role from either source.

## Roles

Roles are a single source of truth: `shared/src/constants/roles.ts`, mirrored by
the `user_roles` CHECK constraint in
`supabase/migrations/20260919000000_rbac_announcements.sql`.

| Role             | Scope                                |
| ---------------- | ------------------------------------ |
| `student`        | Student-facing features (view-only)  |
| `staff_academic` | Official announcements, calendar     |
| `staff_society`  | Society announcements and activities |
| `admin`          | Portal administration                |
| `parent`         | Guardian view of student information |

## Enforcement today

| Layer              | Status                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| Supabase RLS       | `user_roles` (self-read) and `announcements` (read-all, role-gated writes) |
| Backend middleware | Not implemented — the API currently exposes only `/api/v1/health`          |
| Frontend routing   | `RoleRoute` + role-aware navigation limit reachable screens (UX only)      |

> Never rely on frontend routing alone. When hosted features are added, enforce
> authorization in the backend and in RLS policies.

## Principles

- The frontend uses the **publishable (anon) key only**.
- The service-role key, when used, must live server-side only and never ship in a
  client bundle.
- Role assignment is service-role only; `user_roles` has no user-facing write
  policy, so a user can never escalate their own role.
