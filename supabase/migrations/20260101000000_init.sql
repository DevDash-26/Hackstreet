-- Foundation schema for the university student portal.
-- This migration deliberately creates ONLY the authentication/authorization
-- foundation (roles, permissions, profiles) linked to Supabase Auth.
-- Feature tables (announcements, events, bookings, ...) are added in later migrations.

-- ============================================================================
-- Roles
-- ============================================================================

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- Permissions
-- ============================================================================

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

create index role_permissions_permission_id_idx on public.role_permissions (permission_id);

-- ============================================================================
-- Profiles (linked to Supabase Auth users)
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  role_id uuid references public.roles (id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_id_idx on public.profiles (role_id);

-- Auto-create a profile when a user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger roles_set_updated_at
  before update on public.roles
  for each row execute function public.set_updated_at();

create trigger permissions_set_updated_at
  before update on public.permissions
  for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.profiles enable row level security;

-- Authenticated users may read role/permission metadata (used for UI rendering).
create policy "authenticated can read roles"
  on public.roles for select
  using (auth.role() = 'authenticated');

create policy "authenticated can read permissions"
  on public.permissions for select
  using (auth.role() = 'authenticated');

create policy "authenticated can read role_permissions"
  on public.role_permissions for select
  using (auth.role() = 'authenticated');

-- Users may only read their own profile. Writing to profiles (including role
-- assignment) is intentionally reserved for the backend service-role client so
-- users cannot escalate their own role.
create policy "user can read own profile"
  on public.profiles for select
  using (auth.uid() = id);