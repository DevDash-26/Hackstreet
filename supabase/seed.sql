-- ============================================================================
-- Seed + mock data for the DevDash'26 hackathon scope
-- ============================================================================
-- Run against a project created from the migrations. Roles are seeded into
-- `user_roles` by matching against real Supabase Auth accounts by email, so
-- the insert becomes no-op until you create the accounts below.
--
--  1. Create three users in Supabase Auth (Dashboard -> Authentication -> Add user,
--     or `supabase.auth.signUp`) with these emails:
--        student@ucl.edu.lk          -> STUDENT
--        academic@ucl.edu.lk         -> staff_academic
--        society@ucl.edu.lk          -> staff_society
--  2. Re-run this script (SQL editor or `supabase db seed`).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Role assignment (one row per user)
-- ----------------------------------------------------------------------------

insert into public.user_roles (user_id, role)
select id, 'student'
from auth.users
where email = 'student@ucl.edu.lk'
on conflict (user_id) do nothing;

insert into public.user_roles (user_id, role)
select id, 'staff_academic'
from auth.users
where email = 'academic@ucl.edu.lk'
on conflict (user_id) do nothing;

insert into public.user_roles (user_id, role)
select id, 'staff_society'
from auth.users
where email = 'society@ucl.edu.lk'
on conflict (user_id) do nothing;

-- ----------------------------------------------------------------------------
-- 2. Dummy announcements (both categories so every role sees content)
-- ----------------------------------------------------------------------------

insert into public.announcements (title, body, category, author_id)
select
  'Exam timetable released',
  'The final examination timetable for this semester is now published on the academic calendar.',
  'official',
  id
from auth.users
where email = 'academic@ucl.edu.lk'
on conflict do nothing;

insert into public.announcements (title, body, category, author_id)
select
  'Library extended hours during exam week',
  'The library will stay open until 10 PM from Monday to Friday during the exam period.',
  'official',
  id
from auth.users
where email = 'academic@ucl.edu.lk'
on conflict do nothing;

insert into public.announcements (title, body, category, author_id)
select
  'Film society screening this Friday',
  'Join us for a screening of Interstellar in lecture hall B at 5 PM. Snacks provided.',
  'society',
  id
from auth.users
where email = 'society@ucl.edu.lk'
on conflict do nothing;

insert into public.announcements (title, body, category, author_id)
select
  'Football trials open to all students',
  'Trials for the university football team will be held on the main ground on Sunday at 8 AM.',
  'society',
  id
from auth.users
where email = 'society@ucl.edu.lk'
on conflict do nothing;