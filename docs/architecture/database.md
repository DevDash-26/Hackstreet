# Database

## Platform

- **Supabase PostgreSQL** is the only database. There is no self-hosted or separate
  Postgres server and no ORM — queries use the PostgREST-style Supabase client with
  strongly typed data access.
- Local development uses `supabase start` (Docker); hosted environments use a linked
  Supabase project. Migrations are SQL files under `supabase/migrations/`.

## Schema strategy

Feature tables are added incrementally through migrations. The initial migration
(`20260101000000_init.sql`) creates only the **auth/authorization foundation**:

| Table                     | Purpose                                                       | RLS                                 |
| ------------------------- | ------------------------------------------------------------- | ----------------------------------- |
| `public.roles`            | Legacy role catalogue                                         | authenticated read only             |
| `public.permissions`      | Legacy permission catalogue (e.g. `announcements:create`)     | authenticated read only             |
| `public.role_permissions` | Legacy many-to-many role → permission                         | authenticated read only             |
| `public.profiles`         | Application-specific user info linked 1:1 to `auth.users(id)` | self read only, service-role writes |

> The active authorization model is the `user_roles` + `announcements` schema added
> in `20260919000000_rbac_announcements.sql` (role text with a CHECK constraint and
> category-scoped RLS write policies). The `roles`/`permissions`/`profiles` tables
> from the initial migration are retained for compatibility but are not read by the
> current frontend.

### profiles ↔ auth.users

- Profiles are created automatically by the `handle_new_user` trigger when a user
  signs up through Supabase Auth.
- Application-specific information (name, role, preferences) lives in `profiles`;
  authentication credentials never leave Supabase Auth.
- Role assignment via `profiles.role_id` is **service-role only** — an RLS policy
  prevents users from escalating their own role.

## Future tables (BR-driven, not created yet)

Each BR feature will contribute tables in later migrations, e.g.:

- `announcements`, `events` (+ interest registrations), `academic_calendar_entries`
- `faqs`, `bookings`, `societies` (+ `society_memberships`), `lost_found_items`
- `feedback`, `content` (versioned portal content for BR33 retrieval), `audit_logs`

### Design rules

- Every write path centralizes on UUID primary keys (`gen_random_uuid()`).
- `created_at` / `updated_at` maintained via defaults and the `set_updated_at` trigger.
- Composite-key joins (e.g. `role_permissions`) keep `on delete cascade`.
- Audit trails: mutating operations are recorded in `audit_logs` (service role).

## RLS model

- Enabled on all tables; applied **in addition to**, never instead of, backend checks.
- Users read only their own rows unless a feature explicitly requires otherwise
  (backed by a policy + a service-role backend endpoint).
- `role_id` on profiles is not user-writable.

## Types

- `supabase gen types` output is written to
  `frontend/src/lib/supabase/database.types.ts` via `npm run supabase:types`
  (requires `SUPABASE_PROJECT_ID`). Generate and commit it when the schema changes.
