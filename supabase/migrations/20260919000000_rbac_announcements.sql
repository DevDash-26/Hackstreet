-- ============================================================================
-- RBAC + Announcements (DevDash'26 hackathon scope)
-- ============================================================================
-- Adds:
--   1. user_roles      - links every auth user to exactly one portal role
--   2. announcements   - role-gated content table
--   3. RLS policies    - everyone reads announcements; only the matching staff
--                        role can create/update/delete them
--
-- Role model (stored as plain text with a CHECK constraint so the enum lives
-- in one obvious place):
--   - 'student'          -> view-only access
--   - 'staff_academic'   -> writes OFFICIAL announcements + academic calendar
--   - 'staff_society'    -> writes SOCIETY announcements + society activities
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. user_roles
-- ----------------------------------------------------------------------------

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  role text not null check (role in ('student', 'staff_academic', 'staff_society')),
  created_at timestamptz not null default now()
);

comment on table public.user_roles is
  'Maps each Supabase Auth user to exactly one portal role.';

-- Each user can only SELECT their own role row (needed by the frontend to
-- render role-aware UI). Assigning roles is intentionally NOT exposed to users
-- (no insert/update policies) so a user can never escalate their own role.
alter table public.user_roles enable row level security;

create policy "user_roles_select_own"
  on public.user_roles
  for select
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 2. announcements
-- ----------------------------------------------------------------------------

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) <= 5000),
  category text not null check (category in ('official', 'society')),
  author_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.announcements is
  'Portal announcements. Category drives the RLS write rules: official -> staff_academic, society -> staff_society.';

create index announcements_category_idx on public.announcements (category);
create index announcements_created_at_idx on public.announcements (created_at desc);

alter table public.announcements enable row level security;

-- READ: every signed-in user (student or staff) can read every announcement.
-- This is the "single source of truth" model - visibility is uniform.
create policy "announcements_select_all_authenticated"
  on public.announcements
  for select
  using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 3. Role-check helper used by the RLS policies below
-- ----------------------------------------------------------------------------

-- SECURITY DEFINER lets this read `user_roles` even though RLS there restricts
-- each user to their own row; the predicate still pins the lookup to the
-- caller via auth.uid(), so it can only ever answer for the current user.
-- An empty search_path + fully-qualified table name prevents search-path
-- hijacking.
create or replace function public.user_has_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid() and role = required_role
  );
$$;

-- WRITE - official announcements: only staff_academic.
create policy "announcements_insert_official_staff"
  on public.announcements
  for insert
  with check (
    category = 'official'
    and author_id = auth.uid()
    and public.user_has_role('staff_academic')
  );

-- WRITE - society announcements: only staff_society.
create policy "announcements_insert_society_staff"
  on public.announcements
  for insert
  with check (
    category = 'society'
    and author_id = auth.uid()
    and public.user_has_role('staff_society')
  );

-- UPDATE - each staff role may update its own category, and never move a row
-- into a category they do not own (the WITH CHECK re-asserts the category).
create policy "announcements_update_official_staff"
  on public.announcements
  for update
  using (category = 'official' and public.user_has_role('staff_academic'))
  with check (category = 'official' and public.user_has_role('staff_academic'));

create policy "announcements_update_society_staff"
  on public.announcements
  for update
  using (category = 'society' and public.user_has_role('staff_society'))
  with check (category = 'society' and public.user_has_role('staff_society'));

-- DELETE - mirrored for both staff roles within their own category.
create policy "announcements_delete_official_staff"
  on public.announcements
  for delete
  using (category = 'official' and public.user_has_role('staff_academic'));

create policy "announcements_delete_society_staff"
  on public.announcements
  for delete
  using (category = 'society' and public.user_has_role('staff_society'));

-- Keep updated_at fresh on edits (function created in the 001_init migration).
create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. Grants
-- ----------------------------------------------------------------------------
-- The PostgREST API (and the React frontend) authenticates as the anon /
-- authenticated roles, so the new tables must be granted to them or every
-- query returns "permission denied".

grant select on public.user_roles to authenticated;
grant select, insert, update, delete on public.announcements to authenticated;

grant execute on function public.user_has_role(text) to authenticated;